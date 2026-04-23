import ARPlantVisualizer from "../components/ar/ARPlantVisualizer";

const ARPage = () => {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-4 py-24 md:px-6">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm uppercase tracking-[0.24em] text-lime-300">
            AR
          </p>
          <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">
            AR 體驗
          </h1>
          <p className="mt-6 text-lg leading-8 text-white/70">
            這裡可以進入 WebXR / 粒子視覺化 / 植物辨識體驗。
          </p>
        </div>
      </section>

      <section className="px-4 pb-20 md:px-6">
        <div className="mx-auto overflow-hidden rounded-[32px] border border-white/10 bg-black">
          <ARPlantVisualizer />
        </div>
      </section>
    </main>
  );
};

export default ARPage;