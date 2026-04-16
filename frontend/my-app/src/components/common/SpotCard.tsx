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
    <article className="group overflow-hidden rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-sm transition hover:-translate-y-1 hover:border-lime-300/30 hover:bg-white/10">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={spot.image}
          alt={spot.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
        <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-slate-950/60 px-3 py-1 text-xs font-medium text-white/85 backdrop-blur">
          {spot.category}
        </div>
      </div>

      <div className="p-5 md:p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-lime-300/90">
          {spot.village}
        </p>

        <h3 className="mt-3 text-2xl font-bold tracking-tight text-white">
          {spot.name}
        </h3>

        <p className="mt-3 line-clamp-3 text-sm leading-7 text-white/70 md:text-base">
          {spot.description}
        </p>

        <div className="mt-6">
          <Link
            to={`/spots/${spot.id}`}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/80 transition hover:border-lime-300/40 hover:bg-lime-300 hover:text-slate-950"
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