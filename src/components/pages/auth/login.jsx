import React from "react";
import { useNavigate } from "react-router";

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, message } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

import { login } from "../../../handlers/user";
import { useUser } from "../../../context";

const Login = () => {
  const navigate = useNavigate();
  const { login: loginUser } = useUser();

  const mensajeBienvenida = (name) => {
    message.success(`Bienvenido ${name}!`);
  };

  const onFinish = async (values) => {
    const result = await login({
      email: values.email,
      password: values.password,
    });

    if (!result.ok) return onFailed(null, result.message);

    mensajeBienvenida(result?.user?.name || "Compañero");
    loginUser(result);

    navigate("/Dashboard/Presupuestos");
  };

  const onFailed = (values, mensaje = "Credenciales incorrectas") => {
    console.error("Error", values);
    message.error(`Error: ${mensaje}`);
  };

  const validateMessages = {
    min: "La contraseña debe tener al menos 8 caracteres",
  };

  return (
    <div
      id="pantalla"
      style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}
    >
      <div
        id="panel"
        style={{
          background: "white",
          borderRadius: 12,
          width: 610,
          height: 439,
          display: "grid",
          gridTemplateColumns: "200px 1fr",
        }}
      >
        <div
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "var(--color-primary)",
            borderRadius: "12px 0 0 12px",
            fontWeight: 500,
            fontSize: 70,
            color: "white",
          }}
        >
          C
        </div>
        <div
          id="info"
          style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-around" }}
        >
          <h1 style={{ fontWeight: 600, fontSize: 24 }}>Iniciar sesión</h1>
          <Form
            name="normal_login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFailed}
            validateMessages={validateMessages}
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: "El email no es válido" }]}
            >
              <Input
                style={{ height: 40, width: 320 }}
                prefix={<UserOutlined />}
                placeholder="Email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { message: "Al menos 1 Mayúscula y un signo especial" },
                { message: "Debe tener al menos 8 carácteres!" },
                { required: true, message: "Introduce la contraseña!" },
              ]}
            >
              <Input.Password
                style={{ height: 40, width: 320 }}
                prefix={<LockOutlined />}
                placeholder="Contraseña"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>
            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Recuerdame</Checkbox>
              </Form.Item>
            </Form.Item>
            <Form.Item style={{ textAlign: "center" }}>
              <Button style={{ width: 160, height: 40 }} type="primary" htmlType="submit">
                Acceder
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
