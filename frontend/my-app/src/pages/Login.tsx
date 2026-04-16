const Login = () => {
  return (
    <main className="grid min-h-[calc(100vh-4rem)] place-items-center px-4 py-16">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <p className="mb-3 text-sm uppercase tracking-[0.24em] text-lime-300">
          Login
        </p>
        <h1 className="text-3xl font-black tracking-tight text-white">管理者登入</h1>

        <form className="mt-8 space-y-4">
          <div>
            <label className="mb-2 block text-sm text-white/70">帳號</label>
            <input
              type="text"
              className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none ring-0 placeholder:text-white/30 focus:border-lime-300"
              placeholder="請輸入帳號"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">密碼</label>
            <input
              type="password"
              className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none ring-0 placeholder:text-white/30 focus:border-lime-300"
              placeholder="請輸入密碼"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-lime-300 px-4 py-3 font-bold text-slate-950 transition hover:bg-lime-200"
          >
            登入
          </button>
        </form>
      </div>
    </main>
  );
};

export default Login;