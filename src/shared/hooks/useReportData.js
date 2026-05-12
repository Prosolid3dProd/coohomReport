import { useState, useEffect } from "react";
import { getReportData } from "../../entities/order/api";

export const useReportData = (orderId, tab, ivaIncluido) => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!orderId || tab > 3) return;
    let cancelled = false;
    setLoading(true);
    getReportData({ _id: orderId, tab, ivaIncluido }).then((res) => {
      if (cancelled) return;
      if (res?.ok) setReportData(res);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [orderId, tab, ivaIncluido]);

  return { reportData, loading };
};
