// src/hooks/usePagination.ts
import { useState, useMemo } from "react";

export function usePagination<T>(data: T[], itemsPerPage: number) {
  const [currentPage, setCurrentPage] = useState(1);
  const [prevData, setPrevData] = useState(data);

  // 官方推薦寫法：在 Render 階段直接比對資料是否改變。
  // 若改變，立刻重置 state，React 會合併渲染，不會造成 useEffect 的二次渲染效能耗損。
  if (data !== prevData) {
    setPrevData(data);
    setCurrentPage(1);
  }

  // 加上 Math.max(1, ...) 確保就算沒有資料，最大頁數至少也是 1 頁，避免產生 0 頁的錯誤
  const maxPage = Math.max(1, Math.ceil(data.length / itemsPerPage));

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  }, [currentPage, itemsPerPage, data]);

  const goToPage = (page: number) => {
    const pageNumber = Math.max(1, Math.min(page, maxPage));
    setCurrentPage(pageNumber);
  };

  const next = () => goToPage(currentPage + 1);
  const prev = () => goToPage(currentPage - 1);

  return {
    currentPage,
    currentData,
    maxPage,
    goToPage,
    next,
    prev,
  };
}