import RouteReasonCard from "./RouteReasonCard";

type RecommendationResultProps = {
  loading: boolean;
  streaming: boolean;
  error: string;
  result: string;
};

export default function RecommendationResult({
  loading,
  streaming,
  error,
  result,
}: RecommendationResultProps) {
  if (loading || streaming) {
    return (
      <section
        className="xh-analysis-card rounded-3xl border p-6 transition-colors duration-300"
        style={{
          borderColor: "color-mix(in srgb, var(--app-accent) 20%, transparent)",
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--app-accent) 8%, var(--app-card)), var(--app-card))",
          color: "var(--app-text)",
          boxShadow: "var(--app-shadow)",
        }}
      >
        <div className="xh-analysis-scene" aria-hidden="true">
          <div className="xh-mist xh-mist-1" />
          <div className="xh-mist xh-mist-2" />
          <div className="xh-mountains">
            <span className="xh-mountain xh-mountain-back" />
            <span className="xh-mountain xh-mountain-mid" />
            <span className="xh-mountain xh-mountain-front" />
          </div>

          <div className="xh-bamboo-group xh-bamboo-left">
            <span className="xh-bamboo stalk-1" />
            <span className="xh-bamboo stalk-2" />
            <span className="xh-bamboo stalk-3" />
          </div>

          <div className="xh-bamboo-group xh-bamboo-right">
            <span className="xh-bamboo stalk-1" />
            <span className="xh-bamboo stalk-2" />
            <span className="xh-bamboo stalk-3" />
          </div>

          <div className="xh-tea-hill" />
          <div className="xh-waterfall">
            <span className="xh-water upper" />
            <span className="xh-water lower" />
          </div>

          <div className="xh-scan-ring" />
          <div className="xh-scan-dot" />
        </div>

        <div className="mt-5">
          <p
            className="text-xs uppercase tracking-[0.26em]"
            style={{ color: "var(--app-accent)" }}
          >
            Xiaobantian AI Journey
          </p>

          <h2
            className="mt-3 text-lg font-bold"
            style={{ color: "var(--app-text)" }}
          >
            {streaming ? "AI 正在編織小半天行程中..." : "AI 正在分析你的小半天旅遊偏好..."}
          </h2>

          <p
            className="mt-3 text-sm leading-7"
            style={{ color: "var(--app-text-muted)" }}
          >
            正沿著竹林、茶園、山霧與瀑布的節奏，整理最適合你的探索路線。
          </p>

          <div className="xh-loading-steps mt-4">
            <span>竹林偏好解析</span>
            <span>茶山節奏配對</span>
            <span>瀑布路線生成</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        className="rounded-3xl border p-6 transition-colors duration-300"
        style={{
          borderColor: "rgba(244, 63, 94, 0.22)",
          background: "rgba(244, 63, 94, 0.08)",
          color: "var(--app-text)",
          boxShadow: "var(--app-shadow)",
        }}
      >
        <h2 className="text-lg font-bold" style={{ color: "#e11d48" }}>
          推薦失敗
        </h2>

        <p
          className="mt-3 text-sm leading-7"
          style={{ color: "var(--app-text)" }}
        >
          {error}
        </p>
      </section>
    );
  }

  if (!result.trim()) {
    return (
      <section
        className="rounded-3xl border p-6 transition-colors duration-300"
        style={{
          borderColor: "var(--app-border)",
          background: "var(--app-card)",
          color: "var(--app-text)",
          boxShadow: "var(--app-shadow)",
        }}
      >
        <h2
          className="text-lg font-bold"
          style={{ color: "var(--app-text)" }}
        >
          推薦結果
        </h2>

        <p
          className="mt-3 text-sm leading-7"
          style={{ color: "var(--app-text-muted)" }}
        >
          填完條件後送出，這裡會顯示專屬於你的行程推薦內容。
        </p>
      </section>
    );
  }

  const sections = result
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <section className="space-y-4" style={{ color: "var(--app-text)" }}>
      <div
        className="rounded-3xl border p-6 transition-colors duration-300"
        style={{
          borderColor: "color-mix(in srgb, var(--app-accent) 22%, transparent)",
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--app-accent) 10%, var(--app-card)), var(--app-card))",
          boxShadow: "var(--app-shadow)",
          color: "var(--app-text)",
        }}
      >
        <h2
          className="text-lg font-bold"
          style={{ color: "var(--app-accent)" }}
        >
          推薦完成
        </h2>

        <p
          className="mt-3 whitespace-pre-wrap text-sm leading-7"
          style={{ color: "var(--app-text)" }}
        >
          {result}
        </p>
      </div>

      {sections.length > 1 && (
        <div className="grid gap-4 md:grid-cols-2">
          {sections.map((section, index) => (
            <RouteReasonCard
              key={`${index}-${section.slice(0, 12)}`}
              title={`推薦重點 ${index + 1}`}
              content={section}
            />
          ))}
        </div>
      )}
    </section>
  );
}