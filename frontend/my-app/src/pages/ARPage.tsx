import ARPlantVisualizer from "../components/ar/ARPlantVisualizer";
import aboutBg from "../assets/images/about.jpg";

const ARPage = () => {
  return (
    <main
      className="relative min-h-screen overflow-x-hidden transition-colors duration-300 flex items-center justify-center"
      style={{ color: "var(--app-text)" }}
    >
      {/* ── 底層清楚照片 ── */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url("${aboutBg}")`,
          backgroundPosition: "center right",
          filter: "saturate(0.92) brightness(0.98)",
        }}
      />

      {/* ── 柔白霧面遮罩 ── */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(to right, rgba(247,246,242,0.96) 0%, rgba(247,246,242,0.90) 22%, rgba(247,246,242,0.72) 46%, rgba(247,246,242,0.38) 70%, rgba(247,246,242,0.16) 88%, rgba(247,246,242,0.08) 100%)",
        }}
      />

      {/* ── 很淡的點點紋理 ── */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(color-mix(in srgb, var(--app-text) 8%, transparent) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          opacity: 0.18,
        }}
      />

      {/* ── 頁面內容 ── */}
      <section className="relative z-10 mx-auto w-full max-w-[1400px] px-4 py-16 md:px-8 lg:py-20">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-stretch lg:gap-16">

          {/* 左側：文字與引導說明 */}
          <div className="mx-auto flex w-full max-w-xl flex-col justify-center text-center lg:w-5/12 lg:text-left">
            <p
              className="mb-4 text-xs font-bold uppercase tracking-[0.3em]"
              style={{ color: "var(--app-accent)" }}
            >
              數位導覽平台
            </p>

            <h1
              className="text-4xl font-black tracking-tight md:text-5xl lg:text-[3.5rem] lg:leading-[1.2]"
              style={{ color: "var(--app-text)" }}
            >
              發掘地方特色
              <br className="hidden lg:block" />
              <span style={{ color: "var(--app-accent)" }}> 智慧鏡頭互動體驗</span>
            </h1>

            <p
              className="mt-6 text-lg leading-relaxed md:text-xl"
              style={{ color: "var(--app-text-muted)" }}
            >
              透過 AI 物件辨識技術，將鏡頭對準在地特色產物，即可立刻獲取專屬知識，並將 3D 模型帶入現實空間中。
            </p>

            {/* 技術標籤 */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              {[
                { icon: "📱", label: "跨裝置支援" },
                { icon: "🤖", label: "AI 即時辨識" },
                { icon: "✨", label: "WebXR / Quick Look" },
              ].map((tag) => (
                <span
                  key={tag.label}
                  className="rounded-full border px-4 py-2 text-xs font-semibold shadow-sm"
                  style={{
                    borderColor: "var(--app-border)",
                    backgroundColor: "color-mix(in srgb, var(--app-card) 92%, white)",
                    color: "var(--app-text-muted)",
                  }}
                >
                  {tag.icon} {tag.label}
                </span>
              ))}
            </div>
          </div>

          {/* 右側：AR 掃描器 */}
          <div className="flex w-full justify-center lg:w-7/12 lg:justify-end">
            <div className="relative w-full max-w-[680px]">
              <div
                className="absolute -inset-4 rounded-[48px] blur-2xl"
                style={{
                  background:
                    "color-mix(in srgb, var(--app-surface) 80%, transparent)",
                }}
              />
              <div className="relative z-10 h-full">
                <ARPlantVisualizer />
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
};

export default ARPage;