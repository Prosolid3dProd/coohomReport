import React, { useEffect } from "react";
import { Modal, Form, Input, Button, Row, Col } from "antd";

export const CabinetForm = ({
    open,
    selected,
    onCancel,
    onFinish,
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (selected && open) {
            form.setFieldsValue({
                name: selected.name,
                reference: selected.reference,
                priceCabinet: selected.priceCabinet,
                priceVariants: selected.priceVariants,
                priceDrawers: selected.priceDrawers,
                total: selected.total,
                id: selected.id,
            });
        } else {
            form.resetFields();
        }
    }, [selected, open, form]);

    const handleSubmit = () => {
        form.validateFields().then((values) => {
            onFinish(values);
        });
    };

    return (
        <Modal
            title={selected?.mode === "new" ? "Nuevo Mueble" : "Editar Mueble"}
            open={open}
            onOk={handleSubmit}
            destroyOnClose
            onCancel={onCancel}
            footer={false}
        >
            <Form
                layout="vertical"
                form={form}
                initialValues={{}} // Handled by useEffect
                style={{ maxWidth: 600 }}
            >
                <br />
                <Row gutter={[16, 16]}>
                    <Col span={8}>ID</Col>
                    <Col span={16}>
                        <Form.Item name="id">
                            <Input disabled={selected?.mode !== "new"} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={8}>Nombre</Col>
                    <Col span={16}>
                        <Form.Item name="name">
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={8}>Referencia</Col>
                    <Col span={16}>
                        <Form.Item name="reference">
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={8}>Precio del Mueble</Col>
                    <Col span={16}>
                        <Form.Item name="priceCabinet">
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={[16, 16]}>
                    <Col span={8}>Precio de la variante</Col>
                    <Col span={16}>
                        <Form.Item name="priceVariants">
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={8}>Precio de los Cajones</Col>
                    <Col span={16}>
                        <Form.Item name="priceDrawers">
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={8}>Precio total</Col>
                    <Col span={16}>
                        <Form.Item name="total">
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={16}></Col>
                    <Col span={8}>
                        <Button
                            type="primary"
                            style={{ width: "100%" }}
                            onClick={handleSubmit}
                        >
                            Guardar
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default CabinetForm;
