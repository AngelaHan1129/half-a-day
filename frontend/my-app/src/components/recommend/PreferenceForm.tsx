import type { RecommendRequest } from '../../types/recommend';

type PreferenceFormProps = {
  form: RecommendRequest;
  onChange: <K extends keyof RecommendRequest>(
    key: K,
    value: RecommendRequest[K]
  ) => void;
};

export default function PreferenceForm({
  form,
  onChange,
}: PreferenceFormProps) {
  return (
    <div className="grid gap-5">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-white">目的地</label>
        <input
          value={form.destination}
          onChange={(e) => onChange('destination', e.target.value)}
          placeholder="例如：小半天、鹿谷"
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-lime-300"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-white">偏好描述</label>
        <textarea
          value={form.preferences}
          onChange={(e) => onChange('preferences', e.target.value)}
          rows={4}
          placeholder="例如：想看竹林、喜歡散步、想拍照、希望不要太趕"
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-lime-300"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-white">旅遊風格</label>
        <input
          value={form.travelStyle}
          onChange={(e) => onChange('travelStyle', e.target.value)}
          placeholder="例如：慢遊、深度探索、輕鬆散策"
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-lime-300"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-white">預算等級</label>
        <select
          value={form.budgetLevel}
          onChange={(e) => onChange('budgetLevel', e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-lime-300"
        >
          <option value="" className="text-slate-900">
            請選擇預算
          </option>
          <option value="low" className="text-slate-900">
            低
          </option>
          <option value="medium" className="text-slate-900">
            中
          </option>
          <option value="high" className="text-slate-900">
            高
          </option>
        </select>
      </div>

      <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
        <input
          type="checkbox"
          checked={form.weatherAware}
          onChange={(e) => onChange('weatherAware', e.target.checked)}
        />
        考慮天氣條件做推薦
      </label>
    </div>
  );
}