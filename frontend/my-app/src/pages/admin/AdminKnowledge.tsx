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

const SOURCE_OPTIONS = [
  { value: "manual", label: "✍️ 手動登錄 (manual)" },
  { value: "wiki", label: "🌐 維基百科 (wiki)" },
  { value: "lugu_travel_guide", label: "🗺️ 鹿谷導覽 (lugu_travel_guide)" },
  { value: "nantou_news", label: "📰 南投新聞 (nantou_news)" },
  { value: "taiwan_agriculture", label: "🍃 台灣農業 (taiwan_agriculture)" },
  { value: "history_walk", label: "📜 歷史文獻 (history_walk)" },
  { value: "local_culture", label: "🏡 地方文史 (local_culture)" },
];

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

  // 共用輸入框基礎樣式類別
  const inputBaseClass =
    "w-full rounded-[14px] border px-4 py-2.5 text-sm outline-none transition-all duration-300 focus:ring-2 bg-[var(--app-surface)] border-[var(--app-border)] text-[var(--app-text)] placeholder:text-[var(--app-muted)]";

  const inputFocusStyle = {
    '--tw-ring-color': 'color-mix(in srgb, var(--app-accent) 40%, transparent)',
  } as React.CSSProperties;

  return (
    <div className="space-y-6 p-1 transition-colors duration-500" style={{ color: "var(--app-text)" }}>
      {/* 注入手帳風特殊幾何切角語彙與框線樣式 */}
      <style>{`
        .bamboo-leaf-shape {
          border-radius: 16px 4px 16px 4px;
        }
        .bamboo-leaf-shape:not(:disabled):hover {
          border-radius: 4px 16px 4px 16px;
        }
        .hand-drawn-panel-border {
          border-radius: 24px 22px 24px 22px/18px 24px 18px 24px;
        }
        .hand-drawn-item-border {
          border-radius: 20px 24px 18px 22px/22px 16px 24px 18px;
        }
      `}</style>

      {/* 頂部標題列 */}
      <section className="border-b pb-4 border-[var(--app-border)] border-dashed">
        <div className="inline-flex items-center justify-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold tracking-widest text-[var(--app-accent)] mb-2"
          style={{ borderColor: "var(--app-border)", backgroundColor: "color-mix(in srgb, var(--app-accent) 8%, transparent)" }}>
          ✦ Vector Knowledge Base (RAG)
        </div>
        <h1 className="text-3xl font-black tracking-wide">地方知識庫管理</h1>
        <p className="mt-1 text-sm text-[var(--app-text-muted)]">
          上傳與修正小半天人文史料、作物特徵，後端將自動轉為向量 Embedding 供前台 AI 進行語意關聯探索。
        </p>
      </section>

      {/* 核心操作雙面板區 */}
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">

        {/* 左側：新增知識欄位 */}
        <form
          onSubmit={handleAddKnowledge}
          className="hand-drawn-panel-border border-2 p-5 md:p-6 transition-all duration-500 bg-[var(--app-card)] shadow-md"
          style={{ borderColor: "var(--app-border)", boxShadow: "var(--app-shadow)" }}
        >
          <div className="mb-5 border-b border-dashed pb-3 border-[var(--app-border)]">
            <h2 className="text-lg font-black tracking-wide flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[var(--app-accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
              新增文獻知識
            </h2>
            <p className="mt-1 text-xs text-[var(--app-text-muted)]">
              手動登錄或注入文本段落，系統將即時切片（Chunking）並送入向量資料庫。
            </p>
          </div>

          <div className="space-y-4">
            {/* 來源屬性 */}
            {/* 來源屬性 */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--app-text-muted)] ml-1">文獻或文本來源標籤 (Source)</label>
              <div className="relative">
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className={`${inputBaseClass} appearance-none pr-10 cursor-pointer`}
                  style={inputFocusStyle}
                >
                  {SOURCE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-[var(--app-card)] text-[var(--app-text)]">
                      {opt.label}
                    </option>
                  ))}
                </select>
                {/* 右側自訂下拉小箭頭 */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-[var(--app-text-muted)]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* 知識內容 */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--app-text-muted)] ml-1">知識本體內文</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                placeholder="例如：長源圳生態步道位於南投小半天，建於日治時期（1923年），由在地居民人工開鑿，主要引入北勢溪水源灌溉當地廣闊的孟宗竹林與凍頂茶園..."
                className="w-full rounded-[14px] border px-4 py-3 text-sm outline-none transition-all duration-300 focus:ring-2 bg-[var(--app-surface)] border-[var(--app-border)] text-[var(--app-text)] placeholder:text-[var(--app-muted)] resize-y"
                style={inputFocusStyle}
              />
            </div>

            {/* 狀態回傳提示條 */}
            {submitMessage ? (
              <div
                className="rounded-[12px] border px-4 py-2.5 text-xs flex items-center gap-2 animate-in fade-in duration-300"
                style={
                  submitState === "success"
                    ? {
                      borderColor: "color-mix(in srgb, var(--app-accent) 30%, transparent)",
                      backgroundColor: "color-mix(in srgb, var(--app-accent) 8%, var(--app-surface))",
                      color: "var(--app-accent)",
                    }
                    : submitState === "error"
                      ? {
                        borderColor: "color-mix(in srgb, #e11d48 30%, transparent)",
                        backgroundColor: "color-mix(in srgb, #e11d48 8%, var(--app-surface))",
                        color: "#e11d48",
                      }
                      : {
                        borderColor: "var(--app-border)",
                        backgroundColor: "var(--app-surface)",
                        color: "var(--app-text-muted)",
                      }
                }
              >
                <span className="text-sm">✦</span>
                {submitMessage}
              </div>
            ) : null}

            {/* 按鈕操作列 */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={submitState === "submitting"}
                className="bamboo-leaf-shape px-6 py-2.5 text-sm font-bold transition-all duration-300 text-[var(--app-bg)] bg-[var(--app-accent)] disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-1.5"
                style={{ boxShadow: "0 4px 12px color-mix(in srgb, var(--app-accent) 35%, transparent)" }}
              >
                {submitState === "submitting" ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[var(--app-bg)] border-t-transparent"></span>
                    編碼寫入中
                  </>
                ) : (
                  "新增寫入知識庫 ✦"
                )}
              </button>
            </div>
          </div>
        </form>

        {/* 右側：語意搜尋控制器 */}
        <section
          className="hand-drawn-panel-border border-2 p-5 md:p-6 transition-all duration-500 bg-[var(--app-card)] shadow-md"
          style={{ borderColor: "var(--app-border)", boxShadow: "var(--app-shadow)" }}
        >
          <div className="mb-5 border-b border-dashed pb-3 border-[var(--app-border)]">
            <h2 className="text-lg font-black tracking-wide flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[var(--app-accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              語意交互搜尋測試
            </h2>
            <p className="mt-1 text-xs text-[var(--app-text-muted)]">
              利用自然語言模擬前台使用者的提問，即時觀測後端 Embedding 匹配與關聯強度。
            </p>
          </div>

          <div className="space-y-4">
            {/* 查詢內容 */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--app-text-muted)] ml-1">輸入探索自然語句</label>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="例如：長源圳是誰開鑿的？有什麼歷史？"
                className={inputBaseClass}
                style={inputFocusStyle}
              />
            </div>

            {/* Top K */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--app-text-muted)] ml-1">回傳最相近配對項數 (Top K)</label>
              <input
                type="number"
                min={1}
                max={20}
                value={topK}
                onChange={(e) => setTopK(Math.max(1, Number(e.target.value) || 1))}
                className={inputBaseClass}
                style={inputFocusStyle}
              />
            </div>

            {/* 觸發搜尋按鈕 */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSearch}
                disabled={searchLoading}
                className="w-full rounded-[14px] py-3 text-sm font-bold transition-all duration-300 border border-dashed flex items-center justify-center gap-1.5 disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  borderColor: "var(--app-accent)",
                  background: "color-mix(in srgb, var(--app-accent) 12%, var(--app-card))",
                  color: "var(--app-accent)",
                  boxShadow: "0 4px 12px color-mix(in srgb, var(--app-accent) 15%, transparent)",
                }}
              >
                {searchLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--app-accent)] border-t-transparent"></span>
                    語意特徵計算中...
                  </>
                ) : (
                  "啟動語意關聯檢索 🔍"
                )}
              </button>
            </div>

            {searchError ? (
              <div
                className="rounded-[12px] border px-4 py-2.5 text-xs flex items-center gap-1.5"
                style={{ borderColor: "color-mix(in srgb, #e11d48 30%, transparent)", backgroundColor: "color-mix(in srgb, #e11d48 8%, transparent)", color: "#e11d48" }}
              >
                <span>✕</span> {searchError}
              </div>
            ) : null}
          </div>
        </section>
      </section>

      {/* 下方：智慧 LLM 整合回傳結果結果 */}
      <section
        className="hand-drawn-panel-border border-2 p-5 transition-all duration-500 bg-[var(--app-card)] shadow-md"
        style={{ borderColor: "var(--app-border)", boxShadow: "var(--app-shadow)", borderLeft: "6px solid var(--app-accent-2)" }}
      >
        <div className="mb-4 flex items-center gap-2 px-1">
          <span className="text-sm">🤖</span>
          <div>
            <h2 className="text-lg font-black tracking-wide">LLM 語意摘要整合結果</h2>
            <p className="text-xs text-[var(--app-text-muted)]">
              後端模型串連檢索文本後，提煉生成的上下文應答綜合評估（Context-Aware Response）。
            </p>
          </div>
        </div>

        <div className="rounded-[16px] border p-4 bg-[var(--app-surface)]" style={{ borderColor: "var(--app-border)" }}>
          {searchResult ? (
            <pre className="whitespace-pre-wrap break-words text-sm leading-relaxed text-[var(--app-text)] font-sans">
              {searchResult}
            </pre>
          ) : (
            <p className="text-xs italic text-[var(--app-text-muted)] py-4 text-center">
              等待發送搜尋指令，此處將即時渲染 RAG 知識增強生成的摘要文本。
            </p>
          )}
        </div>
      </section>

      {/* 最底層：原始切片文獻列表 (Raw Documents) */}
      <section
        className="hand-drawn-panel-border border-2 p-5 transition-all duration-500 bg-[var(--app-card)] shadow-md"
        style={{ borderColor: "var(--app-border)", boxShadow: "var(--app-shadow)" }}
      >
        <div className="mb-5 border-b border-dashed pb-3 border-[var(--app-border)]">
          <h2 className="text-lg font-black tracking-wide flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[var(--app-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            文獻切片命中清單 (Raw Chunks)
          </h2>
          <p className="mt-1 text-xs text-[var(--app-text-muted)]">
            從向量資料庫（Milvus/Zilliz）中依據餘弦相似度（Cosine Similarity）排序回傳的原始知識片。
          </p>
        </div>

        {documents.length === 0 ? (
          <div className="rounded-[16px] border border-dashed px-4 py-12 text-center text-sm font-medium italic text-[var(--app-text-muted)] bg-[var(--app-surface)] border-[var(--app-border)]">
            暫無匹配的原始文獻塊紀錄，請嘗試在上方面板發起語意查詢。
          </div>
        ) : (
          <div className="space-y-4">
            {documents.map((doc, index) => (
              <article
                key={`${index}-${getDocumentText(doc).slice(0, 20)}`}
                className="hand-drawn-item-border border-2 p-5 transition-all duration-300 bg-[var(--app-surface)]"
                style={{ borderColor: "var(--app-border)" }}
              >
                {/* 命中文件小書籤 */}
                <div className="mb-3.5 flex flex-wrap items-center gap-2 font-bold text-xs">
                  <span className="rounded px-2.5 py-0.5 border border-dashed border-[var(--app-accent)] bg-[var(--app-card)] text-[var(--app-accent)]">
                    Chunk #{index + 1}
                  </span>

                  {typeof doc.score === "number" ? (
                    <span className="rounded px-2.5 py-0.5 border border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-text-muted)] font-mono">
                      相似度權重 (Score): {doc.score.toFixed(4)}
                    </span>
                  ) : null}
                </div>

                {/* 文本片段內文 */}
                <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-[var(--app-text)] pl-1">
                  {getDocumentText(doc) || <span className="italic opacity-40">此段向量文件不包含明文文字。</span>}
                </p>

                {/* 隱藏的詮釋資料手帳外框 (Metadata) */}
                {doc.metadata ? (
                  <div className="mt-4">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-[var(--app-muted)] block mb-1.5 ml-1">✦ Node Metadata Json</span>
                    <pre className="overflow-x-auto rounded-[12px] border p-3 text-xs font-mono tracking-wide leading-normal bg-[color-mix(in_srgb,var(--app-bg)_60%,var(--app-card))] text-[var(--app-text-muted)] border-[var(--app-border)]">
                      {JSON.stringify(doc.metadata, null, 2)}
                    </pre>
                  </div>
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