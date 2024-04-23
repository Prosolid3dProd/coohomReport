import { Outlet } from "react-router";
import { Menu, Nav } from "../interfaces";
import { setLocalToken } from "../../data/localStorage";

const Dashboard = () => {
  // setLocalToken({}) // Guard de Login

  return (
    <>
      <Nav />
      <Outlet />
      <Menu />
    </>
  );
};

export default Dashboard;
