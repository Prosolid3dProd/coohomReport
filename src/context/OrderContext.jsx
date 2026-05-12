import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getOrderById } from "../entities/order/api";
import { useUser } from "./UserContext";

const OrderContext = createContext(null);

export const OrderProvider = ({ children }) => {
  const { user } = useUser();
  const [order, setOrder] = useState(null);
  const [orderId, setOrderId] = useState(() => localStorage.getItem("orderId"));
  const [isLoading, setIsLoading] = useState(false);

  const _fetch = useCallback(async (id) => {
    setIsLoading(true);
    try {
      const raw = await getOrderById({ _id: id });
      setOrder(raw);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setActiveOrder = useCallback(async (id) => {
    localStorage.setItem("orderId", id);
    setOrderId(id);
    await _fetch(id);
  }, [_fetch]);

  const refreshOrder = useCallback(async () => {
    const id = orderId ?? order?._id;
    if (!id) return;
    await _fetch(id);
  }, [orderId, order?._id, _fetch]);

  const clearOrder = useCallback(() => {
    localStorage.removeItem("orderId");
    setOrderId(null);
    setOrder(null);
  }, []);

  useEffect(() => {
    if (orderId && user) _fetch(orderId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <OrderContext.Provider value={{ order, setActiveOrder, refreshOrder, clearOrder, isLoading }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);
