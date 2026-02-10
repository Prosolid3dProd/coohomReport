import React from "react";
import { Card, Row, Col, Form, Input, Space } from "antd";
import { ShoppingOutlined } from "@ant-design/icons";

export const FurnitureSpecs = () => {
  return (
    <Card
      title={
        <Space>
          <ShoppingOutlined />
          <span>Especificaciones del Mueble</span>
        </Space>
      }
      size="small"
    >
      <Row gutter={[12, 8]}>
        <Col xs={24} sm={12} md={8}>
          <Form.Item label="Modelo" name="modelDoor">
            <Input placeholder="Modelo de puerta" maxLength={50} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item label="Acabado" name="materialDoor">
            <Input placeholder="Material/Acabado" maxLength={200} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item label="Tirador" name="modelHandler">
            <Input placeholder="Modelo de tirador" maxLength={200} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Form.Item label="Cajón" name="drawer">
            <Input placeholder="Tipo de cajón" maxLength={200} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Form.Item label="Armazón" name="materialCabinet">
            <Input placeholder="Material armazón" maxLength={200} />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item label="Observaciones" name="observation">
            <Input.TextArea rows={3} placeholder="Notas adicionales sobre el pedido..." />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};

export default FurnitureSpecs;
