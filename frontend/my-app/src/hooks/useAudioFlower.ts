import { useCallback, useEffect, useRef, useState } from "react";

export type FlowerFeatures = {
  bass: number;
  mid: number;
  treble: number;
  energy: number;
  variance: number;
  petalCount: number;
  petalLength: number;
  petalWidth: number;
  roundness: number;
  particleCount: number;
  hueA: number;
  hueB: number;
};

type SoundFlowerApiResponse = {
  id: string;
  status: string;
  location: string;
  visitorName?: string | null;
  audioUrl?: string | null;
  imageUrl?: string | null;
  description?: string | null;
  features?: Record<string, unknown> | null;
  flowerParams?: Record<string, unknown> | null;
  createdAt?: string;
};

type Status =
  | "idle"
  | "requesting"
  | "recording"
  | "processing"
  | "done"
  | "error";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8080";

const RECORD_SECONDS = 10;
const DEFAULT_LOCATION = "小半天竹林步道";

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function avg(arr: number[]) {
  if (!arr.length) return 0;
  return arr.reduce((sum, n) => sum + n, 0) / arr.length;
}

function varianceOf(arr: number[]) {
  if (!arr.length) return 0;
  const mean = avg(arr);
  return avg(arr.map((n) => (n - mean) ** 2));
}

function toNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function mapAnalysisToFeatures(
  features?: Record<string, unknown> | null,
  flowerParams?: Record<string, unknown> | null
): FlowerFeatures {
  const bass = clamp01(toNumber(features?.bass, 0.45));
  const mid = clamp01(toNumber(features?.mid, 0.52));
  const treble = clamp01(toNumber(features?.treble, 0.58));
  const energy = clamp01(toNumber(features?.energy, 0.5));
  const variance = clamp01(toNumber(features?.variance, 0.24));

  return {
    bass,
    mid,
    treble,
    energy,
    variance,
    petalCount: Math.max(6, Math.round(toNumber(flowerParams?.petalCount, 10))),
    petalLength: Math.max(60, toNumber(flowerParams?.petalLength, 140)),
    petalWidth: Math.max(20, toNumber(flowerParams?.petalWidth, 56)),
    roundness: clamp01(toNumber(flowerParams?.roundness, 0.7)),
    particleCount: Math.max(
      40,
      Math.round(toNumber(flowerParams?.particleCount, 160))
    ),
    hueA: Math.round(toNumber(flowerParams?.hueA, 120)),
    hueB: Math.round(toNumber(flowerParams?.hueB, 205)),
  };
}

function buildLocalFeatures(freqData: Uint8Array): FlowerFeatures {
  const values = Array.from(freqData).map((v) => v / 255);

  const bassBand = values.slice(0, Math.max(1, Math.floor(values.length * 0.18)));
  const midBand = values.slice(
    Math.floor(values.length * 0.18),
    Math.floor(values.length * 0.55)
  );
  const trebleBand = values.slice(Math.floor(values.length * 0.55));

  const bass = clamp01(avg(bassBand));
  const mid = clamp01(avg(midBand));
  const treble = clamp01(avg(trebleBand));
  const energy = clamp01(avg(values));
  const variance = clamp01(varianceOf(values) * 4.2);

  const petalCount = Math.max(
    8,
    Math.min(24, Math.round(8 + treble * 14 + mid * 4))
  );
  const petalLength = Math.round(90 + treble * 120 + energy * 30);
  const petalWidth = Math.round(36 + bass * 54);
  const roundness = clamp01(0.25 + bass * 0.6 - treble * 0.15 + mid * 0.1);
  const particleCount = Math.round(90 + energy * 220 + variance * 80);
  const hueA = Math.round(95 + treble * 55);
  const hueB = Math.round(180 + bass * 35 + variance * 20);

  return {
    bass,
    mid,
    treble,
    energy,
    variance,
    petalCount,
    petalLength,
    petalWidth,
    roundness,
    particleCount,
    hueA,
    hueB,
  };
}

function getSupportedMimeType() {
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus",
  ];

  for (const type of candidates) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }

  return "";
}

