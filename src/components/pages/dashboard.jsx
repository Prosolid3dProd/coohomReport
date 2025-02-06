import { Outlet } from "react-router";
import { Menu, Nav } from "../interfaces";
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
