import React, { useState, useEffect } from "react";
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
import { UploadOutlined } from "@ant-design/icons";
import { updateProfile } from "../../handlers/order";
import { getUsers } from "../../handlers/user";

const General = ({ data }) => {
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const users = await getUsers();
        const currentUser = users.find(
          (user) => user.email === data.profile.email
        );
        // console.log(data)
        if (currentUser) {
          const updatedValues = {
            email: currentUser.email,
            phone: currentUser.phone,
            location: currentUser.location,
            logo: currentUser.logo,
            coefficient: currentUser.coefficient,
            iva: currentUser.iva,
            observacion1: currentUser.observacion1,
            observacion2: currentUser.observacion2,
            observacion3: currentUser.observacion3,
            observacion4: currentUser.observacion4,
            observacion5: currentUser.observacion5,
          };
          setInitialValues(updatedValues);
          form.setFieldsValue(updatedValues);
        }
      } catch (error) {
        message.error("Error al cargar los datos del usuario");
      }
    };
    fetchUserData();
  }, [data, form]);

  const onFinish = async (values) => {
    try {
      if (data._id) {
        const result = await updateProfile({ ...values });
        if (result) {
          message.success("Se ha actualizado correctamente");
          setTimeout(() => {
            location.reload();
          }, 1000);
        }
      }
    } catch (error) {
      message.error("Error al actualizar el perfil");
    }
  };

  return (
    <Card className="rounded-none bg-gray border border-border">
      <Form
        layout="vertical"
        form={form}
        initialValues={initialValues}
        onFinish={onFinish}
      >
        <Row gutter={16}>
          <Col xs={24}>
            <Divider orientation="left">
              <p className="uppercase">
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
            <Form.Item label="Télefono" name="phone">
              <Input placeholder="" />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item label="Localizacion" name="location">
              <Input placeholder="" maxLength="100" />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Divider orientation="left">
              <p className="uppercase">
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
                disabled={data.profile?.role === "client"}
              />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Divider orientation="left">
              <b className="uppercase">Observaciones</b>{" "}
              <span className="italic text-slate-400">(%)</span>
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
                className="flex justify-center items-center"
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

export default General;
