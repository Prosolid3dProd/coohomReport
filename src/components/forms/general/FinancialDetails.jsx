import React from "react";
import { Card, Row, Col, Form, Input, Space } from "antd";
import { PercentageOutlined } from "@ant-design/icons";

export const FinancialDetails = () => {
  return (
    <Row gutter={[12, 12]}>
      <Col xs={24} lg={12}>
        <Card
          title={
            <Space>
              <PercentageOutlined />
              <span>Descuentos</span>
            </Space>
          }
          size="small"
        >
          <Row gutter={[12, 8]}>
            <Col span={12}>
              <Form.Item label="Encimeras" name="discountEncimeras">
                <Input placeholder="%" maxLength={50} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Muebles" name="discountCabinets">
                <Input placeholder="%" maxLength={50} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Electrodomésticos" name="discountElectrodomesticos">
                <Input placeholder="%" maxLength={50} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Equipamientos" name="discountEquipamientos">
                <Input placeholder="%" maxLength={50} />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Col>

      <Col xs={24} lg={12}>
        <Card
          title={
            <Space>
              <PercentageOutlined />
              <span>IVA</span>
            </Space>
          }
          size="small"
        >
          <Row gutter={[12, 8]}>
            <Col span={12}>
              <Form.Item label="Encimeras" name="ivaEncimeras">
                <Input placeholder="%" maxLength={50} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Muebles" name="ivaCabinets">
                <Input placeholder="%" maxLength={50} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Electrodomésticos" name="ivaElectrodomesticos">
                <Input placeholder="%" maxLength={50} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Equipamientos" name="ivaEquipamientos">
                <Input placeholder="%" maxLength={50} />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default FinancialDetails;
