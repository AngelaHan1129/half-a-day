# ============================================================
# backend/emedding-model/main.py
# ============================================================
import os
import io
import traceback
import uvicorn
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, UnidentifiedImageError
from ultralytics import YOLO
from routes.related import router as related_router
from routes.embed import router as embed_router

app = FastAPI(
    title="小半天 Embedding Service",
    description="提供小半天知識的向量語意搜尋、相關特色推薦與 YOLO 影像辨識",
    version="1.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:8080",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
YOLO_MODEL_PATH = os.path.join(BASE_DIR, "runs", "half_a_day-7", "weights", "best.pt")

IGNORED_CLASSES = {"person"}
YOLO_CONFIDENCE = 0.25

print(f"⏳ 正在載入 YOLO 模型: {YOLO_MODEL_PATH}...")
try:
    if os.path.exists(YOLO_MODEL_PATH):
        yolo_model = YOLO(YOLO_MODEL_PATH)
        print("✅ YOLO 模型載入完成")
    else:
        raise FileNotFoundError(f"找不到檔案，請確認路徑是否存在: {YOLO_MODEL_PATH}")
except Exception as e:
    print(f"❌ YOLO 模型載入失敗: {e}")
    yolo_model = None


@app.get("/")
def root():
    return {"message": "Embedding + YOLO API running"}


@app.post("/api/detect")
async def detect(file: UploadFile = File(...)):
    if yolo_model is None:
        raise HTTPException(status_code=500, detail="YOLO model is not loaded.")

    try:
        content = await file.read()
        if not content:
            raise HTTPException(status_code=400, detail="Empty uploaded file")

        try:
            image = Image.open(io.BytesIO(content)).convert("RGB")
        except UnidentifiedImageError:
            raise HTTPException(status_code=400, detail="Uploaded file is not a valid image")

        print(f"\n✅ 收到前端影像，尺寸: {image.size}，準備丟入 YOLO...")

        results = yolo_model.predict(image, conf=YOLO_CONFIDENCE, verbose=False)
        result = results[0]

        detections = []
        ignored_detections = []

        for box in result.boxes:
            cls_id = int(box.cls[0])
            conf = float(box.conf[0])
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            class_name = result.names[cls_id]

            detection_item = {
                "className": class_name,
                "confidence": conf,
                "bbox": {
                    "x1": float(x1),
                    "y1": float(y1),
                    "x2": float(x2),
                    "y2": float(y2),
                },
            }

            if class_name in IGNORED_CLASSES:
                ignored_detections.append(detection_item)
                continue

            detections.append(detection_item)

        detections.sort(key=lambda x: x["confidence"], reverse=True)

        print(f"🎯 原始辨識結果: 共找到 {len(result.boxes)} 個物件")
        if ignored_detections:
            ignored_names = ", ".join(
                f"{item['className']}({item['confidence']:.2f})" for item in ignored_detections
            )
            print(f"🚫 已忽略類別: {ignored_names}")

        print(f"✅ 過濾後結果: 共保留 {len(detections)} 個物件")
        if detections:
            print(f"🏆 最高機率物件: {detections[0]['className']} ({detections[0]['confidence']:.2f})")
        else:
            print("⚠️ 過濾後沒有可顯示的物件")

        return {
            "count": len(detections),
            "topDetection": detections[0] if detections else None,
            "detections": detections,
        }

    except HTTPException:
        raise
    except Exception as e:
        print("==== /api/detect ERROR ====")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


app.include_router(related_router, prefix="/api/embedding", tags=["Related"])
app.include_router(embed_router, prefix="/api/embedding", tags=["Embed"])


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8002, reload=True)