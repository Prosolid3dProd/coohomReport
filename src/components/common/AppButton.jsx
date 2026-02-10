import React from 'react';
import { Button } from 'antd';

/**
 * Reusable Button component that wraps Ant Design Button.
 * Standardizes the primary button style across the application.
 * 
 * @param {string} text - The button text
 * @param {string} type - Ant Design button type (primary, default, dashed, etc.)
 * @param {Function} onClick - Click handler
 * @param {Object} style - Custom styles (optional)
 * @param {React.ReactNode} icon - Icon component (optional)
 * @param {boolean} danger - Danger state (optional)
 * @param {boolean} block - Block state (optional)
 * @param {boolean} loading - Loading state (optional)
 * @param {string} htmlType - HTML button type (submit, button, reset)
 */
const AppButton = ({
    text,
    type = "primary",
    onClick,
    style,
    icon,
    danger,
    block,
    loading,
    htmlType = "button",
    ...props
}) => {
    return (
        <Button
            type={type}
            onClick={onClick}
            style={{
                borderRadius: '6px',
                fontWeight: 500,
                // height: '36px', // Standard height
                ...style
            }}
            icon={icon}
            danger={danger}
            block={block}
            loading={loading}
            htmlType={htmlType}
            {...props}
        >
            {text}
        </Button>
    );
};

export default AppButton;
