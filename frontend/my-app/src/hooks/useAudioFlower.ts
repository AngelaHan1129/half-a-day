import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

type Status =
  | "idle"
  | "requesting"
  | "recording"
  | "processing"
  | "done"
  | "error";

const RECORD_MS = 10_000;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const avg = (arr: number[]) =>
  arr.length ? arr.reduce((sum, n) => sum + n, 0) / arr.length : 0;

const varianceOf = (arr: number[]) => {
  if (!arr.length) return 0;
  const mean = avg(arr);
  return avg(arr.map((n) => (n - mean) ** 2));
};

export const useAudioFlower = () => {
  const [status, setStatus] = useState<Status>("idle");
  const [countdown, setCountdown] = useState(10);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [features, setFeatures] = useState<FlowerFeatures | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const rafRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const secondTickRef = useRef<number | null>(null);

  const energyFramesRef = useRef<number[]>([]);
  const bassFramesRef = useRef<number[]>([]);
  const midFramesRef = useRef<number[]>([]);
  const trebleFramesRef = useRef<number[]>([]);

  const cleanupStream = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    if (secondTickRef.current !== null) window.clearInterval(secondTickRef.current);

    streamRef.current?.getTracks().forEach((track) => track.stop());
    sourceRef.current?.disconnect();
    analyserRef.current?.disconnect();

    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      void audioContextRef.current.close();
    }

    mediaRecorderRef.current = null;
    streamRef.current = null;
    audioContextRef.current = null;
    analyserRef.current = null;
    sourceRef.current = null;
    rafRef.current = null;
    timerRef.current = null;
    secondTickRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      cleanupStream();
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl, cleanupStream]);

  const startAnalyserLoop = useCallback(() => {
    const analyser = analyserRef.current;
    const audioContext = audioContextRef.current;
    if (!analyser || !audioContext) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const readFrame = () => {
      analyser.getByteFrequencyData(dataArray);

      const nyquist = audioContext.sampleRate / 2;
      const bassValues: number[] = [];
      const midValues: number[] = [];
      const trebleValues: number[] = [];
      const allValues: number[] = [];

      for (let i = 0; i < bufferLength; i += 1) {
        const freq = (i / bufferLength) * nyquist;
        const value = dataArray[i] / 255;
        allValues.push(value);

        if (freq < 250) bassValues.push(value);
        else if (freq < 2000) midValues.push(value);
        else trebleValues.push(value);
      }

      energyFramesRef.current.push(avg(allValues));
      bassFramesRef.current.push(avg(bassValues));
      midFramesRef.current.push(avg(midValues));
      trebleFramesRef.current.push(avg(trebleValues));

      rafRef.current = requestAnimationFrame(readFrame);
    };

    readFrame();
  }, []);

  const buildFeatures = useCallback((): FlowerFeatures => {
    const bass = clamp(avg(bassFramesRef.current), 0, 1);
    const mid = clamp(avg(midFramesRef.current), 0, 1);
    const treble = clamp(avg(trebleFramesRef.current), 0, 1);
    const energy = clamp(avg(energyFramesRef.current), 0, 1);
    const variance = clamp(varianceOf(energyFramesRef.current) * 8, 0, 1);

    const petalCount = Math.round(clamp(6 + treble * 10 + variance * 8, 6, 24));
    const petalLength = clamp(70 + treble * 120 + energy * 40, 70, 220);
    const petalWidth = clamp(24 + bass * 90, 24, 120);
    const roundness = clamp(0.25 + bass * 0.75, 0.25, 1);
    const particleCount = Math.round(
      clamp(80 + energy * 240 + variance * 120, 80, 420)
    );
    const hueA = Math.round(clamp(95 + bass * 40, 80, 150));
    const hueB = Math.round(clamp(165 + treble * 70, 140, 250));

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
  }, []);

  const stopRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === "inactive") return;

    setStatus("processing");
    recorder.stop();
  }, []);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setFeatures(null);
      setStatus("requesting");
      setCountdown(10);

      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }

      chunksRef.current = [];
      energyFramesRef.current = [];
      bassFramesRef.current = [];
      midFramesRef.current = [];
      trebleFramesRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.82;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      sourceRef.current = source;

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onerror = () => {
        setStatus("error");
        setError("錄音過程發生錯誤，請再試一次。");
        cleanupStream();
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);

        setAudioUrl(url);
        setFeatures(buildFeatures());
        setCountdown(0);
        setStatus("done");

        cleanupStream();
      };

      recorder.start();
      setStatus("recording");
      startAnalyserLoop();

      let remaining = 10;
      secondTickRef.current = window.setInterval(() => {
        remaining -= 1;
        setCountdown(Math.max(remaining, 0));
      }, 1000);

      timerRef.current = window.setTimeout(() => {
        stopRecording();
      }, RECORD_MS);
    } catch (err) {
      setStatus("error");
      setError("無法取得麥克風權限，請確認瀏覽器已允許錄音。");
      cleanupStream();
    }
  }, [audioUrl, buildFeatures, cleanupStream, startAnalyserLoop, stopRecording]);

  const reset = useCallback(() => {
    cleanupStream();

    if (audioUrl) URL.revokeObjectURL(audioUrl);

    setAudioUrl(null);
    setFeatures(null);
    setError(null);
    setCountdown(10);
    setStatus("idle");
  }, [audioUrl, cleanupStream]);

  const canStart = useMemo(
    () => status === "idle" || status === "done" || status === "error",
    [status]
  );

  return {
    status,
    countdown,
    audioUrl,
    error,
    features,
    canStart,
    startRecording,
    stopRecording,
    reset,
  };
};