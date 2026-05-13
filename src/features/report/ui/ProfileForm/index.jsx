import { Form, Card, Row, Col, Divider, Input, Space, Button, Spin } from "antd";
import { useEffect } from "react";

const ProfileForm = ({
  initialValues,
  onFinish,
  loading,
  role,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  return (
    <Card style={{ borderRadius: 0, background: "var(--color-bg-layout)", border: "1px solid var(--color-border)" }}>
      <Spin spinning={loading}>
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
        >
          <Row gutter={16}>
            <Col xs={24}>
              <Divider orientation="left">
                <p style={{ textTransform: "uppercase" }}>
                  <b>Mi perfil de tienda</b>
                </p>
              </Divider>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item label="Email" name="email">
                <Input placeholder="" maxLength="100" />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item label="Info1" name="info1">
                <Input placeholder="" />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item label="Info2" name="info2">
                <Input placeholder="" />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item label="Info3" name="info3">
                <Input placeholder="" maxLength="100" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Divider orientation="left">
                <p style={{ textTransform: "uppercase" }}>
                  <b>Acerca de los Precios</b>
                </p>
              </Divider>
            </Col>

            <Col xs={24} md={4}>
              <Form.Item label="Punto de Compra" name="coefficient">
                <Input
                  placeholder=""
                  maxLength="5"
                  max={10}
                  min={0}
                  disabled={role === "client"}
                />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Divider orientation="left">
                <b style={{ textTransform: "uppercase" }}>Observaciones</b>
                <span style={{ fontStyle: "italic", color: "#94a3b8" }}>(%)</span>
              </Divider>
            </Col>

            {[...Array(5)].map((_, index) => (
              <Col key={index} xs={24}>
                <Form.Item
                  label={`Observación Linea ${index + 1}`}
                  name={`observacion${index + 1}`}
                >
                  <Input />
                </Form.Item>
              </Col>
            ))}

            <Col xs={24}>
              <Space>
                <Button
                  htmlType="submit"
                  type="primary"
                  style={{
                    height: 50,
                    width: 150,
                    marginTop: 30,
                    padding: "5px 20px",
                    background: "#1a7af8",
                    color: "#fff",
                  }}
                >
                  Guardar Cambios
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Card>
  );
};

export default ProfileForm;
