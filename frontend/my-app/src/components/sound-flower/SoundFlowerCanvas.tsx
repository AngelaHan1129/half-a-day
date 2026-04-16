import { useEffect, useRef } from "react";
import type { FlowerFeatures } from "../../hooks/useAudioFlower";

type Props = {
  features: FlowerFeatures | null;
};

const SoundFlowerCanvas = ({ features }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    if (!features) return;

    const cx = width / 2;
    const cy = height / 2;
    const baseRadius = 34 + features.mid * 26;

    const bg = ctx.createRadialGradient(cx, cy, 20, cx, cy, width * 0.45);
    bg.addColorStop(0, "rgba(255,255,255,0.10)");
    bg.addColorStop(0.35, "rgba(163,230,53,0.08)");
    bg.addColorStop(1, "rgba(2,6,23,0)");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    for (let layer = 0; layer < 3; layer += 1) {
      const alpha = 0.16 + layer * 0.08;
      const scale = 1 + layer * 0.12;

      ctx.beginPath();

      for (let i = 0; i <= 720; i += 1) {
        const theta = (i / 720) * Math.PI * 2;
        const petalWave = Math.sin(theta * features.petalCount);
        const microWave =
          Math.sin(theta * (features.petalCount * 2.4)) * features.variance * 18;

        const petalInfluence =
          Math.sign(petalWave) *
          Math.pow(
            Math.abs(petalWave),
            0.6 + (1 - features.roundness) * 1.2
          );

        const radius =
          baseRadius +
          petalInfluence * (features.petalLength * 0.38 * scale) +
          microWave +
          features.petalWidth * 0.22 * scale;

        const x = cx + Math.cos(theta) * radius;
        const y = cy + Math.sin(theta) * radius;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      const grad = ctx.createRadialGradient(
        cx,
        cy,
        baseRadius * 0.4,
        cx,
        cy,
        features.petalLength * 0.9
      );

      grad.addColorStop(
        0,
        `hsla(${features.hueA}, 78%, 72%, ${alpha + 0.18})`
      );
      grad.addColorStop(
        0.55,
        `hsla(${features.hueB}, 82%, 64%, ${alpha})`
      );
      grad.addColorStop(1, `hsla(${features.hueA}, 88%, 70%, 0.04)`);

      ctx.fillStyle = grad;
      ctx.fill();
    }

    for (let i = 0; i < features.particleCount; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const spread = baseRadius + Math.random() * (features.petalLength + 70);
      const x = cx + Math.cos(angle) * spread;
      const y = cy + Math.sin(angle) * spread;
      const size = Math.random() * 2.6 + 0.5;

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle =
        i % 2 === 0
          ? `hsla(${features.hueA}, 90%, 78%, 0.40)`
          : `hsla(${features.hueB}, 92%, 76%, 0.30)`;
      ctx.fill();
    }

    const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseRadius * 1.3);
    core.addColorStop(0, "rgba(255,255,255,0.9)");
    core.addColorStop(0.35, `hsla(${features.hueA}, 90%, 80%, 0.65)`);
    core.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(cx, cy, baseRadius * 1.25, 0, Math.PI * 2);
    ctx.fill();
  }, [features]);

  return (
    <canvas
      ref={canvasRef}
      className="h-[420px] w-full rounded-[32px] bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.95),rgba(2,6,23,1))]"
    />
  );
};

export default SoundFlowerCanvas;