import { useState, useEffect } from "react";

export const useTablePageSize = (rowHeight = 55, offset = 300) => {
  const calculate = () => Math.max(5, Math.floor((window.innerHeight - offset) / rowHeight));
  const [pageSize, setPageSize] = useState(calculate);
  useEffect(() => {
    const handler = () => setPageSize(calculate());
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [rowHeight, offset]);
  return pageSize;
};
