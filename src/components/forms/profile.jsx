import { useState, useEffect, useCallback } from "react";
import {
  Button,
  Input,
  Form,
  Card,
  Row,
  Col,
  message,
  Divider,
  Space,
} from "antd";
import { updateProfile } from "../../handlers/order";
import { getUsers } from "../../handlers/user";
import { useUser } from "../../context/UserContext";

const Profile = ({ data }) => {
  const { user } = useUser();
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState({});

  const fetchUserData = useCallback(async () => {
    try {
      const users = await getUsers();
      const currentUser = users?.find(
        (user) => user.email === data?.profile?.email
      );
      if (currentUser) {
        const values = {
          email: currentUser.email,
          info1: currentUser.info1,
          info2: currentUser.info2,
          info3: currentUser.info3,
          logo: currentUser.logo,
          coefficient: currentUser.coefficient,
          observacion1: currentUser.observacion1,
          observacion2: currentUser.observacion2,
          observacion3: currentUser.observacion3,
          observacion4: currentUser.observacion4,
          observacion5: currentUser.observacion5,
        };
        setInitialValues(values);
        form.setFieldsValue(values);
      }
    } catch {
      message.error("Error al cargar los datos del usuario");
    }
  }, [data?.profile?.email, form]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const onFinish = async (values) => {
    try {
      if (data?._id) {
        const result = await updateProfile({ ...values });
        if (result) {
          message.success("Se ha actualizado correctamente");
          await fetchUserData();
        }
      }
    } catch {
      message.error("Error al actualizar el perfil");
    }
  };

  return (
    <Card style={{ borderRadius: 0, background: "var(--color-bg-layout)", border: "1px solid var(--color-border)" }}>
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
                disabled={user?.role === "client"}
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
    </Card>
  );
};

export default Profile;
