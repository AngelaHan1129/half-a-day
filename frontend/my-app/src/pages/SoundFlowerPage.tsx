import { motion } from "framer-motion";
import SoundFlowerCanvas from "../components/sound-flower/SoundFlowerCanvas";
import { useAudioFlower } from "../hooks/useAudioFlower";

const FeatureBadge = ({ label, value }: { label: string; value: string }) => {
  return (
    <div
      className="rounded-2xl border p-4 transition-colors duration-300"
      style={{
        borderColor: "var(--app-border)",
        background: "var(--app-card)",
      }}
    >
      <p
        className="text-xs uppercase tracking-[0.22em]"
        style={{ color: "var(--app-accent)" }}
      >
        {label}
      </p>
      <p
        className="mt-2 text-lg font-medium"
        style={{ color: "var(--app-text)" }}
      >
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
            "radial-gradient(circle at top, color-mix(in srgb, var(--app-accent) 20%, transparent) 0%, transparent 30%), linear-gradient(180deg, color-mix(in srgb, var(--app-bg) 85%, #020617 15%) 0%, var(--app-bg) 100%)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-24">
          <p
            className="text-sm uppercase tracking-[0.24em]"
            style={{ color: "var(--app-accent)" }}
          >
            The Voice of Bamboo
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-medium tracking-tight md:text-6xl">
            聲音之花生成圖譜
          </h1>

          <p
            className="mt-6 max-w-3xl text-base leading-8 md:text-lg"
            style={{ color: "var(--app-text-muted)" }}
          >
            在竹林隧道或德興瀑布錄下 10 秒環境音，系統將以 FFT 頻譜分析轉化為你專屬的小半天聲音之花。
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <aside
            className="rounded-[32px] border p-6 backdrop-blur-xl transition-colors duration-300"
            style={{
              borderColor: "var(--app-border)",
              background: "var(--app-card)",
              boxShadow: "var(--app-shadow)",
            }}
          >
            <h2 className="text-2xl font-medium">採集控制台</h2>

            <p
              className="mt-4 text-sm leading-7"
              style={{ color: "var(--app-text-muted)" }}
            >
              建議在安靜狀態下，面向竹林、水流或鳥鳴方向錄音，避免說話與碰撞聲。
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={startRecording}
                disabled={!canStart}
                className="rounded-full px-5 py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  background: "var(--app-accent)",
                  color: "#17200f",
                }}
              >
                開始錄音
              </button>

              <button
                onClick={stopRecording}
                disabled={status !== "recording"}
                className="rounded-full border px-5 py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  borderColor: "var(--app-border)",
                  color: "var(--app-text)",
                  background: "transparent",
                }}
              >
                停止錄音
              </button>

              <button
                onClick={reset}
                className="rounded-full border px-5 py-3 text-sm font-medium transition"
                style={{
                  borderColor: "var(--app-border)",
                  color: "var(--app-text-muted)",
                  background: "transparent",
                }}
              >
                重設
              </button>
            </div>

            <div
              className="mt-6 rounded-[28px] border p-5"
              style={{
                borderColor: "color-mix(in srgb, var(--app-accent) 25%, transparent)",
                background:
                  "color-mix(in srgb, var(--app-accent) 12%, transparent)",
              }}
            >
              <p
                className="text-sm uppercase tracking-[0.22em]"
                style={{ color: "var(--app-accent)" }}
              >
                狀態
              </p>

              <p
                className="mt-3 text-lg font-medium"
                style={{ color: "var(--app-text)" }}
              >
                {status === "idle" && "等待開始"}
                {status === "requesting" && "正在請求麥克風"}
                {status === "recording" && `錄音中 · 剩餘 ${countdown}s`}
                {status === "processing" && "分析聲音中"}
                {status === "done" && "聲音之花已生成"}
                {status === "error" && "錄音失敗"}
              </p>

              {error && (
                <p className="mt-3 text-sm" style={{ color: "#fda4af" }}>
                  {error}
                </p>
              )}
            </div>

            {audioUrl && (
              <div
                className="mt-6 rounded-[28px] border p-5"
                style={{
                  borderColor: "var(--app-border)",
                  background:
                    "color-mix(in srgb, var(--app-card) 82%, var(--app-bg) 18%)",
                }}
              >
                <p
                  className="text-sm uppercase tracking-[0.22em]"
                  style={{ color: "var(--app-accent)" }}
                >
                  錄音回放
                </p>
                <audio controls src={audioUrl} className="mt-4 w-full" />
              </div>
            )}
          </aside>

          <div className="space-y-6">
            <motion.div
              key={features ? "flower-ready" : "flower-empty"}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="rounded-[32px] border p-4 transition-colors duration-300 md:p-6"
              style={{
                borderColor: "var(--app-border)",
                background: "var(--app-card)",
                boxShadow: "var(--app-shadow)",
              }}
            >
              <SoundFlowerCanvas features={features} />
            </motion.div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <FeatureBadge
                label="花瓣數"
                value={features ? `${features.petalCount}` : "--"}
              />
              <FeatureBadge
                label="細長程度"
                value={features ? `${Math.round(features.treble * 100)}%` : "--"}
              />
              <FeatureBadge
                label="圓潤程度"
                value={
                  features ? `${Math.round(features.roundness * 100)}%` : "--"
                }
              />
              <FeatureBadge
                label="能量"
                value={features ? `${Math.round(features.energy * 100)}%` : "--"}
              />
              <FeatureBadge
                label="粒子數"
                value={features ? `${features.particleCount}` : "--"}
              />
              <FeatureBadge
                label="變化度"
                value={
                  features ? `${Math.round(features.variance * 100)}%` : "--"
                }
              />
            </div>

            <div
              className="rounded-[32px] border p-6 transition-colors duration-300"
              style={{
                borderColor: "var(--app-border)",
                background: "var(--app-card)",
                boxShadow: "var(--app-shadow)",
              }}
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-medium">你的聲景描述</h2>
                  <p
                    className="mt-3 max-w-3xl text-sm leading-7"
                    style={{ color: "var(--app-text-muted)" }}
                  >
                    {features
                      ? features.treble > features.bass
                        ? "這是一朵偏清亮、細長、帶有風與鳥鳴感的聲音之花。"
                        : "這是一朵偏厚實、圓潤、帶有竹浪與水流感的聲音之花。"
                      : "完成錄音後，系統會根據頻率與能量生成你的專屬聲景描述。"}
                  </p>
                </div>

                <button
                  onClick={handleDownload}
                  disabled={!features}
                  className="rounded-full px-5 py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    background: "var(--app-text)",
                    color: "var(--app-bg)",
                  }}
                >
                  下載聲音之花 PNG
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