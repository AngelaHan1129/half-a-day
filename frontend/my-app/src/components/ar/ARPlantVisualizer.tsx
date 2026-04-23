import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { XR, createXRStore } from '@react-three/xr';
import * as THREE from 'three';

interface OpenCVMat {
  rows: number;
  cols: number;
  type(): number;
  delete(): void;
}

interface OpenCVVideoCapture {
  read(src: OpenCVMat): void;
}

interface OpenCVStatic {
  new (...args: unknown[]): OpenCVMat;
}

interface OpenCV {
  Mat: OpenCVStatic;
  VideoCapture: new (video: HTMLVideoElement) => OpenCVVideoCapture;
  cvtColor(src: OpenCVMat, dst: OpenCVMat, code: number): void;
  inRange(src: OpenCVMat, low: OpenCVMat, high: OpenCVMat, dst: OpenCVMat): void;
  countNonZero(src: OpenCVMat): number;
  imshow(canvas: string | HTMLCanvasElement, mat: OpenCVMat): void;
  COLOR_RGBA2RGB: number;
  CV_8UC4: number;
}

declare global {
  interface Window {
    cv?: OpenCV;
  }
}

const xrStore = createXRStore();

function ParticleSystem({ audioData }: { audioData: Uint8Array | null }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 4000;

  const [positions] = useState(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      arr[i3] = (Math.random() - 0.5) * 2;
      arr[i3 + 1] = (Math.random() - 0.5) * 2;
      arr[i3 + 2] = (Math.random() - 0.5) * 2;
    }
    return arr;
  });

  const [colors] = useState(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      arr[i3] = 0.13;
      arr[i3 + 1] = 0.54;
      arr[i3 + 2] = 0.13;
    }
    return arr;
  });

  useFrame(({ clock }) => {
    const points = pointsRef.current;
    if (!points) return;

    const geometry = points.geometry as THREE.BufferGeometry;
    const posAttr = geometry.attributes.position as THREE.BufferAttribute;
    const colAttr = geometry.attributes.color as THREE.BufferAttribute;
    const posArray = posAttr.array as Float32Array;
    const colArray = colAttr.array as Float32Array;

    const t = clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const freq = audioData ? audioData[i % audioData.length] / 255 : 0.2;

      posArray[i3] = positions[i3] + Math.sin(t + i * 0.01) * (0.2 + freq * 0.6);
      posArray[i3 + 1] = positions[i3 + 1] + Math.cos(t * 0.8 + i * 0.015) * (0.2 + freq * 0.8);
      posArray[i3 + 2] = positions[i3 + 2] + Math.sin(t * 0.6 + i * 0.02) * (0.2 + freq * 0.5);

      colArray[i3] = 0.13 + freq * 0.15;
      colArray[i3 + 1] = 0.54 + freq * 0.2;
      colArray[i3 + 2] = 0.13 + freq * 0.05;
    }

    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} position={[0, 1.2, -2]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
      />
    </points>
  );
}

function AudioAnalyzer({ onData }: { onData: (data: Uint8Array) => void }) {
  useEffect(() => {
    let animationId = 0;
    let audioContext: AudioContext | null = null;
    let source: MediaStreamAudioSourceNode | null = null;

    const setup = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new AudioContext();
        source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();

        analyser.fftSize = 256;
        source.connect(analyser);

        const buffer = new Uint8Array(analyser.frequencyBinCount);

        const tick = () => {
          analyser.getByteFrequencyData(buffer);
          onData(new Uint8Array(buffer));
          animationId = window.requestAnimationFrame(tick);
        };

        tick();
      } catch (error) {
        console.error('音訊權限失敗:', error);
      }
    };

    setup();

    return () => {
      window.cancelAnimationFrame(animationId);
      source?.disconnect();
      audioContext?.close();
    };
  }, [onData]);

  return null;
}

