import React from 'react';
import { Button } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

export const FloatingSaveButton = ({
    visible,
    onClick,
    loading,
    icon = <SaveOutlined />,
    text = "Guardar Cambios",
    dashed = true
}) => {
    if (!visible) return null;

    return (
        <>
            <div
                style={{
                    position: 'absolute',
                    bottom: 24,
                    left: 0,
                    width: '100%',
                    padding: '0 16px',
                    display: 'flex',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                    animation: 'fadeIn 0.3s ease-in-out',
                    zIndex: 1000,
                }}
            >
                <Button
                    type={dashed ? "dashed" : "primary"}
                    icon={icon}
                    size="large"
                    loading={loading}
                    onClick={onClick}
                    style={{
                        width: '90%',
                        maxWidth: 800,
                        height: 50,
                        fontSize: 16,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderWidth: dashed ? 2 : 1,
                        pointerEvents: 'auto',
                    }}
                >
                    {text}
                </Button>
            </div>
            <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </>
    );
};

FloatingSaveButton.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    icon: PropTypes.node,
    text: PropTypes.string,
    dashed: PropTypes.bool,
};

export default FloatingSaveButton;
