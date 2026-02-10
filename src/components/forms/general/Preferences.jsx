import React from "react";
import { Card, Row, Col, Space, Checkbox, Typography } from "antd";
import { EyeOutlined } from "@ant-design/icons";

const { Text } = Typography;

export const Preferences = ({ preferences, handlePrecioChange, handleTotalesChange }) => {
  return (
    <Card
      title={
        <Space>
          <EyeOutlined />
          <span>Preferencias de Visualización</span>
        </Space>
      }
      size="small"
    >
      <Row gutter={[24, 16]}>
        <Col xs={24} md={12}>
          <Text strong style={{ display: 'block', marginBottom: 12 }}>Mostrar Precios</Text>
          <Space direction="vertical">
            <Checkbox
              checked={preferences.showPrices.C}
              onChange={() => handlePrecioChange('C')}
            >
              Clientes
            </Checkbox>
            <Checkbox
              checked={preferences.showPrices.F}
              onChange={() => handlePrecioChange('F')}
            >
              Fábrica
            </Checkbox>
            <Checkbox
              checked={preferences.showPrices.P}
              onChange={() => handlePrecioChange('P')}
            >
              Confirmación Pedido
            </Checkbox>
          </Space>
        </Col>
        <Col xs={24} md={12}>
          <Text strong style={{ display: 'block', marginBottom: 12 }}>Mostrar Totales</Text>
          <Space direction="vertical">
            <Checkbox
              checked={preferences.showTotals.Encimeras}
              onChange={() => handleTotalesChange('Encimeras')}
            >
              Encimeras
            </Checkbox>
            <Checkbox
              checked={preferences.showTotals.Equipamiento}
              onChange={() => handleTotalesChange('Equipamiento')}
            >
              Equipamiento
            </Checkbox>
            <Checkbox
              checked={preferences.showTotals.Electrodomesticos}
              onChange={() => handleTotalesChange('Electrodomesticos')}
            >
              Electrodomésticos
            </Checkbox>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default Preferences;
