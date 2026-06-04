// src/hooks/usePagination.ts
import { useState, useMemo, useEffect } from "react";

export function usePagination<T>(data: T[], itemsPerPage: number) {
  const [currentPage, setCurrentPage] = useState(1);

  // 當資料來源 (例如篩選分類) 改變時，自動回到第一頁
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  const maxPage = Math.ceil(data.length / itemsPerPage);

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