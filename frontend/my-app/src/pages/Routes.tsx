import { useEffect, useState } from 'react';
import { routeApi } from '../services/api/routesApi';
import type { Route } from '../types/route';

export default function Routes() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [keyword, setKeyword] = useState('');
  const [maxHours, setMaxHours] = useState('');
  const [season, setSeason] = useState('');

  useEffect(() => {
    const loadRoutes = async () => {
      try {
        setLoading(true);
        setError('');

        let data: Route[];

        if (keyword.trim()) {
          data = await routeApi.search(keyword.trim());
        } else if (maxHours.trim()) {
          data = await routeApi.getByDuration(Number(maxHours));
        } else if (season.trim()) {
          data = await routeApi.getBySeason(season.trim());
        } else {
          data = await routeApi.getAll();
        }

        setRoutes(data);
      } catch (err) {
        console.error(err);
        setError('載入路線資料失敗');
      } finally {
        setLoading(false);
      }
    };

    loadRoutes();
  }, [keyword, maxHours, season]);

  return (
    <div style={{ padding: '32px' }}>
      <h1>遊程路線</h1>

      <div style={{ display: 'flex', gap: '12px', margin: '20px 0', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="輸入關鍵字搜尋路線"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            if (e.target.value) {
              setMaxHours('');
              setSeason('');
            }
          }}
          style={{
            padding: '10px 12px',
            minWidth: '240px',
            borderRadius: '8px',
            border: '1px solid #ccc',
          }}
        />

        <input
          type="number"
          placeholder="最大時數"
          value={maxHours}
          onChange={(e) => {
            setMaxHours(e.target.value);
            if (e.target.value) {
              setKeyword('');
              setSeason('');
            }
          }}
          style={{
            padding: '10px 12px',
            width: '140px',
            borderRadius: '8px',
            border: '1px solid #ccc',
          }}
        />

        <input
          type="text"
          placeholder="季節，例如 spring"
          value={season}
          onChange={(e) => {
            setSeason(e.target.value);
            if (e.target.value) {
              setKeyword('');
              setMaxHours('');
            }
          }}
          style={{
            padding: '10px 12px',
            width: '180px',
            borderRadius: '8px',
            border: '1px solid #ccc',
          }}
        />

        <button
          onClick={() => {
            setKeyword('');
            setMaxHours('');
            setSeason('');
          }}
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            border: 'none',
            background: '#1f2937',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          清除篩選
        </button>
      </div>

      {loading && <p>載入中...</p>}
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      {!loading && !error && routes.length === 0 && <p>查無路線資料</p>}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '16px',
          marginTop: '24px',
        }}
      >
        {routes.map((route) => (
          <div
            key={route.id}
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '16px',
              background: '#fff',
              boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
            }}
          >
            <h3>{route.name}</h3>
            <p><strong>時數：</strong>{route.durationHours ?? '未提供'} 小時</p>
            <p><strong>適合季節：</strong>{route.suitableSeasons || '未提供'}</p>
            <p><strong>難度：</strong>{route.difficulty || '未提供'}</p>
            <p><strong>團體建議：</strong>{route.groupSizeNote || '未提供'}</p>
            <p><strong>站點數：</strong>{route.stops?.length ?? 0}</p>
            <p style={{ color: '#4b5563' }}>{route.description || '無描述'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}