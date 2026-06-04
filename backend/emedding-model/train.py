from ultralytics import YOLO
from multiprocessing import freeze_support

def main():
    model = YOLO("yolo11n.pt")

    model.train(
        data=r"C:\Users\angel\OneDrive - 國立臺中科技大學\桌面\nutc\USR助理\half-a-day\backend\emedding-model\dataset\Task\data.yaml",
        epochs=100,
        imgsz=640,
        batch=4,
        device=0,
        workers=0,
        project=r"C:\Users\angel\OneDrive - 國立臺中科技大學\桌面\nutc\USR助理\half-a-day\backend\emedding-model\runs",
        name="half_a_day"
    )

if __name__ == "__main__":
    freeze_support()
    main()