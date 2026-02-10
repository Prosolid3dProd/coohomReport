import React, { createContext, useState, useEffect, useContext } from 'react';
import { getLocalOrder, setLocalOrder as setLocalOrderHandler } from '../handlers/order';

const OrderContext = createContext();

export const useOrder = () => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error('useOrder must be used within an OrderProvider');
    }
    return context;
};

import { getPrecio, getTotales, setPrecio, setTotales } from '../data/localStorage';

export const OrderProvider = ({ children }) => {
    const [order, setOrderState] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initial preferences state loaded from localStorage
    const [preferences, setPreferences] = useState({
        showPrices: {
            C: getPrecio("C") ?? true,
            F: getPrecio("F") ?? true,
            P: getPrecio("P") ?? true,
        },
        showTotals: {
            Encimeras: getTotales("Encimeras") ?? true,
            Equipamiento: getTotales("Equipamiento") ?? true,
            Electrodomesticos: getTotales("Electrodomesticos") ?? true,
        }
    });

    const updatePreference = (type, key, value) => {
        setPreferences(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                [key]: value
            }
        }));

        // Side effect: sync to localStorage
        if (type === 'showPrices') {
            setPrecio(key, value);
        } else if (type === 'showTotals') {
            setTotales(key, value);
        }
    };

    // Load order from localStorage on mount
    useEffect(() => {
        const loadOrder = () => {
            try {
                const localOrder = getLocalOrder();
                if (localOrder) {
                    setOrderState(localOrder);
                }
            } catch (error) {
                console.error("Failed to load order from localStorage:", error);
            } finally {
                setLoading(false);
            }
        };
        loadOrder();
    }, []);

    // Wrapper to update state and localStorage
    const setOrder = async (newOrder) => {
        try {
            setOrderState(newOrder); // Optimistic update
            await setLocalOrderHandler(newOrder);
        } catch (error) {
            console.error("Failed to save order to localStorage:", error);
            // Revert state if needed? For now, we trust basic localStorage won't fail often.
        }
    };

    const value = {
        order,
        setOrder,
        loading,
        preferences,
        updatePreference
    };

    return (
        <OrderContext.Provider value={value}>
            {children}
        </OrderContext.Provider>
    );
};
