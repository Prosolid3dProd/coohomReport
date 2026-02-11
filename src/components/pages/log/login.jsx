import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockOutlined, UserOutlined, EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, message } from "antd";

import { login as loginHandler } from "../../../handlers/user";
import { useUser } from "../../../context/UserContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Clear legacy storage. Context handles its own state but we clear items just in case.
    localStorage.removeItem("campaign");
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const result = await loginHandler({
        email: values.email,
        password: values.password,
      });
      const { ok, message: msg } = result;

      if (!ok) {
        message.error(msg || "Credenciales incorrectas");
        return;
      }

      message.success(`Bienvenido ${result?.user?.name || "Compañero"}!`);

      // Update Global Context and Cookies
      login(result.token);

      navigate("/Dashboard/Presupuestos", { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      message.error("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.error("Failed:", errorInfo);
    message.error("Por favor completa los campos requeridos");
  };

  const styles = {
    container: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: "100vh",
      backgroundColor: "#f0f2f5",
    },
    panel: {
      backgroundColor: "white",
      borderRadius: "0.75rem",
      width: "610px",
      minHeight: "440px",
      display: "flex",
      flexDirection: "row",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      overflow: "hidden"
    },
    logoSection: {
      width: "200px",
      backgroundColor: "#f0f2f5",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "70px",
      fontWeight: 500,
      color: "#1a7af8"
    },
    formSection: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px"
    },
    title: {
      fontWeight: 600,
      fontSize: "24px",
      marginBottom: "30px",
      fontFamily: "sans-serif"
    },
    form: {
      width: "100%",
      maxWidth: "300px",
      display: "flex",
      flexDirection: "column",
    },
    input: {
      height: "40px"
    },
    submitButton: {
      backgroundColor: "#1a7af8",
      height: "40px",
      width: "100%",
      fontSize: "16px"
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.panel}>
        <div style={styles.logoSection}>
          S
        </div>
        <div style={styles.formSection}>
          <h1 style={styles.title}>Iniciar sesión</h1>
          <Form
            name="normal_login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            layout="vertical"
            style={styles.form}
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: "El email es requerido" }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Email"
                style={styles.input}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "La contraseña es requerida" },
                { min: 6, message: "Mínimo 6 caracteres" }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Contraseña"
                style={styles.input}
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>Recuérdame</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={styles.submitButton}
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
