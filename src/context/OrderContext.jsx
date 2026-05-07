import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getOrderById, fixOrder } from "../handlers/order";
import { useUser } from "./UserContext";

const OrderContext = createContext(null);

export const OrderProvider = ({ children }) => {
  const { user } = useUser();
  const [order, setOrder] = useState(null);
  const [orderId, setOrderId] = useState(() => localStorage.getItem("orderId"));
  const [isLoading, setIsLoading] = useState(false);

  const _fetch = useCallback(async (id, role) => {
    setIsLoading(true);
    try {
      const raw = await getOrderById({ _id: id });
      setOrder(fixOrder(raw, 0, role ?? "client"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setActiveOrder = useCallback(async (id) => {
    localStorage.setItem("orderId", id);
    setOrderId(id);
    await _fetch(id, user?.role);
  }, [_fetch, user?.role]);

  const refreshOrder = useCallback(async () => {
    const id = orderId ?? order?._id;
    if (!id) return;
    await _fetch(id, user?.role);
  }, [orderId, order?._id, _fetch, user?.role]);

  const clearOrder = useCallback(() => {
    localStorage.removeItem("orderId");
    setOrderId(null);
    setOrder(null);
  }, []);

  useEffect(() => {
    if (orderId && user) _fetch(orderId, user?.role);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <OrderContext.Provider value={{ order, setActiveOrder, refreshOrder, clearOrder, isLoading }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);
