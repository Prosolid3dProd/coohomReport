import React from "react";
import { Card, Row, Col, Form, Input, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";

export const StoreInfo = () => {
    return (
        <Card
            title={
                <Space>
                    <UserOutlined />
                    <span>Información de la Tienda</span>
                </Space>
            }
            size="small"
        >
            <Row gutter={[12, 8]}>
                <Col xs={24} md={12}>
                    <Form.Item label="Email" name="email">
                        <Input placeholder="correo@tienda.com" maxLength={100} />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item label="Info 1" name="info1">
                        <Input placeholder="Información adicional 1" />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item label="Info 2" name="info2">
                        <Input placeholder="Información adicional 2" />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item label="Info 3" name="info3">
                        <Input placeholder="Información adicional 3" maxLength={100} />
                    </Form.Item>
                </Col>
            </Row>
        </Card>
    );
};

export default StoreInfo;
