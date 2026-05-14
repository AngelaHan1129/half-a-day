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
      className="min-h-screen transition-colors duration-300"
      style={{
        background: "var(--app-bg)",
        color: "var(--app-text)",
      }}
    >
      <section
        className="border-b"
        style={{
          borderColor: "var(--app-border)",
          background:
            "radial-gradient(circle at top, color-mix(in srgb, var(--app-accent-2) 18%, transparent) 0%, transparent 30%), linear-gradient(180deg, color-mix(in srgb, var(--app-bg) 84%, #111827 16%) 0%, var(--app-bg) 100%)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
          <p
            className="text-sm uppercase tracking-[0.24em]"
            style={{ color: "var(--app-accent-2)" }}
          >
            Smart Recommend
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
            小半天客製化行程推薦
          </h1>

          <p
            className="mt-6 max-w-3xl text-base leading-8 md:text-lg"
            style={{ color: "var(--app-text-muted)" }}
          >
            根據你的旅遊偏好、同行對象、時數與預算，自動生成適合小半天的半日遊建議。
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:px-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div
          className="rounded-[28px] border p-6 transition-colors duration-300 md:p-8"
          style={{
            borderColor: "var(--app-border)",
            background: "var(--app-card)",
            boxShadow: "var(--app-shadow)",
          }}
        >
          <div className="space-y-8">
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

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={handleRecommend}
                disabled={loading || streaming}
                className="rounded-full px-5 py-3 text-sm font-bold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  background:
                    "linear-gradient(135deg, var(--app-accent), var(--app-accent-2))",
                }}
              >
                {loading ? "推薦中..." : "一般推薦"}
              </button>

              <button
                type="button"
                onClick={handleStreamRecommend}
                disabled={loading || streaming}
                className="rounded-full px-5 py-3 text-sm font-bold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  background:
                    "linear-gradient(135deg, var(--app-accent-2), var(--app-accent))",
                }}
              >
                {streaming ? "串流生成中..." : "串流推薦"}
              </button>

              <button
                type="button"
                onClick={handleReset}
                disabled={loading || streaming}
                className="rounded-full border px-5 py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  borderColor: "var(--app-border)",
                  color: "var(--app-text-muted)",
                  background: "transparent",
                }}
              >
                清除重填
              </button>
            </div>
          </div>
        </div>

        <div>
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