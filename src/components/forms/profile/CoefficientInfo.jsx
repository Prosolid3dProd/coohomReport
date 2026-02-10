import React from "react";
import { Card, Form, Input, Space, Typography } from "antd";
import { PercentageOutlined, InfoCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

export const CoefficientInfo = ({ role }) => {
    return (
        <Card
            title={
                <Space>
                    <PercentageOutlined />
                    <span>Punto de Compra</span>
                </Space>
            }
            size="small"
        >
            <Form.Item
                label="Coeficiente"
                name="coefficient"
                tooltip="Coeficiente aplicado en los precios"
            >
                <Input
                    placeholder="Ej: 1.2"
                    maxLength={5}
                    disabled={role === "client"}
                    style={role === "client" ? { backgroundColor: '#f5f5f5' } : {}}
                />
            </Form.Item>
            {role === "client" && (
                <Text type="secondary" style={{ fontSize: 12 }}>
                    <InfoCircleOutlined /> Los clientes no pueden modificar el coeficiente
                </Text>
            )}
        </Card>
    );
};

export default CoefficientInfo;
