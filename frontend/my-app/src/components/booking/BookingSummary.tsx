import type { Route } from '../../types/route';

type BookingSummaryProps = {
  routes: Route[];
  routeId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  travelDate: string;
  people: number;
  notes: string;
};

export default function BookingSummary({
  routes,
  routeId,
  userName,
  userEmail,
  userPhone,
  travelDate,
  people,
  notes,
}: BookingSummaryProps) {
  const selectedRoute = routes.find((route) => String(route.id) === routeId);

  return (
    <aside className="rounded-[28px] border border-white/10 bg-white/5 p-6 md:p-8">
      <h2 className="text-lg font-bold text-white">預約摘要</h2>

      <div className="mt-5 grid gap-4 text-sm text-white/80">
        <div>
          <p className="text-white/50">路線</p>
          <p className="mt-1 font-medium text-white">
            {selectedRoute?.name || '尚未選擇'}
          </p>
        </div>

        <div>
          <p className="text-white/50">姓名</p>
          <p className="mt-1 font-medium text-white">{userName || '尚未填寫'}</p>
        </div>

        <div>
          <p className="text-white/50">Email</p>
          <p className="mt-1 font-medium text-white">{userEmail || '尚未填寫'}</p>
        </div>

        <div>
          <p className="text-white/50">電話</p>
          <p className="mt-1 font-medium text-white">{userPhone || '未提供'}</p>
        </div>

        <div>
          <p className="text-white/50">出發時間</p>
          <p className="mt-1 font-medium text-white">
            {travelDate || '尚未選擇'}
          </p>
        </div>

        <div>
          <p className="text-white/50">人數</p>
          <p className="mt-1 font-medium text-white">{people} 人</p>
        </div>

        <div>
          <p className="text-white/50">備註</p>
          <p className="mt-1 font-medium text-white">{notes || '無'}</p>
        </div>
      </div>
    </aside>
  );
}