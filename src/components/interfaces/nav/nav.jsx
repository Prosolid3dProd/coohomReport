import React from "react";
import { NavLink } from "react-router-dom";
import AppButton from "../../common/AppButton";
import { message, Typography, Space, Button, Row, Col, Avatar } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import { getLocalToken } from "../../../data/localStorage";

const { Text } = Typography;

const UserInfo = () => {
  let userName = "Usuario";
  try {
    const token = getLocalToken();
    if (token) {
      const decoded = jwtDecode(token);
      userName = decoded?.usuario?.name || "Usuario";
    }
  } catch (e) {
    console.warn("Error decoding token for user info", e);
  }

  return (
    <Space align="center" size="small">
      <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1a7af8' }} />
      <Text strong style={{ fontSize: '16px' }}>{userName}</Text>
    </Space>
  );
};

const BotonOrden = () => {
  const order = localStorage.getItem("order");

  // Check if order exists and is a valid JSON (not null/empty)
  // The backend returns the order object, so checking truthiness is usually enough
  // but we can parse it to be sure it's valid
  const hasOrder = !!order && order !== "null" && order !== "undefined";

  const handleClick = (e) => {
    if (!hasOrder) {
      e.preventDefault();
      message.warning("No hay ningún presupuesto cargado");
    }
  };

  const ruta = hasOrder ? "/Dashboard/Report" : "/Dashboard/Presupuestos";

  return (
    <NavLink to={ruta} onClick={handleClick}>
      <AppButton text="Orden" type="primary" style={{ backgroundColor: '#1677ff', width: '100px' }} />
    </NavLink>
  );
};

const Nav = () => {
  return (
    <Row justify="space-between" align="middle" style={{ width: '100%', height: '100%', flexWrap: 'nowrap' }}>
      <Col>
        <Space align="center" size="middle" style={{ display: 'flex' }}>
          <UserInfo />
        </Space>
      </Col>
      <Col>
        <BotonOrden />
      </Col>
    </Row>
  );
};

export default Nav;
