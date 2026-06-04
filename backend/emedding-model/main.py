# ============================================================
# backend/emedding-model/main.py
# ============================================================
from routes.related import router as related_router
from routes.embed import router as embed_router
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, UnidentifiedImageError
from ultralytics import YOLO
import io
import traceback

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

MODEL_PATH = r"C:\Users\angel\OneDrive - 國立臺中科技大學\桌面\nutc\USR助理\half-a-day\backend\emedding-model\runs\half_a_day-5\weights\best.pt"
yolo_model = YOLO(MODEL_PATH)

@app.get("/")
def root():
    return {"message": "Embedding + YOLO API running"}

@app.post("/api/detect")
async def detect(file: UploadFile = File(...)):
    try:
        content = await file.read()

        if not content:
            raise HTTPException(status_code=400, detail="Empty uploaded file")

        try:
            image = Image.open(io.BytesIO(content)).convert("RGB")
        except UnidentifiedImageError:
            raise HTTPException(status_code=400, detail="Uploaded file is not a valid image")

        results = yolo_model.predict(image, conf=0.25, verbose=False)
        result = results[0]

        detections = []
        for box in result.boxes:
            cls_id = int(box.cls[0])
            conf = float(box.conf[0])
            x1, y1, x2, y2 = box.xyxy[0].tolist()

            detections.append({
                "className": result.names[cls_id],
                "confidence": conf,
                "bbox": {
                    "x1": x1,
                    "y1": y1,
                    "x2": x2,
                    "y2": y2
                }
            })

        detections.sort(key=lambda x: x["confidence"], reverse=True)

        return {
            "count": len(detections),
            "topDetection": detections[0] if detections else None,
            "detections": detections
        }

    except HTTPException:
        raise
    except Exception as e:
        print("==== /api/detect ERROR ====")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
    content = await file.read()
    image = Image.open(io.BytesIO(content)).convert("RGB")

    results = yolo_model.predict(image, conf=0.25, device=0, verbose=False)
    result = results[0]

    detections = []
    for box in result.boxes:
        cls_id = int(box.cls[0])
        conf = float(box.conf[0])
        x1, y1, x2, y2 = box.xyxy[0].tolist()

        detections.append({
            "className": result.names[cls_id],
            "confidence": conf,
            "bbox": {
                "x1": x1,
                "y1": y1,
                "x2": x2,
                "y2": y2
            }
        })

    detections.sort(key=lambda x: x["confidence"], reverse=True)

    return {
        "count": len(detections),
        "topDetection": detections[0] if detections else None,
        "detections": detections
    }

app.include_router(related_router, prefix="/api/embedding", tags=["Related"])
app.include_router(embed_router, prefix="/api/embedding", tags=["Embed"])

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)