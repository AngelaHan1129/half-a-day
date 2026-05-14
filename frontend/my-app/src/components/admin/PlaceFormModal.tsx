import { useEffect, useMemo, useState } from "react";
import { placeApi } from "../../services/api/placeApi";
import {
  PLACE_TYPE_LABEL,
  type CreatePlacePayload,
  type Place,
  type PlaceType,
} from "../../types/place";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  initialData?: Place | null;
  onClose: () => void;
  onSuccess: (place: Place) => void;
};

type FormErrors = Partial<Record<keyof CreatePlacePayload, string>>;

const PLACE_TYPE_OPTIONS: PlaceType[] = [
  "SCENIC_SPOT",
  "RESTAURANT",
  "HOTEL",
  "ACTIVITY",
];

const createEmptyForm = (): CreatePlacePayload => ({
  name: "",
  type: "SCENIC_SPOT",
  description: "",
  address: "",
  phone: "",
  openingHours: "",
  avgPrice: null,
  imageUrls: "",
  mapUrl: "",
  latitude: null,
  longitude: null,
});

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidPhone(value: string) {
  return /^[0-9+\-()#\s]{6,20}$/.test(value);
}

function validateForm(form: CreatePlacePayload): FormErrors {
  const errors: FormErrors = {};

  if (!form.name.trim()) {
    errors.name = "請輸入名稱。";
  } else if (form.name.trim().length > 100) {
    errors.name = "名稱長度不可超過 100 字。";
  }

  if (!form.type) {
    errors.type = "請選擇類型。";
  }

  if (form.description && form.description.trim().length > 1000) {
    errors.description = "描述不可超過 1000 字。";
  }

  if (form.address && form.address.trim().length > 255) {
    errors.address = "地址不可超過 255 字。";
  }

  if (form.phone && form.phone.trim() && !isValidPhone(form.phone.trim())) {
    errors.phone = "電話格式不正確。";
  }

  if (form.openingHours && form.openingHours.trim().length > 100) {
    errors.openingHours = "營業時間不可超過 100 字。";
  }

  if (
    form.avgPrice !== null &&
    form.avgPrice !== undefined &&
    (Number.isNaN(Number(form.avgPrice)) || Number(form.avgPrice) < 0)
  ) {
    errors.avgPrice = "平均價格必須是大於等於 0 的數字。";
  }

  if (form.imageUrls && form.imageUrls.trim() && !isValidUrl(form.imageUrls.trim())) {
    errors.imageUrls = "圖片網址必須是合法的 http/https URL。";
  }

  if (form.mapUrl && form.mapUrl.trim() && !isValidUrl(form.mapUrl.trim())) {
    errors.mapUrl = "地圖網址必須是合法的 http/https URL。";
  }

  if (
    form.latitude !== null &&
    form.latitude !== undefined &&
    (Number.isNaN(Number(form.latitude)) ||
      Number(form.latitude) < -90 ||
      Number(form.latitude) > 90)
  ) {
    errors.latitude = "緯度必須介於 -90 到 90。";
  }

  if (
    form.longitude !== null &&
    form.longitude !== undefined &&
    (Number.isNaN(Number(form.longitude)) ||
      Number(form.longitude) < -180 ||
      Number(form.longitude) > 180)
  ) {
    errors.longitude = "經度必須介於 -180 到 180。";
  }

  return errors;
}

function PlaceFormModal({
  open,
  mode,
  initialData,
  onClose,
  onSuccess,
}: Props) {
  const [form, setForm] = useState<CreatePlacePayload>(createEmptyForm());
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const title = useMemo(
    () => (mode === "create" ? "新增景點" : "編輯景點"),
    [mode]
  );

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && initialData) {
      setForm({
        name: initialData.name ?? "",
        type: initialData.type ?? "SCENIC_SPOT",
        description: initialData.description ?? "",
        address: initialData.address ?? "",
        phone: initialData.phone ?? "",
        openingHours: initialData.openingHours ?? "",
        avgPrice: initialData.avgPrice ?? null,
        imageUrls: initialData.imageUrls ?? "",
        mapUrl: initialData.mapUrl ?? "",
        latitude: initialData.latitude ?? null,
        longitude: initialData.longitude ?? null,
      });
    } else {
      setForm(createEmptyForm());
    }

    setErrors({});
    setSubmitError("");
  }, [open, mode, initialData]);

  if (!open) return null;

  const updateField = <K extends keyof CreatePlacePayload>(
    key: K,
    value: CreatePlacePayload[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [key]: undefined,
    }));
  };

  const normalizePayload = (value: CreatePlacePayload): CreatePlacePayload => {
    return {
      name: value.name.trim(),
      type: value.type,
      description: value.description?.trim() || null,
      address: value.address?.trim() || null,
      phone: value.phone?.trim() || null,
      openingHours: value.openingHours?.trim() || null,
      avgPrice:
        value.avgPrice === null || value.avgPrice === undefined
          ? null
          : Number(value.avgPrice),
      imageUrls: value.imageUrls?.trim() || null,
      mapUrl: value.mapUrl?.trim() || null,
      latitude:
        value.latitude === null || value.latitude === undefined
          ? null
          : Number(value.latitude),
      longitude:
        value.longitude === null || value.longitude === undefined
          ? null
          : Number(value.longitude),
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = normalizePayload(form);
    const nextErrors = validateForm(payload);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError("");

      const result =
        mode === "create"
          ? await placeApi.create(payload)
          : await placeApi.update(initialData!.id, payload);

      onSuccess(result);
      onClose();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : `${title}失敗`);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full rounded-2xl border px-4 py-3 text-sm outline-none transition-colors duration-200";

  const inputStyle = (hasError?: string) =>
    ({
      borderColor: hasError ? "rgba(244, 63, 94, 0.5)" : "var(--app-border)",
      background: "var(--app-surface)",
      color: "var(--app-text)",
      boxShadow: "var(--app-shadow)",
    } as const);

  const errorText = (message?: string) =>
    message ? (
      <p className="text-xs" style={{ color: "#e11d48" }}>
        {message}
      </p>
    ) : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      style={{
        background: "color-mix(in srgb, var(--app-bg) 55%, black 45%)",
      }}
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-3xl border transition-colors duration-300"
        style={{
          borderColor: "var(--app-border)",
          background: "var(--app-card)",
          boxShadow: "var(--app-shadow)",
          color: "var(--app-text)",
        }}
      >
        <div
          className="flex items-center justify-between border-b px-6 py-4"
          style={{ borderColor: "var(--app-border)" }}
        >
          <div>
            <h3 className="text-xl font-bold">{title}</h3>
            <p
              className="mt-1 text-sm"
              style={{ color: "var(--app-text-muted)" }}
            >
              {mode === "create"
                ? "建立新的景點、餐飲、住宿或活動資料。"
                : "修改既有地點資料內容。"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border px-3 py-2 text-sm transition-colors duration-200"
            style={{
              borderColor: "var(--app-border)",
              background: "var(--app-surface)",
              color: "var(--app-text-muted)",
            }}
          >
            關閉
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="max-h-[calc(90vh-80px)] space-y-6 overflow-y-auto px-6 py-6"
        >
          {submitError && (
            <div
              className="rounded-2xl border px-4 py-3 text-sm"
              style={{
                borderColor: "rgba(244, 63, 94, 0.24)",
                background: "rgba(244, 63, 94, 0.08)",
                color: "var(--app-text)",
              }}
            >
              {submitError}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span
                className="text-sm"
                style={{ color: "var(--app-text-muted)" }}
              >
                名稱 *
              </span>
              <input
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="請輸入地點名稱"
                className={inputClass}
                style={inputStyle(errors.name)}
              />
              {errorText(errors.name)}
            </label>

            <label className="space-y-2">
              <span
                className="text-sm"
                style={{ color: "var(--app-text-muted)" }}
              >
                類型 *
              </span>
              <select
                value={form.type}
                onChange={(e) => updateField("type", e.target.value as PlaceType)}
                className={inputClass}
                style={inputStyle(errors.type)}
              >
                {PLACE_TYPE_OPTIONS.map((type) => (
                  <option key={type} value={type}>
                    {PLACE_TYPE_LABEL[type]}
                  </option>
                ))}
              </select>
              {errorText(errors.type)}
            </label>
          </div>

          <label className="space-y-2">
            <span
              className="text-sm"
              style={{ color: "var(--app-text-muted)" }}
            >
              地址
            </span>
            <input
              value={form.address ?? ""}
              onChange={(e) => updateField("address", e.target.value)}
              placeholder="請輸入地址"
              className={inputClass}
              style={inputStyle(errors.address)}
            />
            {errorText(errors.address)}
          </label>

          <label className="space-y-2">
            <span
              className="text-sm"
              style={{ color: "var(--app-text-muted)" }}
            >
              描述
            </span>
            <textarea
              value={form.description ?? ""}
              onChange={(e) => updateField("description", e.target.value)}
              rows={4}
              placeholder="請輸入地點介紹"
              className={inputClass}
              style={inputStyle(errors.description)}
            />
            {errorText(errors.description)}
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span
                className="text-sm"
                style={{ color: "var(--app-text-muted)" }}
              >
                電話
              </span>
              <input
                value={form.phone ?? ""}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="例如 04-12345678"
                className={inputClass}
                style={inputStyle(errors.phone)}
              />
              {errorText(errors.phone)}
            </label>

            <label className="space-y-2">
              <span
                className="text-sm"
                style={{ color: "var(--app-text-muted)" }}
              >
                營業時間
              </span>
              <input
                value={form.openingHours ?? ""}
                onChange={(e) => updateField("openingHours", e.target.value)}
                placeholder="例如 09:00 - 18:00"
                className={inputClass}
                style={inputStyle(errors.openingHours)}
              />
              {errorText(errors.openingHours)}
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2">
              <span
                className="text-sm"
                style={{ color: "var(--app-text-muted)" }}
              >
                平均價格
              </span>
              <input
                type="number"
                min={0}
                value={form.avgPrice ?? ""}
                onChange={(e) =>
                  updateField(
                    "avgPrice",
                    e.target.value === "" ? null : Number(e.target.value)
                  )
                }
                placeholder="例如 300"
                className={inputClass}
                style={inputStyle(errors.avgPrice)}
              />
              {errorText(errors.avgPrice)}
            </label>

            <label className="space-y-2">
              <span
                className="text-sm"
                style={{ color: "var(--app-text-muted)" }}
              >
                緯度
              </span>
              <input
                type="number"
                step="any"
                min={-90}
                max={90}
                value={form.latitude ?? ""}
                onChange={(e) =>
                  updateField(
                    "latitude",
                    e.target.value === "" ? null : Number(e.target.value)
                  )
                }
                placeholder="例如 23.123456"
                className={inputClass}
                style={inputStyle(errors.latitude)}
              />
              {errorText(errors.latitude)}
            </label>

            <label className="space-y-2">
              <span
                className="text-sm"
                style={{ color: "var(--app-text-muted)" }}
              >
                經度
              </span>
              <input
                type="number"
                step="any"
                min={-180}
                max={180}
                value={form.longitude ?? ""}
                onChange={(e) =>
                  updateField(
                    "longitude",
                    e.target.value === "" ? null : Number(e.target.value)
                  )
                }
                placeholder="例如 120.123456"
                className={inputClass}
                style={inputStyle(errors.longitude)}
              />
              {errorText(errors.longitude)}
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span
                className="text-sm"
                style={{ color: "var(--app-text-muted)" }}
              >
                圖片網址
              </span>
              <input
                value={form.imageUrls ?? ""}
                onChange={(e) => updateField("imageUrls", e.target.value)}
                placeholder="https://example.com/image.jpg"
                className={inputClass}
                style={inputStyle(errors.imageUrls)}
              />
              {errorText(errors.imageUrls)}
            </label>

            <label className="space-y-2">
              <span
                className="text-sm"
                style={{ color: "var(--app-text-muted)" }}
              >
                地圖網址
              </span>
              <input
                value={form.mapUrl ?? ""}
                onChange={(e) => updateField("mapUrl", e.target.value)}
                placeholder="https://maps.google.com/..."
                className={inputClass}
                style={inputStyle(errors.mapUrl)}
              />
              {errorText(errors.mapUrl)}
            </label>
          </div>

          <div
            className="flex items-center justify-end gap-3 border-t pt-4"
            style={{ borderColor: "var(--app-border)" }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-2xl border px-4 py-3 text-sm transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                borderColor: "var(--app-border)",
                background: "var(--app-surface)",
                color: "var(--app-text-muted)",
              }}
            >
              取消
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-2xl px-5 py-3 text-sm font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                background: "var(--app-accent)",
                color: "#ffffff",
                boxShadow: "var(--app-shadow)",
              }}
            >
              {submitting
                ? mode === "create"
                  ? "新增中..."
                  : "儲存中..."
                : mode === "create"
                ? "新增景點"
                : "儲存變更"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PlaceFormModal;