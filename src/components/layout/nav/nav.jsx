import { NavLink } from "react-router-dom";
import { BtnReport } from "../../utils";
import { message, Typography } from "antd";
import { useUser } from "../../../context";
import { useOrder } from "../../../context";

const Icono = () => (
  <NavLink
    to={`/Dashboard/Presupuestos`}
    className="flex justify-center items-center mr-3 w-[30px] h-[30px] text-[18px] rounded-md bg-blue-600 font-semibold transition ease-out duration-350"
  >
    <span className="text-white pt-0.5">C</span>
  </NavLink>
);

const Header = () => {
  const { user } = useUser();
  return (
    <header className="col-start-1 flex flex-row justify-start items-center ml-4">
      <Icono />
      <h1 style={{ color: "#000" }}>
        <b> {user?.name}</b>
      </h1>
      &nbsp; &nbsp; &nbsp;
      <Typography.Link href="https://coohom-report.vercel.app/Login">
        Cerrar Sesión
      </Typography.Link>
    </header>
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
      <BtnReport title={"Orden"} />
    </NavLink>
  );
};


const Nav = () => (
  <nav className="col-span-12 row-start-1 row-span-1 flex flex-row justify-between border-b border-border bg-gray dark:bordes dark:bg-general">
    <Header />
    <Boton />
  </nav>
);

export default Nav;
