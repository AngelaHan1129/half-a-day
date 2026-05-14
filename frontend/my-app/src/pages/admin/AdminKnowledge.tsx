import { useMemo, useState } from "react";
import {
  knowledgeApi,
  type KnowledgeDocument,
} from "../../services/api/knowledgeApi";

type SubmitState = "idle" | "submitting" | "success" | "error";

function getDocumentText(doc: KnowledgeDocument): string {
  if (typeof doc.text === "string" && doc.text.trim()) return doc.text;
  if (typeof doc.content === "string" && doc.content.trim()) return doc.content;
  return "";
}

const defaultTopK = 3;

const AdminKnowledge = () => {
  const [query, setQuery] = useState("");
  const [topK, setTopK] = useState(defaultTopK);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [searchResult, setSearchResult] = useState("");
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);

  const [content, setContent] = useState("");
  const [source, setSource] = useState("manual");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const trimmedQuery = useMemo(() => query.trim(), [query]);
  const trimmedContent = useMemo(() => content.trim(), [content]);

  const handleSearch = async () => {
    if (!trimmedQuery) {
      setSearchError("請輸入搜尋關鍵字");
      return;
    }

    try {
      setSearchLoading(true);
      setSearchError("");

      const [resultRes, docsRes] = await Promise.all([
        knowledgeApi.search(trimmedQuery, topK),
        knowledgeApi.searchDocuments(trimmedQuery, topK),
      ]);

      setSearchResult(resultRes.result ?? "");
      setDocuments(docsRes ?? []);
    } catch (error) {
      setSearchResult("");
      setDocuments([]);
      setSearchError(error instanceof Error ? error.message : "搜尋失敗");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleAddKnowledge = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!trimmedContent) {
      setSubmitState("error");
      setSubmitMessage("知識內容不可為空");
      return;
    }

    try {
      setSubmitState("submitting");
      setSubmitMessage("");

      const res = await knowledgeApi.addKnowledge({
        content: trimmedContent,
        source: source.trim() || "manual",
      });

      setSubmitState("success");
      setSubmitMessage(`${res.message}（source: ${res.source}）`);
      setContent("");

      if (trimmedQuery) {
        await handleSearch();
      }
    } catch (error) {
      setSubmitState("error");
      setSubmitMessage(error instanceof Error ? error.message : "新增失敗");
    }
  };

  const cardStyle = {
    borderColor: "var(--app-border)",
    background: "var(--app-card)",
    boxShadow: "var(--app-shadow)",
    color: "var(--app-text)",
  } as const;

  const fieldStyle = {
    borderColor: "var(--app-border)",
    background: "var(--app-surface)",
    color: "var(--app-text)",
    boxShadow: "var(--app-shadow)",
  } as const;

  return (
    <div className="space-y-6" style={{ color: "var(--app-text)" }}>
      <section>
        <h1 className="text-3xl font-black">知識管理</h1>
        <p
          className="mt-2 text-sm"
          style={{ color: "var(--app-text-muted)" }}
        >
          可新增知識內容，並即時做語意搜尋與查看原始文件結果。
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <form
          onSubmit={handleAddKnowledge}
          className="rounded-3xl border p-5 transition-colors duration-300"
          style={cardStyle}
        >
          <div className="mb-4">
            <h2 className="text-lg font-bold">新增知識</h2>
            <p
              className="mt-1 text-sm"
              style={{ color: "var(--app-text-muted)" }}
            >
              將文字寫入知識庫，後端會自動建立 embedding。
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label
                className="mb-2 block text-sm"
                style={{ color: "var(--app-text-muted)" }}
              >
                來源
              </label>
              <input
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="manual"
                className="w-full rounded-2xl border px-4 py-3 text-sm outline-none transition"
                style={fieldStyle}
              />
            </div>

            <div>
              <label
                className="mb-2 block text-sm"
                style={{ color: "var(--app-text-muted)" }}
              >
                知識內容
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                placeholder="例如：小半天高架橋位於南投縣鹿谷鄉，是小半天地區的重要景點之一。"
                className="w-full rounded-2xl border px-4 py-3 text-sm outline-none transition"
                style={fieldStyle}
              />
            </div>

            {submitMessage ? (
              <div
                className="rounded-2xl border px-4 py-3 text-sm"
                style={
                  submitState === "success"
                    ? {
                        borderColor: "rgba(34, 197, 94, 0.24)",
                        background: "rgba(34, 197, 94, 0.10)",
                        color: "#15803d",
                      }
                    : submitState === "error"
                    ? {
                        borderColor: "rgba(244, 63, 94, 0.24)",
                        background: "rgba(244, 63, 94, 0.10)",
                        color: "#e11d48",
                      }
                    : {
                        borderColor: "var(--app-border)",
                        background: "var(--app-surface)",
                        color: "var(--app-text-muted)",
                      }
                }
              >
                {submitMessage}
              </div>
            ) : null}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitState === "submitting"}
                className="rounded-2xl px-5 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  background: "var(--app-accent)",
                  color: "#ffffff",
                }}
              >
                {submitState === "submitting" ? "新增中..." : "新增知識"}
              </button>
            </div>
          </div>
        </form>

        <section
          className="rounded-3xl border p-5 transition-colors duration-300"
          style={cardStyle}
        >
          <div className="mb-4">
            <h2 className="text-lg font-bold">語意搜尋</h2>
            <p
              className="mt-1 text-sm"
              style={{ color: "var(--app-text-muted)" }}
            >
              輸入問題後，查看整合結果與 raw documents。
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label
                className="mb-2 block text-sm"
                style={{ color: "var(--app-text-muted)" }}
              >
                查詢內容
              </label>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="例如：小半天高架橋"
                className="w-full rounded-2xl border px-4 py-3 text-sm outline-none transition"
                style={fieldStyle}
              />
            </div>

            <div>
              <label
                className="mb-2 block text-sm"
                style={{ color: "var(--app-text-muted)" }}
              >
                Top K
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={topK}
                onChange={(e) => setTopK(Math.max(1, Number(e.target.value) || 1))}
                className="w-full rounded-2xl border px-4 py-3 text-sm outline-none transition"
                style={fieldStyle}
              />
            </div>

            <button
              type="button"
              onClick={handleSearch}
              disabled={searchLoading}
              className="w-full rounded-2xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                border: "1px solid color-mix(in srgb, var(--app-accent) 30%, transparent)",
                background: "color-mix(in srgb, var(--app-accent) 10%, var(--app-card))",
                color: "var(--app-accent)",
              }}
            >
              {searchLoading ? "搜尋中..." : "開始搜尋"}
            </button>

            {searchError ? (
              <div
                className="rounded-2xl border px-4 py-3 text-sm"
                style={{
                  borderColor: "rgba(244, 63, 94, 0.24)",
                  background: "rgba(244, 63, 94, 0.10)",
                  color: "#e11d48",
                }}
              >
                {searchError}
              </div>
            ) : null}
          </div>
        </section>
      </section>

      <section
        className="rounded-3xl border p-5 transition-colors duration-300"
        style={cardStyle}
      >
        <div className="mb-4">
          <h2 className="text-lg font-bold">整合結果</h2>
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--app-text-muted)" }}
          >
            來自 /api/knowledge/search 的結果。
          </p>
        </div>

        <div
          className="rounded-2xl border p-4"
          style={{
            borderColor: "var(--app-border)",
            background: "var(--app-surface)",
          }}
        >
          {searchResult ? (
            <pre
              className="whitespace-pre-wrap break-words text-sm leading-7"
              style={{ color: "var(--app-text)" }}
            >
              {searchResult}
            </pre>
          ) : (
            <p
              className="text-sm"
              style={{ color: "var(--app-text-muted)" }}
            >
              尚無搜尋結果
            </p>
          )}
        </div>
      </section>

      <section
        className="rounded-3xl border p-5 transition-colors duration-300"
        style={cardStyle}
      >
        <div className="mb-4">
          <h2 className="text-lg font-bold">Raw Documents</h2>
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--app-text-muted)" }}
          >
            來自 /api/knowledge/documents 的原始文件清單。
          </p>
        </div>

        {documents.length === 0 ? (
          <div
            className="rounded-2xl border border-dashed px-4 py-8 text-center text-sm"
            style={{
              borderColor: "var(--app-border)",
              color: "var(--app-text-muted)",
              background: "color-mix(in srgb, var(--app-card) 84%, transparent)",
            }}
          >
            尚無文件結果
          </div>
        ) : (
          <div className="space-y-4">
            {documents.map((doc, index) => (
              <article
                key={`${index}-${getDocumentText(doc).slice(0, 20)}`}
                className="rounded-2xl border p-4 transition-colors duration-300"
                style={{
                  borderColor: "var(--app-border)",
                  background: "var(--app-surface)",
                }}
              >
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span
                    className="rounded-full px-3 py-1 text-xs font-semibold"
                    style={{
                      background:
                        "color-mix(in srgb, var(--app-accent) 12%, var(--app-card))",
                      color: "var(--app-accent)",
                    }}
                  >
                    #{index + 1}
                  </span>

                  {typeof doc.score === "number" ? (
                    <span
                      className="rounded-full px-3 py-1 text-xs"
                      style={{
                        background: "var(--app-card)",
                        color: "var(--app-text-muted)",
                        border: "1px solid var(--app-border)",
                      }}
                    >
                      score: {doc.score.toFixed(4)}
                    </span>
                  ) : null}
                </div>

                <p
                  className="whitespace-pre-wrap break-words text-sm leading-7"
                  style={{ color: "var(--app-text)" }}
                >
                  {getDocumentText(doc) || "此筆文件沒有可顯示文字"}
                </p>

                {doc.metadata ? (
                  <pre
                    className="mt-4 overflow-x-auto rounded-xl border p-3 text-xs"
                    style={{
                      borderColor: "var(--app-border)",
                      background: "color-mix(in srgb, var(--app-bg) 55%, var(--app-card))",
                      color: "var(--app-text-muted)",
                    }}
                  >
                    {JSON.stringify(doc.metadata, null, 2)}
                  </pre>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminKnowledge;