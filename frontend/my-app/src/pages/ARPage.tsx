import ARPlantVisualizer from "../components/ar/ARPlantVisualizer";

const ARPage = () => {
  return (
    <main
      className="min-h-screen transition-colors duration-300"
      style={{
        background: "var(--app-bg)",
        color: "var(--app-text)",
      }}
    >
      <section className="mx-auto max-w-7xl px-4 py-24 md:px-6">
        <div className="max-w-3xl">
          <p
            className="mb-3 text-sm uppercase tracking-[0.24em]"
            style={{ color: "var(--app-accent)" }}
          >
            AR
          </p>

          <h1
            className="text-4xl font-black tracking-tight md:text-6xl"
            style={{ color: "var(--app-text)" }}
          >
            跨平台 AR 體驗
          </h1>

          <p
            className="mt-6 text-lg leading-8"
            style={{ color: "var(--app-text-muted)" }}
          >
            此頁支援 Android 與 iPhone 的行動 AR。
            Android 會使用 WebXR / Scene Viewer，iPhone Safari 會使用 AR Quick Look。
          </p>
        </div>
      </section>

      <section className="px-4 pb-20 md:px-6">
        <div
          className="mx-auto overflow-hidden rounded-[32px] border transition-colors duration-300"
          style={{
            borderColor: "var(--app-border)",
            background: "var(--app-card)",
            boxShadow: "var(--app-shadow)",
          }}
        >
          <ARPlantVisualizer />
        </div>
      </section>
    </main>
  );
};

export default ARPage;