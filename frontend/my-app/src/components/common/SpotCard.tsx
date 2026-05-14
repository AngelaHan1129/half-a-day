import { Link } from "react-router-dom";

export type SpotCardItem = {
  id: string;
  name: string;
  village: string;
  category: string;
  description: string;
  image: string;
};

type SpotCardProps = {
  spot: SpotCardItem;
};

const SpotCard = ({ spot }: SpotCardProps) => {
  return (
    <article
      className="group overflow-hidden rounded-[28px] border backdrop-blur-sm transition duration-300 hover:-translate-y-1"
      style={{
        borderColor: "var(--app-border)",
        background: "var(--app-card)",
        boxShadow: "var(--app-shadow)",
      }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={spot.image}
          alt={spot.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, color-mix(in srgb, var(--app-bg) 72%, transparent) 0%, color-mix(in srgb, var(--app-bg) 12%, transparent) 38%, transparent 100%)",
          }}
        />

        <div
          className="absolute left-4 top-4 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur"
          style={{
            borderColor: "color-mix(in srgb, var(--app-border) 85%, transparent)",
            background: "color-mix(in srgb, var(--app-card) 72%, transparent)",
            color: "var(--app-text)",
          }}
        >
          {spot.category}
        </div>
      </div>

      <div className="p-5 md:p-6">
        <p
          className="text-sm uppercase tracking-[0.2em]"
          style={{ color: "var(--app-accent)" }}
        >
          {spot.village}
        </p>

        <h3
          className="mt-3 text-2xl font-bold tracking-tight"
          style={{ color: "var(--app-text)" }}
        >
          {spot.name}
        </h3>

        <p
          className="mt-3 line-clamp-3 text-sm leading-7 md:text-base"
          style={{ color: "var(--app-text-muted)" }}
        >
          {spot.description}
        </p>

        <div className="mt-6">
          <Link
            to={`/spots/${spot.id}`}
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition duration-200"
            style={{
              borderColor: "var(--app-border)",
              background: "var(--app-surface)",
              color: "var(--app-text)",
            }}
          >
            查看景點
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default SpotCard;