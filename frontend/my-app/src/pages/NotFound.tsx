import { Link } from "react-router-dom";
import { PATHS } from "../app/router/paths";

const NotFound = () => {
  return (
    <main className="grid min-h-[70vh] place-items-center px-4 py-20">
      <div className="max-w-xl text-center">
        <p className="text-sm uppercase tracking-[0.24em] text-lime-300">404</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-white md:text-6xl">
          找不到這個頁面
        </h1>
        <p className="mt-6 text-lg leading-8 text-white/70">
          你要前往的頁面可能不存在、已被移動，或網址輸入錯誤。
        </p>

        <div className="mt-8 flex justify-center">
          <Link
            to={PATHS.home}
            className="rounded-full bg-lime-300 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-lime-200"
          >
            回到首頁
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotFound;