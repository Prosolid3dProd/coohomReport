import React from "react";
import { Card, Row, Col, Form, Input, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";

export const ClientInfo = () => {
  return (
    <Card
      title={
        <Space>
          <UserOutlined />
          <span>Información del Cliente</span>
        </Space>
      }
      size="small"
    >
      <Row gutter={[12, 8]}>
        <Col xs={24} sm={12} md={6}>
          <Form.Item label="Fecha Confirmación" name="fecha">
            <Input type="date" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Form.Item label="Envío Mercancía" name="fechaEntrega">
            <Input type="date" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Form.Item label="Semana de Entrega" name="semanaEntrega">
            <Input placeholder="Ej: Semana 10" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Form.Item label="Teléfono" name="phone">
            <Input placeholder="+34 600 000 000" maxLength={15} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={12}>
          <Form.Item label="Nombre Cliente" name="customerName">
            <Input placeholder="Nombre completo" maxLength={100} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={12}>
          <Form.Item label="Localización" name="location">
            <Input placeholder="Ciudad, Provincia" maxLength={100} />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};

export default ClientInfo;