function PlantDetector() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [recognized, setRecognized] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let timer: number | null = null;

    const setup = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
        });

        const video = videoRef.current;
        if (!video) return;

        video.srcObject = stream;
        await video.play();

        const detectLoop = () => {
          if (!video.videoWidth || !video.videoHeight) {
            timer = window.setTimeout(detectLoop, 300);
            return;
          }

          const cv = window.cv;
          if (!cv?.Mat) {
            timer = window.setTimeout(detectLoop, 300);
            return;
          }

          const src = new cv.Mat(video.videoHeight, video.videoWidth, cv.CV_8UC4);
          const hsv = new cv.Mat();
          const mask = new cv.Mat();
          const low = new cv.Mat(src.rows, src.cols, src.type(), [35, 40, 40, 0]);
          const high = new cv.Mat(src.rows, src.cols, src.type(), [90, 255, 255, 255]);
          const cap = new cv.VideoCapture(video);

          cap.read(src);
          cv.cvtColor(src, hsv, cv.COLOR_RGBA2RGB);
          cv.inRange(hsv, low, high, mask);

          const greenPixels = cv.countNonZero(mask);
          const ratio = greenPixels / (video.videoWidth * video.videoHeight);
          setRecognized(ratio > 0.08);

          const canvas = document.getElementById('canvasOutput') as HTMLCanvasElement | null;
          if (canvas) {
            canvas.width = 220;
            canvas.height = 160;
            cv.imshow(canvas, mask);
          }

          src.delete();
          hsv.delete();
          mask.delete();
          low.delete();
          high.delete();

          timer = window.setTimeout(detectLoop, 400);
        };

        detectLoop();
      } catch (error) {
        console.error('攝影機權限失敗:', error);
      }
    };

    setup();

    return () => {
      if (timer !== null) window.clearTimeout(timer);
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <video ref={videoRef} style={{ display: 'none' }} playsInline muted />
      <canvas
        id="canvasOutput"
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          width: 220,
          height: 160,
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.2)',
          background: 'rgba(0,0,0,0.2)',
        }}
      />
      {recognized && (
        <div
          style={{
            position: 'absolute',
            left: 16,
            top: 16,
            background: 'rgba(34,139,34,0.85)',
            color: '#fff',
            padding: '10px 14px',
            borderRadius: 12,
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          竹林偵測成功！粒子生成中...
        </div>
      )}
    </div>
  );
}

export default function ARPlantVisualizer() {
  const [audioData, setAudioData] = useState<Uint8Array | null>(null);

  const enterAR = async () => {
    try {
      await xrStore.enterAR();
    } catch (error) {
      console.error('AR 啟動失敗:', error);
    }
  };

  const downloadImage = () => {
    const canvas = document.querySelector('canvas');
    if (!(canvas instanceof HTMLCanvasElement)) return;

    const link = document.createElement('a');
    link.download = 'xiaobantian-particles.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div style={{ height: '100vh', position: 'relative', background: '#0f1720' }}>
      <div
        style={{
          position: 'absolute',
          zIndex: 20,
          top: 16,
          left: 16,
          display: 'flex',
          gap: 12,
        }}
      >
        <button
          onClick={enterAR}
          style={{
            padding: '12px 20px',
            borderRadius: 12,
            background: '#0f766e',
            color: '#fff',
            border: 'none',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          進入 AR 模式
        </button>

        <button
          onClick={downloadImage}
          style={{
            padding: '12px 20px',
            borderRadius: 12,
            background: '#1f2937',
            color: '#fff',
            border: 'none',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          下載粒子圖
        </button>
      </div>

      <Canvas camera={{ position: [0, 1.5, 3], fov: 60 }}>
        <XR store={xrStore}>
          <ambientLight intensity={1.2} />
          <directionalLight position={[1, 10, 5]} intensity={1} />
          <ParticleSystem audioData={audioData} />
        </XR>
      </Canvas>

      <PlantDetector />
      <AudioAnalyzer onData={setAudioData} />
    </div>
  );
}