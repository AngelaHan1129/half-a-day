import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../app/router/paths";

const SplashLoadingPage = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  const progress = useMemo(() => {
    return ((3 - countdown) / 3) * 100;
  }, [countdown]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          navigate(PATHS.discover, { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [navigate]);

  return (
    <main className="splash-screen splash-screen--cute">
      <div className="cute-bg" aria-hidden="true">
        <span className="mist mist-1" />
        <span className="mist mist-2" />
        <span className="mist mist-3" />
        <div className="mountains">
          <span className="mountain mountain-back" />
          <span className="mountain mountain-mid" />
          <span className="mountain mountain-front" />
        </div>
      </div>

      <section className="cute-card" aria-label="小半天啟動畫面">
        <div className="cute-illustration" aria-hidden="true">
          <div className="sprout-scene">
            <div className="soil" />
            <div className="stem" />
            <div className="leaf leaf-left" />
            <div className="leaf leaf-right" />
            <div className="leaf leaf-top" />

            <span className="drop drop-1" />
            <span className="drop drop-2" />
            <span className="drop drop-3" />

            <span className="spark spark-1" />
            <span className="spark spark-2" />
            <span className="spark spark-3" />
          </div>
        </div>

        <div className="cute-copy">
          <p className="cute-badge">小半天 Half-a-Day</p>
          <h1>山裡的小旅程正在發芽</h1>
          <p className="cute-desc" role="status" aria-live="polite">
            正在整理茶園、竹林、步道與體驗資訊，準備帶你走進小半天的慢慢日常。
          </p>

          <div
            className="cute-progress"
            role="progressbar"
            aria-label="載入進度"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
          >
            <div
              className="cute-progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="cute-footer">
            <span className="cute-status">霧氣散開中...</span>
            <span className="cute-countdown">{countdown} 秒後進入首頁</span>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SplashLoadingPage;