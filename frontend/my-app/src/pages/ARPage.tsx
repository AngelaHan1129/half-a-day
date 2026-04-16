const ARPage = () => {
  return (
    <main className="mx-auto max-w-7xl px-4 py-24 md:px-6">
      <div className="max-w-3xl">
        <p className="mb-3 text-sm uppercase tracking-[0.24em] text-lime-300">
          AR
        </p>
        <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">
          AR 體驗
        </h1>
        <p className="mt-6 text-lg leading-8 text-white/70">
          這裡之後可以加入裝置檢測、相機權限引導、WebXR 啟動與 3D fallback 模式。
        </p>
      </div>
    </main>
  );
};

export default ARPage;