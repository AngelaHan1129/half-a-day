type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

const PageHero = ({ eyebrow, title, description }: PageHeroProps) => {
  return (
    <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(163,230,53,0.12),transparent_30%),linear-gradient(180deg,#020617_0%,#0f172a_100%)]">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-24">
        <p className="text-sm uppercase tracking-[0.24em] text-lime-300">
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight text-white md:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-white/70 md:text-lg">
          {description}
        </p>
      </div>
    </section>
  );
};

export default PageHero;