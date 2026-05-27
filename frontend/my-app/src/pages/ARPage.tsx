import ARPlantVisualizer from "../components/ar/ARPlantVisualizer";

const ARPage = () => {
  return (
    <main
      className="min-h-screen transition-colors duration-300 flex items-center justify-center overflow-hidden"
      style={{
        background: "var(--app-bg)",
        color: "var(--app-text)",
      }}
    >
      {/* 背景裝飾光暈 */}
      <div className="pointer-events-none absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[var(--app-accent)] opacity-5 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-10%] right-[-5%] h-[600px] w-[600px] rounded-full bg-[var(--app-accent)] opacity-[0.03] blur-[150px]" />

      <section className="relative z-10 mx-auto w-full max-w-[1400px] px-4 py-16 md:px-8 lg:py-20">
        {/* 改為彈性的 flex 排版，給予右側更大的空間 */}
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-stretch lg:gap-16">
          
          {/* 左側：文字與引導說明 (佔比約 40%) */}
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
              <span style={{ color: "var(--app-accent)" }}> AR 互動體驗</span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-gray-500 md:text-xl">
              透過 AI 物件辨識技術，將鏡頭對準在地特色產物，即可立刻獲取專屬知識，並將 3D 模型帶入現實空間中。
            </p>

            {/* 支援的技術標籤 */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <span className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-600 shadow-sm">
                📱 跨裝置支援
              </span>
              <span className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-600 shadow-sm">
                🤖 AI 即時辨識
              </span>
              <span className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-600 shadow-sm">
                ✨ WebXR / Quick Look
              </span>
            </div>
          </div>

          {/* 右側：平板大尺寸的 AR 掃描器 (佔比約 60%) */}
          <div className="flex w-full justify-center lg:w-7/12 lg:justify-end">
            {/* 放寬 max-w，讓畫面大氣沉浸 */}
            <div className="relative w-full max-w-[680px]">
              <div className="absolute -inset-4 rounded-[48px] bg-gradient-to-b from-gray-100 to-white opacity-60 blur-2xl" />
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