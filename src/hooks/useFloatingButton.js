import { useState, useEffect, useRef } from 'react';

export const useFloatingButton = () => {
    const [showFloatingButton, setShowFloatingButton] = useState(false);
    const mainButtonRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (mainButtonRef.current && containerRef.current) {
                const buttonRect = mainButtonRef.current.getBoundingClientRect();
                // Check if button is visible in viewport
                const isButtonVisible = buttonRect.top < window.innerHeight && buttonRect.bottom >= 0;
                setShowFloatingButton(!isButtonVisible);
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            // Initial check
            handleScroll();

            return () => {
                container.removeEventListener('scroll', handleScroll);
            };
        }
    }, []);

    return {
        showFloatingButton,
        mainButtonRef,
        containerRef,
        // Helper style for the container to ensure relative positioning
        containerStyle: {
            height: "100%",
            position: "relative",
            overflow: "hidden"
        },
        // Helper style for the scrollable content
        scrollableStyle: (showPadding) => ({
            height: "100%",
            overflow: "auto",
            padding: "16px",
            paddingBottom: showPadding ? "80px" : "16px"
        })
    };
};
