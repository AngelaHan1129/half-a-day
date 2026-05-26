import { motion } from "framer-motion";
import SoundFlowerCanvas from "../components/sound-flower/SoundFlowerCanvas";
import { useAudioFlower } from "../hooks/useAudioFlower";

const FeatureBadge = ({ label, value }: { label: string; value: string }) => {
  return (
    <div
      className="hand-drawn-badge border-2 p-4 transition-all duration-300 bg-[var(--app-card)] hover:shadow-md"
      style={{
        borderColor: "var(--app-border)",
      }}
    >
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--app-accent)]">
        {label}
      </p>
      <p className="mt-2 text-xl font-serif font-bold text-[var(--app-text)]">
        {value}
      </p>
    </div>
  );
};

const SoundFlowerPage = () => {
  const {
    status,
    countdown,
    audioUrl,
    error,
    features,
    description,
    canStart,
    startRecording,
    stopRecording,
    reset,
  } = useAudioFlower();

  const handleDownload = () => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = "sound-flower.png";
    link.click();
  };

  return (
    <main
      className="min-h-screen pt-24 pb-16 font-sans transition-colors duration-500"
      style={{
        backgroundColor: "var(--app-bg)",
        color: "var(--app-text)",
        backgroundImage: "radial-gradient(color-mix(in srgb, var(--app-text) 10%, transparent) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    >
      {/* 注入專屬日系手帳與錄音動態 CSS */}
      <style>{`
        @keyframes pulse-red {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        @keyframes bamboo-breeze {
          0%, 100% { transform: rotate(0deg) skewX(0deg); }
          50% { transform: rotate(2deg) skewX(-2deg); }
        }
        .hand-drawn-aside-border {
          border-radius: 15px 225px 15px 255px/255px 15px 255px 15px;
        }
        .hand-drawn-card-border {
          border-radius: 255px 20px 225px 20px/20px 225px 20px 255px;
        }
        .hand-drawn-badge {
          border-radius: 12px 24px 14px 18px/18px 12px 20px 14px;
        }
        .bamboo-leaf-shape {
          border-radius: 24px 6px 24px 6px;
        }
        .bamboo-leaf-shape:not(:disabled):hover {
          border-radius: 6px 24px 6px 24px;
        }
      `}</style>

      {/* 橫幅頂部區塊 */}
      <section className="relative overflow-hidden mb-4">
        <div
          className="absolute left-1/2 top-0 h-64 w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px] pointer-events-none"
          style={{ backgroundColor: "color-mix(in srgb, var(--app-accent) 12%, transparent)" }}
          aria-hidden="true"
        />

        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 pt-10 pb-4 text-center md:px-6 md:pt-14">
          <div 
            className="inline-flex items-center justify-center gap-2 rounded-full border px-5 py-1.5 text-xs font-bold tracking-[0.25em] text-[var(--app-accent)] mb-4 shadow-sm"
            style={{ 
              borderColor: "color-mix(in srgb, var(--app-accent) 25%, transparent)", 
              backgroundColor: "color-mix(in srgb, var(--app-surface) 85%, transparent)",
              backdropFilter: "blur(8px)"
            }}
          >
            ✦ THE VOICE OF BAMBOO ✦
          </div>

          <h1 className="text-3xl font-black tracking-wide md:text-5xl lg:text-6xl text-[var(--app-text)]">
            聲音之花生成圖譜
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-relaxed md:text-base text-[var(--app-text-muted)]">
            在靜謐的竹林步道或德興瀑布旁錄下 10 秒自然環境音。系統將自動進行傅立葉頻譜分析（FFT），將風聲、鳥鳴與流水淬鍊為您專屬的小半天生境軌跡。
          </p>
        </div>
      </section>

      {/* 主工作區面板 */}
      <section className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          
          {/* 左側控制台 */}
          <aside
            className="hand-drawn-aside-border relative overflow-hidden border-2 p-6 backdrop-blur-xl transition-all duration-500 bg-[var(--app-card)] shadow-lg hover:shadow-xl h-fit"
            style={{
              borderColor: "var(--app-border)",
              boxShadow: "var(--app-shadow)",
              borderLeft: "6px solid var(--app-accent)",
            }}
          >
            <h2 className="text-xl font-bold tracking-wide text-[var(--app-text)]">採集控制台</h2>

            <p className="mt-4 text-xs leading-relaxed text-[var(--app-text-muted)]">
              建議面向竹林深處、溪流溪谷方向保持靜止錄音。請盡量避免交談、踏步或衣物摩擦等突發碰撞聲，以獲得最具地方代表性的純淨圖譜。
            </p>

            {/* 按鈕操作列 */}
            <div className="mt-6 flex flex-wrap gap-2.5">
              {/* 開始錄音 */}
              <button
                onClick={startRecording}
                disabled={!canStart}
                className="bamboo-leaf-shape px-5 py-3 text-sm font-bold text-[var(--app-bg)] transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40 hover:animate-[bamboo-breeze_4s_ease-in-out_infinite]"
                style={{
                  background: "var(--app-accent)",
                  boxShadow: !canStart ? "none" : "0 4px 12px color-mix(in srgb, var(--app-accent) 35%, transparent)",
                }}
              >
                開始採集
              </button>

              {/* 停止錄音 */}
              <button
                onClick={stopRecording}
                disabled={status !== "recording"}
                className="rounded-full border px-4 py-3 text-sm font-semibold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40 border-[var(--app-border)] text-[var(--app-text)] bg-[var(--app-surface)] hover:border-[var(--app-accent)] hover:text-[var(--app-accent)]"
              >
                停止
              </button>

              {/* 重置 */}
              <button
                onClick={reset}
                className="rounded-full border px-4 py-3 text-sm font-medium transition-all duration-300 ml-auto border-[var(--app-border)] text-[var(--app-text-muted)] bg-transparent hover:text-[var(--app-text)] hover:bg-[color-mix(in_srgb,var(--app-border)_30%,transparent)]"
              >
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                  重設
                </span>
              </button>
            </div>

            {/* 狀態儀表 */}
            <div
              className="mt-6 rounded-[20px] border px-4 py-4 transition-colors duration-500"
              style={{
                borderColor: "color-mix(in srgb, var(--app-accent) 25%, transparent)",
                backgroundColor: "color-mix(in srgb, var(--app-accent) 10%, var(--app-surface))",
              }}
            >
              <p className="text-[11px] font-bold tracking-widest text-[var(--app-accent)] uppercase flex items-center gap-2">
                {/* 錄音中顯示會閃爍的經典紅點 */}
                {status === "recording" ? (
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-[pulse-red_1.2s_ease-in-out_infinite]" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v1a7 7 0 0 1-14 0v-1"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
                )}
                採集狀態
              </p>

              <p className="mt-2.5 text-base font-bold text-[var(--app-text)]">
                {status === "idle" && "等待環境音輸入"}
                {status === "requesting" && "正在開啟環境麥克風..."}
                {status === "recording" && `生境聲波錄製中 · 剩餘 ${countdown} 秒`}
                {status === "processing" && "傅立葉頻率特徵計算中..."}
                {status === "done" && "✦ 專屬聲音之花圖譜已成功生成"}
                {status === "error" && "錄音設備連接失敗"}
              </p>

              {error && (
                <p className="mt-2 text-xs font-medium text-red-400 border-t border-dashed pt-2 border-red-300/40">
                  {error}
                </p>
              )}
            </div>

            {/* 音訊回放裝置 */}
            {audioUrl && (
              <div
                className="mt-5 rounded-[20px] border px-4 py-4 border-[var(--app-border)] bg-[var(--app-surface)] animate-in slide-in-from-bottom-3 duration-300"
              >
                <p className="text-[11px] font-bold tracking-widest text-[var(--app-muted)] uppercase flex items-center gap-1.5 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                  採集音波回放
                </p>
                <audio controls src={audioUrl} className="w-full h-8 outline-none" />
              </div>
            )}
          </aside>

          {/* 右側畫布與特徵輸出 */}
          <div className="space-y-6">
            {/* 核心圖譜 Canvas */}
            <motion.div
              key={features ? "flower-ready" : "flower-empty"}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="overflow-hidden rounded-[28px] border-2 p-4 transition-all duration-300 md:p-6 bg-[var(--app-card)] border-[var(--app-border)]"
              style={{
                boxShadow: "var(--app-shadow)",
              }}
            >
              <SoundFlowerCanvas features={features} />
            </motion.div>

            {/* 6格手繪特徵面板 */}
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
              <FeatureBadge
                label="花瓣數 (頻率群)"
                value={features ? `${features.petalCount} 瓣` : "--"}
              />
              <FeatureBadge
                label="高頻明亮度"
                value={features ? `${Math.round(features.treble * 100)}%` : "--"}
              />
              <FeatureBadge
                label="基調圓潤度"
                value={features ? `${Math.round(features.roundness * 100)}%` : "--"}
              />
              <FeatureBadge
                label="總體聲波能量"
                value={features ? `${Math.round(features.energy * 100)}%` : "--"}
              />
              <FeatureBadge
                label="細微粒子數"
                value={features ? `${features.particleCount} 點` : "--"}
              />
              <FeatureBadge
                label="生境多樣度"
                value={features ? `${Math.round(features.variance * 100)}%` : "--"}
              />
            </div>

            {/* 聲景描述與下載橫幅 */}
            <div
              className="hand-drawn-card-border relative overflow-hidden border-2 p-6 bg-[var(--app-card)]"
              style={{
                borderColor: "var(--app-border)",
                boxShadow: "var(--app-shadow)",
                borderLeft: "6px solid var(--app-accent-2)",
              }}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold tracking-wide text-[var(--app-text)] flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[var(--app-accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"></path><path d="M12 7v5l3 3"></path></svg>
                    專屬聲景
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-[var(--app-text-muted)]">
                    {description ||
                      (features
                        ? features.treble > features.bass
                          ? "此圖譜呈現顯著的高頻能量結構。這是一朵偏向清亮、葉瓣細長、且極富空間延伸感的聲音之花，常對應林間微風掠過翠竹或是清脆的鳥鳴生態。"
                          : "此圖譜具備飽滿的低頻基底。這是一朵偏向厚實、圓潤、且能量豐沛的聲音之花，代表採集環境圍繞著山谷溪流巨石、或是大片竹浪的沉穩共鳴。"
                        : "環境音採集完成後，演算法會解構聲音特徵，為您在這裡留下一段獨一無二的音景文字記錄。")}
                  </p>
                </div>

                {/* 下載按鈕 */}
                <button
                  onClick={handleDownload}
                  disabled={!features}
                  className="bamboo-leaf-shape px-6 py-3.5 text-sm font-bold shrink-0 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40 text-[var(--app-bg)] bg-[var(--app-text)] hover:shadow-md hover:animate-[bamboo-breeze_4s_ease-in-out_infinite]"
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    儲存聲音之花
                  </span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
};

export default SoundFlowerPage;