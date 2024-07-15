import React, { useEffect } from "react";
import { useNavigate } from "react-router";

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, message } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

import { login } from "../../../handlers/user";
import { getLocalToken, setLocalToken } from "../../../data/localStorage";

const Login = () => {
  window.onload = () => {
    // setLocalToken({})
    if (getLocalToken) setLocalToken({});
  };

  const mensajeBienvenida = (email) => {
    message.success(`Bienvenido ${email}!`);
  };

  useEffect(() => {
    localStorage.setItem("campaign", null);
    localStorage.removeItem("campaign");
  }, []);

  /**
   *
   *
   * @param {object} values
   * @return {Component} --> mensaje error | fin de programa
   */
  const onFinish = async (values) => {
    
    const result = await login({
      email: values.email,
      password: values.password,
    });
    console.log(result)
    const { ok, message } = result;

    if (!ok) return onFailed(message);

    mensajeBienvenida(result?.user?.name || "Compañero");
    localStorage.setItem("token", JSON.stringify(result));
    localStorage.removeItem("init");

    // window.location.reload();

    window.location.href = "/Dashboard/Presupuestos";
  };

  /**
   *
   *
   * @param {object} values --> objeto BD con las credenciales
   * @param {string} mensaje --> Mensaje Error
   */
  const onFailed = (values, mensaje = "Credenciales incorrectas") => {
    console.error("Error", values);
    message.error(`Error : ${mensaje}`);
  };

  const validateMessages = {
    min: "La contraseña debe tener al menos 8 caracteres",
  };

  return (
    <div
      id="pantalla"
      className="col-span-2 row-span-2 flex items-center justify-center"
    >
      <div
        id="panel"
        className="bg-white rounded-xl w-[610px] h-[439px] grid grid-cols-[200px_1fr]"
      >
        <h1 className="h-full flex justify-center self-center bg-bckLogin rounded-l-xl font-medium text-[70px] items-center">
          C
        </h1>
        <div id="info" className="flex flex-col items-center justify-around">
          <h1 className="font-semibold font-login text-[24px]">
            Iniciar sesión
          </h1>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFailed}
          >
            <Form.Item
              className="mb-12"
              name="email"
              rules={[
                {
                  required: true,
                  message: "El email no es válido",
                },
              ]}
            >
              <Input
                className="h-10 w-80"
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              validateMessages={validateMessages}
              rules={[
                {
                  // pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]/,
                  message: "Al menos 1 Mayúscula y un signo especial",
                },
                {
                  // min: 8,
                  message: "Debe tener al menos 8 carácteres!",
                },
                {
                  required: true,
                  message: "Introduce la contraseña!",
                },
              ]}
            >
              <Input.Password
                className="h-10 w-80"
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
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
            <Form.Item className="flex justify-center">
              <Button
                style={{
                  backgroundColor: "#1a7af8",
                  width: "160px",
                  height: "40px",
                }}
                type="primary"
                htmlType="submit"
                onClick={() => {
                  window.reload;
                }}
                className="login-form-button"
              >
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
