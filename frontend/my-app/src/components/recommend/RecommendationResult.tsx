import RouteReasonCard from './RouteReasonCard';

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
      <section className="rounded-3xl border border-cyan-300/20 bg-cyan-400/10 p-6">
        <h2 className="text-lg font-bold text-cyan-200">
          {streaming ? 'AI 正在串流推薦中...' : 'AI 正在分析你的旅遊偏好...'}
        </h2>
        <p className="mt-3 text-sm leading-7 text-white/70">
          正在根據目的地、旅遊主題、同行對象、預算與時數整理推薦內容。
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-3xl border border-red-400/20 bg-red-500/10 p-6">
        <h2 className="text-lg font-bold text-red-200">推薦失敗</h2>
        <p className="mt-3 text-sm leading-7 text-red-100/80">{error}</p>
      </section>
    );
  }

  if (!result.trim()) {
    return (
      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-bold text-white">推薦結果</h2>
        <p className="mt-3 text-sm leading-7 text-white/65">
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
    <section className="space-y-4">
      <div className="rounded-3xl border border-lime-300/20 bg-lime-400/10 p-6">
        <h2 className="text-lg font-bold text-lime-200">推薦完成</h2>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-white/85">
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