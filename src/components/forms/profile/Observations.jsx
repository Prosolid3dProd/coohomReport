import React from "react";
import { Card, Row, Col, Form, Input, Space } from "antd";
import { FileTextOutlined } from "@ant-design/icons";

export const Observations = () => {
    return (
        <Card
            title={
                <Space>
                    <FileTextOutlined />
                    <span>Observaciones</span>
                </Space>
            }
            size="small"
        >
            <Row gutter={[12, 8]}>
                {[1, 2, 3, 4, 5].map((num) => (
                    <Col xs={24} key={num}>
                        <Form.Item
                            label={`Observación Línea ${num}`}
                            name={`observacion${num}`}
                        >
                            <Input placeholder={`Observación ${num}...`} />
                        </Form.Item>
                    </Col>
                ))}
            </Row>
        </Card>
    );
};

export default Observations;
