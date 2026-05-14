const About = () => {
  return (
    <main
      className="mx-auto max-w-7xl px-4 py-24 md:px-6"
      style={{ color: "var(--app-text)" }}
    >
      <section className="max-w-3xl">
        <p
          className="mb-3 text-sm uppercase tracking-[0.24em]"
          style={{ color: "var(--app-accent)" }}
        >
          About
        </p>

        <h1
          className="text-4xl font-black tracking-tight md:text-6xl"
          style={{ color: "var(--app-text)" }}
        >
          關於小半天
        </h1>

        <p
          className="mt-6 text-lg leading-8"
          style={{ color: "var(--app-text-muted)" }}
        >
          這裡將放入小半天的歷史由來、三村聚落、地方文化與三大特色產業內容。
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "歷史由來",
              desc: "介紹小半天名稱的起源、聚落發展與地方故事脈絡。",
            },
            {
              title: "三村聚落",
              desc: "整理長源、內樹皮與田子三村的人文地景與生活樣貌。",
            },
            {
              title: "特色產業",
              desc: "呈現竹林、茶業與地方農遊體驗的季節魅力與產業特色。",
            },
          ].map((item) => (
            <article
              key={item.title}
              className="rounded-3xl border p-5 transition duration-300"
              style={{
                background: "var(--app-card)",
                borderColor: "var(--app-border)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
              }}
            >
              <h2
                className="text-lg font-bold"
                style={{ color: "var(--app-text)" }}
              >
                {item.title}
              </h2>
              <p
                className="mt-3 text-sm leading-7"
                style={{ color: "var(--app-text-muted)" }}
              >
                {item.desc}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default About;