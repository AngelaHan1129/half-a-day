const API_BASE =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8080";

export type KnowledgeSearchResponse = {
  query: string;
  topK: number;
  result: string;
};

export type KnowledgeDocument = {
  id?: string;
  text?: string;
  content?: string;
  metadata?: Record<string, unknown>;
  score?: number;
};

export type AddKnowledgePayload = {
  content: string;
  source?: string;
};

export type AddKnowledgeResponse = {
  message: string;
  source: string;
};

async function handleJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = `Request failed: ${response.status}`;
    try {
      const text = await response.text();
      if (text) message = text;
    } catch {
      //
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export const knowledgeApi = {
  async search(query: string, topK = 3): Promise<KnowledgeSearchResponse> {
    const url = new URL(`${API_BASE}/api/knowledge/search`);
    url.searchParams.set("query", query);
    url.searchParams.set("topK", String(topK));

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    });

    return handleJsonResponse<KnowledgeSearchResponse>(response);
  },

  async searchDocuments(query: string, topK = 3): Promise<KnowledgeDocument[]> {
    const url = new URL(`${API_BASE}/api/knowledge/documents`);
    url.searchParams.set("query", query);
    url.searchParams.set("topK", String(topK));

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    });

    return handleJsonResponse<KnowledgeDocument[]>(response);
  },

  async addKnowledge(payload: AddKnowledgePayload): Promise<AddKnowledgeResponse> {
    const response = await fetch(`${API_BASE}/api/knowledge`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        content: payload.content,
        source: payload.source?.trim() || "manual",
      }),
    });

    return handleJsonResponse<AddKnowledgeResponse>(response);
  },
};