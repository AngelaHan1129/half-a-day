const App = () => {
  return (
    <main className="loading-screen">
      <div className="loading-background">
        <span className="glow glow-1" />
        <span className="glow glow-2" />
        <span className="grid-light" />
      </div>

      <section className="loading-stage" aria-label="Loading page">
        <div className="orbital-loader" aria-hidden="true">
          <div className="core" />
          <div className="ring ring-1">
            <span className="satellite satellite-1" />
          </div>
          <div className="ring ring-2">
            <span className="satellite satellite-2" />
          </div>
          <div className="ring ring-3">
            <span className="satellite satellite-3" />
          </div>
          <div className="pulse pulse-1" />
          <div className="pulse pulse-2" />
        </div>

        <div className="loading-copy">
          <p className="loading-badge">USR Assistant</p>
          <h1>Preparing a better half-day experience</h1>
          <p className="loading-text">
            系統正在整理資料、建立畫面與互動流程
            <span className="loading-dots" aria-hidden="true"></span>
          </p>

          <div
            className="loading-progress"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={72}
          >
            <div className="loading-progress-bar" />
          </div>

          <p className="loading-percent">72% initializing modules</p>
        </div>
      </section>
    </main>
  );
};

export default App;