export function useAudioFlower() {
  const [status, setStatus] = useState<Status>("idle");
  const [countdown, setCountdown] = useState(RECORD_SECONDS);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [features, setFeatures] = useState<FlowerFeatures | null>(null);
  const [description, setDescription] = useState<string>("");
  const [serverAudioUrl, setServerAudioUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const countdownTimerRef = useRef<number | null>(null);
  const autoStopTimerRef = useRef<number | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const stopVisualAnalysis = useCallback(() => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  const cleanupTimers = useCallback(() => {
    if (countdownTimerRef.current !== null) {
      window.clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }

    if (autoStopTimerRef.current !== null) {
      window.clearTimeout(autoStopTimerRef.current);
      autoStopTimerRef.current = null;
    }
  }, []);

  const cleanupAudioNodes = useCallback(() => {
    stopVisualAnalysis();

    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => undefined);
      audioContextRef.current = null;
    }

    analyserRef.current = null;

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, [stopVisualAnalysis]);

  const uploadSoundFlower = useCallback(
    async (blob: Blob, recordedSeconds: number) => {
      const formData = new FormData();
      const ext = blob.type.includes("ogg")
        ? "ogg"
        : blob.type.includes("mp4")
        ? "m4a"
        : "webm";

      formData.append("audio", blob, `sound-flower-${Date.now()}.${ext}`);
      formData.append("location", DEFAULT_LOCATION);
      formData.append("visitorName", "現場旅人");
      formData.append("deviceId", navigator.userAgent.slice(0, 80));
      formData.append("recordedSeconds", String(recordedSeconds));

      const response = await fetch(`${API_BASE_URL}/api/sound-flowers`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let message = "聲音之花上傳失敗";
        try {
          const data = await response.json();
          if ((data as { message?: string })?.message) {
            message = (data as { message?: string }).message!;
          }
        } catch {
          //
        }
        throw new Error(message);
      }

      return (await response.json()) as SoundFlowerApiResponse;
    },
    []
  );

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    cleanupTimers();
  }, [cleanupTimers]);

  const startRecording = useCallback(async () => {
    if (
      status === "requesting" ||
      status === "recording" ||
      status === "processing"
    ) {
      return;
    }

    setError(null);
    setStatus("requesting");
    setCountdown(RECORD_SECONDS);
    setDescription("");
    setServerAudioUrl(null);
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.82;
      source.connect(analyser);
      analyserRef.current = analyser;

      const freqData = new Uint8Array(analyser.frequencyBinCount);

      const tickVisual = () => {
        if (!analyserRef.current) return;

        analyserRef.current.getByteFrequencyData(freqData);
        setFeatures(buildLocalFeatures(freqData));

        animationRef.current = requestAnimationFrame(tickVisual);
      };

      tickVisual();

      const mimeType = getSupportedMimeType();
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onerror = () => {
        setStatus("error");
        setError("錄音過程發生問題，請再試一次。");
        cleanupTimers();
        cleanupAudioNodes();
      };

      recorder.onstop = async () => {
        setStatus("processing");
        stopVisualAnalysis();

        try {
          const blob = new Blob(chunksRef.current, {
            type: recorder.mimeType || "audio/webm",
          });

          const localUrl = URL.createObjectURL(blob);
          setAudioUrl((prev) => {
            if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
            return localUrl;
          });

          const response = await uploadSoundFlower(blob, RECORD_SECONDS);
          const mapped = mapAnalysisToFeatures(
            response.features ?? null,
            response.flowerParams ?? null
          );

          setFeatures(mapped);
          setDescription(response.description ?? "");
          setServerAudioUrl(response.audioUrl ?? null);
          setStatus("done");
        } catch (err) {
          setStatus("error");
          setError(
            err instanceof Error ? err.message : "聲音之花分析失敗，請稍後再試。"
          );
        } finally {
          cleanupAudioNodes();
        }
      };

      recorder.start();
      setStatus("recording");

      countdownTimerRef.current = window.setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) return 0;
          return prev - 1;
        });
      }, 1000);

      autoStopTimerRef.current = window.setTimeout(() => {
        stopRecording();
      }, RECORD_SECONDS * 1000);
    } catch (err) {
      cleanupTimers();
      cleanupAudioNodes();
      setStatus("error");
      setError(
        err instanceof Error
          ? err.message
          : "無法取得麥克風權限，請確認瀏覽器已允許錄音。"
      );
    }
  }, [cleanupAudioNodes, cleanupTimers, status, stopRecording, stopVisualAnalysis, uploadSoundFlower]);

  const reset = useCallback(() => {
    cleanupTimers();

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }

    cleanupAudioNodes();

    setStatus("idle");
    setCountdown(RECORD_SECONDS);
    setError(null);
    setFeatures(null);
    setDescription("");
    setServerAudioUrl(null);

    setAudioUrl((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return null;
    });

    mediaRecorderRef.current = null;
    chunksRef.current = [];
  }, [cleanupAudioNodes, cleanupTimers]);

  useEffect(() => {
    return () => {
      cleanupTimers();
      cleanupAudioNodes();
    };
  }, [cleanupAudioNodes, cleanupTimers]);

  return {
    status,
    countdown,
    audioUrl: serverAudioUrl || audioUrl,
    error,
    features,
    description,
    canStart: status === "idle" || status === "done" || status === "error",
    startRecording,
    stopRecording,
    reset,
  };
}