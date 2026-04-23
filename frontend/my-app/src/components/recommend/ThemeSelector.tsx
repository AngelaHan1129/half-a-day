type ThemeSelectorProps = {
  value: string;
  onChange: (value: string) => void;
};

const themeOptions = [
  { label: '自然療癒', value: 'nature' },
  { label: '美食慢旅', value: 'food' },
  { label: '拍照打卡', value: 'photo' },
  { label: '文化故事', value: 'culture' },
  { label: '親子互動', value: 'family' },
];

export default function ThemeSelector({
  value,
  onChange,
}: ThemeSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-white">旅遊主題</label>
      <div className="flex flex-wrap gap-3">
        {themeOptions.map((option) => {
          const active = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={[
                'rounded-full px-4 py-2 text-sm transition',
                active
                  ? 'bg-fuchsia-300 font-bold text-slate-950'
                  : 'border border-white/10 bg-white/5 text-white/80 hover:bg-white/10',
              ].join(' ')}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}