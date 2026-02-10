import React, { useMemo } from "react";
import { Form, Row, Col, Input, InputNumber, Button } from "antd";
import { SaveOutlined } from "@ant-design/icons";

export const EditProductForm = ({
    form,
    onFinish,
    onCancel,
    loading
}) => {
    return (
        <Form layout="vertical" form={form} onFinish={onFinish}>
            <Form.Item label="Código" name="referencia">
                <Input disabled />
            </Form.Item>
            <Form.Item label="Descripción" name="descripcion">
                <Input />
            </Form.Item>
            <Row gutter={12}>
                <Col span={12}>
                    <Form.Item label="Marca" name="marca">
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Tipo" name="type">
                        <Input disabled />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={12}>
                <Col span={8}>
                    <Form.Item label="Grosor" name="grosor">
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="Cantidad" name="qty">
                        <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="Descuento (%)" name="discount">
                        <InputNumber min={0} max={100} style={{ width: "100%" }} />
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item label="Precio Unidad (€)" name="unidad">
                <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
            </Form.Item>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
                <Button onClick={onCancel}>Cancelar</Button>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
                    Guardar Cambios
                </Button>
            </div>
        </Form>
    );
};

export default EditProductForm;
