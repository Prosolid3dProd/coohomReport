import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
    Modal,
    Form,
    Input,
    Select,
    Button,
    Row,
    Col,
    Space,
    Card,
    message,
    Tag
} from "antd";
import { FileAddOutlined, UserAddOutlined } from "@ant-design/icons";
import * as filestack from "filestack-js";

const { Option } = Select;
// Consider moving API key to constants/env
const FILESTACK_API_KEY = "AXPWPBPSTvSKYoyHwByaaz";

const LOGO_CONTAINER_STYLE = {
    width: '120px',
    height: '120px',
    margin: '0 auto',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fafafa',
    border: '1px solid #d9d9d9',
    overflow: 'hidden'
};

const UserForm = ({ open, onCancel, onFinish, initialValues, title = "Usuario" }) => {
    const [form] = Form.useForm();
    const [logoUrl, setLogoUrl] = useState("");

    const isEditMode = !!initialValues && Object.keys(initialValues).length > 0;

    useEffect(() => {
        if (open) {
            if (initialValues) {
                form.setFieldsValue(initialValues);
                setLogoUrl(initialValues.logo || "");
            } else {
                form.resetFields();
                setLogoUrl("");
            }
        }
    }, [open, initialValues, form]);

    const handleUpload = useCallback(() => {
        const client = filestack.init(FILESTACK_API_KEY);
        const options = {
            onUploadDone: (file) => setLogoUrl(file.filesUploaded[0].url),
            onFileUploadFailed: (error) => {
                console.error("Error en la carga del archivo:", error);
                message.error("Error al cargar el logo");
            },
        };
        client.picker(options).open();
    }, []);

    const handleSubmit = useCallback(async () => {
        try {
            const values = await form.validateFields();
            if (!values.password && isEditMode) {
                delete values.password;
            }
            onFinish({ ...values, logo: logoUrl });
        } catch (error) {
            console.error("Validate Failed:", error);
        }
    }, [form, onFinish, logoUrl, isEditMode]);

    const logoPreview = useMemo(() => (
        logoUrl ? (
            <div style={LOGO_CONTAINER_STYLE}>
                <img src={logoUrl} alt="Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </div>
        ) : (
            <div style={{ ...LOGO_CONTAINER_STYLE, borderStyle: 'dashed' }}>
                <FileAddOutlined style={{ fontSize: '32px', color: '#d9d9d9' }} />
            </div>
        )
    ), [logoUrl]);

    return (
        <Modal
            title={isEditMode ? `Editar ${title}` : `Crear Nuevo ${title}`}
            open={open}
            onCancel={onCancel}
            width={800}
            footer={[
                <Button key="back" onClick={onCancel}>
                    Cancelar
                </Button>,
                <Button key="submit" type="primary" onClick={handleSubmit} icon={<UserAddOutlined />}>
                    {isEditMode ? "Guardar Cambios" : `Crear ${title}`}
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical" autoComplete="off">
                <Row gutter={24}>
                    <Col span={8}>
                        <Card size="small" title="Logo" styles={{ body: { textAlign: 'center' } }}>
                            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                {logoPreview}
                                <Button icon={<FileAddOutlined />} onClick={handleUpload} block>
                                    {logoUrl ? 'Cambiar Logo' : 'Subir Logo'}
                                </Button>
                            </Space>
                        </Card>
                    </Col>
                    <Col span={16}>
                        <Row gutter={12}>
                            <Col span={12}>
                                <Form.Item name="name" label="Nombre/Propietario" rules={[{ required: true, message: 'Requerido' }]}>
                                    <Input placeholder="Nombre" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: 'Email válido requerido' }]}>
                                    <Input placeholder="email@ejemplo.com" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="nif" label="NIF">
                                    <Input placeholder="NIF/CIF" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="password" label="Contraseña" rules={[{ required: !isEditMode, message: 'Requerido' }]}>
                                    <Input.Password placeholder={isEditMode ? "Dejar en blanco para mantener" : "Contraseña"} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="role" label="Rol" rules={[{ required: true }]}>
                                    <Select placeholder="Seleccionar Rol">
                                        <Option value="admin"><Tag color="red">Admin</Tag></Option>
                                        <Option value="client"><Tag color="blue">Cliente</Tag></Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="coefficient" label="Coeficiente" rules={[{ required: true }]}>
                                    <Input placeholder="Ej: 1.5" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="coefficientVenta" label="Coef. Venta">
                                    <Input placeholder="Ej: 1.3" />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item name="info1" label="Notas / Info Adicional">
                                    <Input.TextArea rows={2} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default UserForm;
