import { useEffect, useState } from "react";
import BookingSuccessCard from "../components/booking/BookingSuccessCard";
import BookingSummary from "../components/booking/BookingSummary";
import BookingWizard from "../components/booking/BookingWizard";
import { bookingApi } from "../services/api/bookingApi";
import { routeApi } from "../services/api/routesApi";
import type { Booking, BookingCreateRequest } from "../types/booking";
import type { Route } from "../types/route";

type BookingFormState = {
  routeId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  travelDate: string;
  people: number;
  notes: string;
};

const initialForm: BookingFormState = {
  routeId: "",
  userName: "",
  userEmail: "",
  userPhone: "",
  travelDate: "",
  people: 1,
  notes: "",
};

export default function Booking() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loadingRoutes, setLoadingRoutes] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Booking | null>(null);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<BookingFormState>(initialForm);

  useEffect(() => {
    const loadRoutes = async () => {
      try {
        setLoadingRoutes(true);
        setError("");
        const data = await routeApi.getAll();
        setRoutes(data);
      } catch (err) {
        console.error(err);
        setError("載入路線失敗");
      } finally {
        setLoadingRoutes(false);
      }
    };

    loadRoutes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!form.routeId) {
      setError("請選擇路線");
      setStep(1);
      return;
    }

    if (!form.userName || !form.userEmail) {
      setError("請完整填寫聯絡資料");
      setStep(2);
      return;
    }

    if (!form.travelDate) {
      setError("請選擇出發時間");
      setStep(3);
      return;
    }

    const payload: BookingCreateRequest = {
      route: { id: Number(form.routeId) },
      userName: form.userName,
      userEmail: form.userEmail,
      userPhone: form.userPhone || null,
      travelDate: new Date(form.travelDate).toISOString(),
      people: form.people,
      notes: form.notes || null,
    };

    try {
      setSubmitting(true);
      const created = await bookingApi.create(payload);
      setResult(created);
      setForm(initialForm);
      setStep(1);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "建立預約失敗");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError("");
    setForm(initialForm);
    setStep(1);
  };

  return (
    <main
      className="min-h-screen pt-24 pb-16 font-sans transition-colors duration-500"
      style={{
        backgroundColor: "var(--app-bg)",
        color: "var(--app-text)",
        // 依照目前文字顏色動態產生極淡的網點背景，模擬和紙手帳
        backgroundImage: "radial-gradient(color-mix(in srgb, var(--app-text) 10%, transparent) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    >
      {/* 注入手繪塗鴉與竹葉微動畫 */}
      <style>{`
        @keyframes doodle-float {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-6px) rotate(2deg); }
        }
        @keyframes bamboo-breeze {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(4deg) skewX(-2deg); }
        }
      `}</style>

      {/* 頂部標題區塊 (Hero Section) */}
      <section className="relative overflow-hidden mb-6">
        {/* 裝飾性背景：柔和光暈 */}
        <div
          className="absolute left-1/2 top-0 h-64 w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px] pointer-events-none"
          style={{ backgroundColor: "color-mix(in srgb, var(--app-accent) 12%, transparent)" }}
          aria-hidden="true"
        />

        {/* 裝飾性背景：竹葉飄落 SVG (左側) */}
        <div className="absolute left-[10%] top-10 opacity-20 text-[var(--app-accent)] animate-[bamboo-breeze_5s_ease-in-out_infinite] pointer-events-none hidden md:block">
          <svg className="h-12 w-12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.5,3C13.5,3 10,6.5 10,10.5C10,11.5 10.2,12.5 10.5,13.4L3.6,20.4L5,21.8L11.9,14.9C12.8,15.2 13.8,15.4 14.8,15.4C18.8,15.4 22.3,11.9 22.3,7.9L22.5,3H17.5Z" />
          </svg>
        </div>
        {/* 裝飾性背景：竹葉飄落 SVG (右側) */}
        <div className="absolute right-[15%] top-20 opacity-10 text-[var(--app-accent-2)] animate-[bamboo-breeze_6s_ease-in-out_infinite_reverse] pointer-events-none hidden lg:block">
          <svg className="h-16 w-16 -scale-x-100" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.5,3C13.5,3 10,6.5 10,10.5C10,11.5 10.2,12.5 10.5,13.4L3.6,20.4L5,21.8L11.9,14.9C12.8,15.2 13.8,15.4 14.8,15.4C18.8,15.4 22.3,11.9 22.3,7.9L22.5,3H17.5Z" />
          </svg>
        </div>

        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 pt-8 pb-4 text-center md:px-6 md:pt-12 md:pb-8">
          <div 
            className="inline-flex items-center justify-center gap-2 rounded-full border px-5 py-1.5 text-sm font-bold tracking-widest text-[var(--app-accent)] mb-5 shadow-sm animate-[doodle-float_4s_ease-in-out_infinite]"
            style={{ 
              borderColor: "color-mix(in srgb, var(--app-accent) 30%, transparent)", 
              backgroundColor: "color-mix(in srgb, var(--app-surface) 80%, transparent)",
              backdropFilter: "blur(8px)"
            }}
          >
            ✦ Smart Booking ✦
          </div>

          <h1 className="text-4xl font-black tracking-wide md:text-5xl lg:text-6xl text-[var(--app-text)]">
            預約專屬旅程
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed md:text-lg text-[var(--app-text-muted)]">
            放慢腳步，讓我們為您安排專屬的竹林秘境之旅。依照步驟選擇路線、填寫資訊，輕鬆完成小半天遊程預約。
          </p>
        </div>
      </section>

      {/* 預約表單內容區塊 */}
      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-12 md:px-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="relative z-10">
          {result ? (
            <BookingSuccessCard booking={result} onReset={handleReset} />
          ) : (
            <BookingWizard
              step={step}
              setStep={setStep}
              form={form}
              setForm={setForm}
              routes={routes}
              loadingRoutes={loadingRoutes}
              submitting={submitting}
              error={error}
              onSubmit={handleSubmit}
            />
          )}
        </div>

        <div className="relative z-10">
          <BookingSummary
            routes={routes}
            routeId={form.routeId}
            userName={form.userName}
            userEmail={form.userEmail}
            userPhone={form.userPhone}
            travelDate={form.travelDate}
            people={form.people}
            notes={form.notes}
          />
        </div>
      </section>
    </main>
  );
}