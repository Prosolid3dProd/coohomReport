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
  Checkbox,
} from "antd";

import {
  updateOrder,
  setLocalOrder,
  updateProfile,
} from "../../handlers/order";
import { existePrecio, getPrecio, setPrecio } from "../../data/localStorage";

const General = ({ data }) => {
  const [form] = Form.useForm();
  const [initialValues] = useState({
    email: data?.profile?.email,
    phone: data?.profile?.phone,
    location: data?.profile?.location,
    logo: data?.profile?.logo,
    coefficient: data?.profile?.coefficient,
    iva: data?.profile?.iva,
    observacion1: data?.profile?.observacion1,
    observacion2: data?.profile?.observacion2,
    observacion3: data?.profile?.observacion3,
    observacion4: data?.profile?.observacion4,
    observacion5: data?.profile?.observacion5,
  });

  const onFinish = async (values) => {
    if (data._id) {
      const result = await updateProfile({
        ...values,
      });

      if (result) {
        message.success("Se ha actualizado correctamente");
        setTimeout(() => {
          location.reload();
        }, 1000);
      }
    }
  };

  return (
    <Card className="rounded-nonel bg-gray rounded-none border border-border">
      <Form
        layout="vertical"
        form={form}
        initialValues={initialValues}
        onFinish={onFinish}
      >
        <Row gutter={16}>
          <Col xs={24} sm={24} md={24}>
            <Divider orientation="left">
              <p className="uppercase">
                <b>Mi perfil de tienda</b>
              </p>
            </Divider>
          </Col>

          <Col xs={24} sm={24} md={8}>
            <Form.Item label="Email" name="email">
              <Input placeholder="" maxLength="100" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={8}>
            <Form.Item label="Télefono" name="phone">
              <Input placeholder="" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={8}>
            <Form.Item label="Locacion" name="location">
              <Input placeholder="" maxLength="100" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={12}>
            <Form.Item label="Url del Logo" name="logo">
              <Input placeholder="" />
            </Form.Item>
          </Col>

          <Divider orientation="left">
            <p className="uppercase">
              {" "}
              <b>Acerca de los Precios</b>
            </p>
          </Divider>
          <Col xs={24} sm={24} md={4}>
            <Form.Item label="Coeficiente Tiendas" name="coefficient">
              <Input placeholder="" maxLength="5" max={10} min={0} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={2}>
            <Form.Item label="IVA" name="iva">
              <Input placeholder="" maxLength="5" />
            </Form.Item>
          </Col>
          <Divider orientation="left" className="px-10">
            <b className="uppercase">Observaciones</b>{" "}
            <span className="italic text-slate-400">(%)</span>
          </Divider>
          <Row className="w-full px-10 gap-4">
            <Col xs={24} sm={24} md={24}>
              <Form.Item label="Observación Linea 1" name="observacion1">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24}>
              <Form.Item label="Observación Linea 2" name="observacion2">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24}>
              <Form.Item label="Observación Linea 3" name="observacion3">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24}>
              <Form.Item label="Observación Linea 4" name="observacion4">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24}>
              <Form.Item label="Observación Linea 5" name="observacion5">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Col xs={24} sm={24} md={24}>
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
