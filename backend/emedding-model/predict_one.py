from ultralytics import YOLO

model = YOLO(r"C:\Users\angel\OneDrive - 國立臺中科技大學\桌面\nutc\USR助理\half-a-day\backend\emedding-model\runs\half_a_day-3\weights\best.pt")

results = model.predict(
    source=r"C:\Users\angel\Downloads\泰安竹林祕境-2-800x538.jpg",
    conf=0.25,
    save=True,
    project=r"C:\Users\angel\OneDrive - 國立臺中科技大學\桌面\nutc\USR助理\half-a-day\backend\emedding-model\predict_results",
    name="single_image"
)

result = results[0]

print(f"圖片路徑: {result.path}")
print(f"偵測到 {len(result.boxes)} 個物件")

for box in result.boxes:
    cls_id = int(box.cls[0])
    conf = float(box.conf[0])
    x1, y1, x2, y2 = box.xyxy[0].tolist()
    class_name = result.names[cls_id]

    print(f"類別: {class_name}, 信心值: {conf:.3f}, 座標: ({x1:.1f}, {y1:.1f}, {x2:.1f}, {y2:.1f})")