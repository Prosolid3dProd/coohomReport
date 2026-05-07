import { Outlet } from "react-router";
import { Menu, Nav } from "../layout";
const Dashboard = () => (
  <>
    <Nav />
    <Outlet />
    <Menu />
  </>
);

export default Dashboard;
