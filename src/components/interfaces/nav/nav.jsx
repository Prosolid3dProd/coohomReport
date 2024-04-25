import { NavLink } from "react-router-dom";
import { BtnReport } from "../../utils";
import { Typography } from "antd";

const Icono = () => (
  <NavLink
    to={`/Dashboard/Presupuestos`}
    className="flex justify-center items-center mr-3 w-[30px] h-[30px] text-[18px] rounded-md bg-blue font-semibold transition ease-out duration-350 dark:colorbotonDark"
  >
    <span className="text-white pt-0.5">C</span>
  </NavLink>
);

const Header = () => (
  <header className="col-start-1 flex flex-row justify-start items-center ml-4">
    <Icono />
    <h1 style={{ color: "#000" }}>
      <b> {JSON.parse(localStorage.getItem("token")).user?.name}</b>
    </h1>{" "}
    &nbsp; &nbsp; &nbsp;
    <Typography.Link href="https://coohom-report.vercel.app/Login">
      Cerrar Sesión
    </Typography.Link>
  </header>
);

const Boton = () => {
  return (
    <NavLink to={"/Dashboard/Report"}>
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
