import type { RecommendRequest } from '../../types/recommend';

const BASE_URL = '';

export const recommendApi = {
  recommend: async (payload: RecommendRequest): Promise<string> => {
    const response = await fetch(`${BASE_URL}/api/recommend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(
        `推薦失敗：${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ''}`
      );
    }

    return await response.text();
  },

  recommendStream: async (
    payload: RecommendRequest,
    onChunk: (chunk: string) => void
  ): Promise<void> => {
    const response = await fetch(`${BASE_URL}/api/recommend/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(
        `串流推薦失敗：${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ''}`
      );
    }

    if (!response.body) {
      throw new Error('瀏覽器不支援串流回應');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const events = buffer.split('\n\n');
      buffer = events.pop() ?? '';

      for (const event of events) {
        const lines = event.split('\n');
        for (const line of lines) {
          if (line.startsWith('data:')) {
            const chunk = line.slice(5).trim();
            if (chunk) {
              onChunk(chunk);
            }
          }
        }
      }
    }

    if (buffer.trim()) {
      const lines = buffer.split('\n');
      for (const line of lines) {
        if (line.startsWith('data:')) {
          const chunk = line.slice(5).trim();
          if (chunk) {
            onChunk(chunk);
          }
        }
      }
    }
  },
};