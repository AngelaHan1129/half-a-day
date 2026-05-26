import { useState } from "react";
import AudienceSelector from "../components/recommend/AudienceSelector";
import DurationSelector from "../components/recommend/DurationSelector";
import PreferenceForm from "../components/recommend/PreferenceForm";
import RecommendationResult from "../components/recommend/RecommendationResult";
import ThemeSelector from "../components/recommend/ThemeSelector";
import { recommendApi } from "../services/api/recommendApi";
import type { RecommendRequest } from "../types/recommend";

const initialForm: RecommendRequest = {
  destination: "小半天",
  preferences: "",
  companionType: "solo",
  travelStyle: "",
  durationHours: 4,
  budgetLevel: "",
  weatherAware: true,
};

export default function Recommend() {
  const [form, setForm] = useState<RecommendRequest>(initialForm);
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");

  const updateForm = <K extends keyof RecommendRequest>(
    key: K,
    value: RecommendRequest[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const validateForm = () => {
    if (!form.destination.trim()) return "請輸入目的地";
    if (!form.preferences.trim()) return "請輸入旅遊偏好";
    if (!form.companionType.trim()) return "請選擇同行對象";
    if (!form.travelStyle.trim()) return "請輸入旅遊風格";
    if (!form.budgetLevel.trim()) return "請選擇預算等級";
    if (form.durationHours <= 0) return "時數必須大於 0";
    return "";
  };

  const handleRecommend = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setStreaming(false);
      setError("");
      setResult("");

      const text = await recommendApi.recommend(form);
      setResult(text);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "推薦失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  const handleStreamRecommend = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(false);
      setStreaming(true);
      setError("");
      setResult("");

      await recommendApi.recommendStream(form, (chunk) => {
        setResult((prev) => prev + chunk);
      });
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "串流推薦失敗，請稍後再試");
    } finally {
      setStreaming(false);
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setLoading(false);
    setStreaming(false);
    setError("");
    setResult("");
  };

  return (
    <main
      className="min-h-screen pt-24 pb-16 font-sans transition-colors duration-500"
      style={{
        backgroundColor: "var(--app-bg)",
        color: "var(--app-text)",
        // 輕柔的日系網點底紋
        backgroundImage: "radial-gradient(color-mix(in srgb, var(--app-text) 10%, transparent) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    >
      {/* 注入竹葉形狀與 AI 微光動畫 */}
      <style>{`
        @keyframes doodle-float {
          0%, 100% { transform: translateY(0) rotate(-1.5deg); }
          50% { transform: translateY(-5px) rotate(1.5deg); }
        }
        @keyframes bamboo-breeze {
          0%, 100% { transform: rotate(0deg) skewX(0deg); }
          50% { transform: rotate(2deg) skewX(-2deg); }
        }
        .hand-drawn-recommend-border {
          border-radius: 255px 20px 225px 20px/20px 225px 20px 255px;
        }
        .bamboo-leaf-shape {
          border-radius: 24px 6px 24px 6px;
        }
        .bamboo-leaf-shape:not(:disabled):hover {
          border-radius: 6px 24px 6px 24px;
        }
      `}</style>

      {/* 橫幅頂部前導區區塊 */}
      <section className="relative overflow-hidden mb-4">
        {/* 精緻的日系混色晨影光暈 */}
        <div
          className="absolute left-1/2 top-0 h-72 w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[90px] pointer-events-none"
          style={{
            background: "radial-gradient(circle, color-mix(in srgb, var(--app-accent) 15%, transparent) 0%, color-mix(in srgb, var(--app-accent-2) 10%, transparent) 100%)"
          }}
          aria-hidden="true"
        />

        {/* 極簡竹葉圖騰點綴 */}
        <div className="absolute left-[8%] top-6 opacity-[0.12] text-[var(--app-accent)] animate-[bamboo-breeze_6s_ease-in-out_infinite] pointer-events-none hidden md:block">
          <svg className="h-14 w-14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.5,3C13.5,3 10,6.5 10,10.5C10,11.5 10.2,12.5 10.5,13.4L3.6,20.4L5,21.8L11.9,14.9C12.8,15.2 13.8,15.4 14.8,15.4C18.8,15.4 22.3,11.9 22.3,7.9L22.5,3H17.5Z" />
          </svg>
        </div>

        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 pt-10 pb-2 text-center md:px-6 md:pt-14">
          <div 
            className="inline-flex items-center justify-center gap-2 rounded-full border px-5 py-1.5 text-xs font-bold tracking-[0.25em] text-[var(--app-accent)] mb-4 shadow-sm animate-[doodle-float_3.5s_ease-in-out_infinite]"
            style={{ 
              borderColor: "color-mix(in srgb, var(--app-accent) 25%, transparent)", 
              backgroundColor: "color-mix(in srgb, var(--app-surface) 85%, transparent)",
              backdropFilter: "blur(8px)"
            }}
          >
            ✦ SMART RECOMMEND ✦
          </div>

          <h1 className="text-3xl font-black tracking-wide md:text-5xl lg:text-6xl text-[var(--app-text)]">
            小半天客製化推薦
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-relaxed md:text-base text-[var(--app-text-muted)]">
            交給內嵌的客製化模型，只需輕點幾項偏好、填寫出發人數與時數，即刻為您描繪專屬小半天休閒農業區的微風半日遊。
          </p>
        </div>
      </section>

      {/* 主面板容器網格區 */}
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 md:px-6 lg:grid-cols-[1.15fr_0.85fr]">
        
        {/* 左側輸入設定面板 */}
        <div
          className="hand-drawn-recommend-border relative overflow-hidden border-2 p-6 transition-all duration-500 bg-[var(--app-card)] shadow-lg hover:shadow-xl"
          style={{
            borderColor: "var(--app-border)",
            boxShadow: "var(--app-shadow)",
            borderLeft: "6px solid var(--app-accent)", // 模擬立竹主幹
          }}
        >
          {/* 四角星微動態塗鴉 */}
          <div className="absolute right-4 top-4 text-sm text-[var(--app-accent)] opacity-40 animate-[doodle-float_2.5s_ease-in-out_infinite]" aria-hidden="true">
            ✦
          </div>

          <div className="space-y-8 relative z-10">
            <AudienceSelector
              value={form.companionType}
              onChange={(value) => updateForm("companionType", value)}
            />

            <ThemeSelector
              value={form.travelStyle}
              onChange={(value) => updateForm("travelStyle", value)}
            />

            <DurationSelector
              value={form.durationHours}
              onChange={(value) => updateForm("durationHours", value)}
            />

            <PreferenceForm form={form} onChange={updateForm} />

            {/* 控制器按鈕列：全面升級竹葉風 */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[var(--app-border)] border-dashed">
              
              {/* 一般推薦按鈕 */}
              <button
                type="button"
                onClick={handleRecommend}
                disabled={loading || streaming}
                className="bamboo-leaf-shape px-6 py-3 text-sm font-bold text-white transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 hover:animate-[bamboo-breeze_3s_ease-in-out_infinite]"
                style={{
                  background: "linear-gradient(135deg, var(--app-accent), color-mix(in srgb, var(--app-accent) 80%, black 20%))",
                  boxShadow: "0 4px 14px color-mix(in srgb, var(--app-accent) 35%, transparent)",
                }}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    演算中...
                  </span>
                ) : (
                  "一般推薦 🍃"
                )}
              </button>

              {/* 串流推薦按鈕 */}
              <button
                type="button"
                onClick={handleStreamRecommend}
                disabled={loading || streaming}
                className="bamboo-leaf-shape px-6 py-3 text-sm font-bold text-white transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 hover:animate-[bamboo-breeze_3s_ease-in-out_infinite]"
                style={{
                  background: "linear-gradient(135deg, var(--app-accent-2), color-mix(in srgb, var(--app-accent-2) 85%, black 15%))",
                  boxShadow: "0 4px 14px color-mix(in srgb, var(--app-accent-2) 35%, transparent)",
                }}
              >
                {streaming ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    落筆中...
                  </span>
                ) : (
                  "串流推薦 ✦"
                )}
              </button>

              {/* 清除重置按鈕 */}
              <button
                type="button"
                onClick={handleReset}
                disabled={loading || streaming}
                className="rounded-full border px-5 py-3 text-sm font-medium transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40 ml-auto text-[var(--app-text-muted)] border-[var(--app-border)] bg-transparent hover:text-[var(--app-text)] hover:bg-[color-mix(in_srgb,var(--app-border)_30%,transparent)]"
              >
                清除重填
              </button>
            </div>
          </div>
        </div>

        {/* 右側生成結果看板區 */}
        <div className="lg:sticky lg:top-28 h-fit">
          <RecommendationResult
            loading={loading}
            streaming={streaming}
            error={error}
            result={result}
          />
        </div>
      </section>
    </main>
  );
}