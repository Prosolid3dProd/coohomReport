import React, { useMemo, useRef } from "react";
import { Form, Row, Col, Input, InputNumber, Button, Select, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";

export const AddProductForm = ({
    form,
    onFinish,
    loading,
    setType,
    type,
    mainButtonRef
}) => {
    // Watch form values for real-time calculation
    const qty = Form.useWatch('qty', form) || 1;
    const unidad = Form.useWatch('unidad', form) || 0;
    const discount = Form.useWatch('discount', form) || 0;

    // Calculate total in real-time
    const calculatedTotal = useMemo(() => {
        const cantidad = parseFloat(qty) || 0;
        const precioUnidad = parseFloat(unidad) || 0;
        const descuento = parseFloat(discount) || 0;
        const unidadConDescuento = precioUnidad - (descuento / 100) * precioUnidad;
        return (cantidad * unidadConDescuento).toFixed(2);
    }, [qty, unidad, discount]);

    return (
        <Form layout="vertical" form={form} onFinish={onFinish}>
            <Row gutter={[12, 8]}>
                <Col xs={24} sm={12} md={6}>
                    <Form.Item
                        label="Tipo"
                        name="type"
                        rules={[{ required: true, message: "Requerido" }]}
                    >
                        <Select placeholder="Seleccione tipo" onChange={setType}>
                            <Select.Option value="Encimera">Encimera</Select.Option>
                            <Select.Option value="Equipamiento">Equipamiento</Select.Option>
                            <Select.Option value="Electrodomestico">Electrodomésticos</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Form.Item
                        label="Referencia"
                        name="referencia"
                        rules={[{ required: true, message: "Requerido" }]}
                    >
                        <Input placeholder="Código" maxLength={60} />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item
                        label="Descripción"
                        name="descripcion"
                        rules={[{ required: true, message: "Requerido" }]}
                    >
                        <Input placeholder="Descripción del componente" />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Form.Item label="Marca" name="marca">
                        <Input placeholder="Marca" maxLength={60} />
                    </Form.Item>
                </Col>
                {type === "Encimera" && (
                    <Col xs={24} sm={12} md={6}>
                        <Form.Item label="Grosor" name="grosor">
                            <Input placeholder="Ej: 20mm" maxLength={60} />
                        </Form.Item>
                    </Col>
                )}
                <Col xs={12} sm={6} md={4}>
                    <Form.Item label="Cantidad" name="qty" initialValue={1}>
                        <InputNumber min={0} step={1} style={{ width: "100%" }} />
                    </Form.Item>
                </Col>
                <Col xs={12} sm={6} md={4}>
                    <Form.Item label="Precio Unit." name="unidad" initialValue={0}>
                        <Space.Compact style={{ width: '100%' }}>
                            <InputNumber
                                min={0}
                                step={0.01}
                                style={{ width: "calc(100% - 40px)" }}
                            />
                            <Input style={{ width: "40px", textAlign: "center", color: "rgba(0, 0, 0, 0.45)", backgroundColor: "#fafafa", pointerEvents: "none" }} placeholder="€" disabled />
                        </Space.Compact>
                    </Form.Item>
                </Col>
                <Col xs={12} sm={6} md={4}>
                    <Form.Item label="Descuento" name="discount" initialValue={0}>
                        <Space.Compact style={{ width: '100%' }}>
                            <InputNumber min={0} max={100} style={{ width: "calc(100% - 40px)" }} />
                            <Input style={{ width: "40px", textAlign: "center", color: "rgba(0, 0, 0, 0.45)", backgroundColor: "#fafafa", pointerEvents: "none" }} placeholder="%" disabled />
                        </Space.Compact>
                    </Form.Item>
                </Col>
                <Col xs={12} sm={6} md={4}>
                    <Form.Item label="Total">
                        <Input
                            value={`${calculatedTotal}€`}
                            disabled
                            style={{ fontWeight: "bold", color: "#1677ff" }}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <div ref={mainButtonRef} style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
                <Button
                    type="primary"
                    htmlType="submit"
                    icon={<PlusOutlined />}
                    loading={loading}
                    style={{ width: '90%', maxWidth: 800, height: 50, fontSize: 16 }}
                >
                    Agregar Componente
                </Button>
            </div>
        </Form>
    );
};

export default AddProductForm;
