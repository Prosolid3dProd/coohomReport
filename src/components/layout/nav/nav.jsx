import { NavLink, useNavigate } from "react-router-dom";
import BtnReport from "../../../shared/ui/ButtonReport";
import { Layout, message, Typography } from "antd";
import { useUser } from "../../../context";
import { useOrder } from "../../../context";

const Icono = () => (
  <NavLink
    to="/Dashboard/Presupuestos"
    style={{
      display: "flex", justifyContent: "center", alignItems: "center",
      marginRight: 12, width: 30, height: 30, fontSize: 18,
      borderRadius: 6, backgroundColor: "var(--color-primary)", fontWeight: 600,
      textDecoration: "none",
    }}
  >
    <span style={{ color: "white", paddingTop: 2 }}>C</span>
  </NavLink>
);

const NavHeader = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Icono />
      <h1 style={{ color: "#000", margin: 0 }}>
        <b>{user?.name}</b>
      </h1>
      &nbsp;&nbsp;&nbsp;
      <Typography.Link onClick={() => { logout(); navigate("/Login"); }}>
        Cerrar Sesión
      </Typography.Link>
    </div>
  );
};

const Boton = () => {
  const { order } = useOrder();
  const hasOrder = Boolean(order?._id);
  const ruta = hasOrder ? "/Dashboard/Report" : "/Dashboard/Presupuestos";

  const handleClick = (e) => {
    if (!hasOrder) {
      e.preventDefault();
      message.warning("No hay ningún presupuesto cargado");
    }
  };

  return (
    <NavLink to={ruta} onClick={handleClick}>
      <BtnReport title="Orden" />
    </NavLink>
  );
};

const Nav = () => (
  <Layout.Header
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0 16px",
      background: "var(--color-bg-layout)",
      borderBottom: "1px solid var(--color-border)",
      height: 56,
      lineHeight: "56px",
    }}
  >
    <NavHeader />
    <Boton />
  </Layout.Header>
);

export default Nav;
