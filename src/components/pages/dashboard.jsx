import { Layout } from "antd";
import { Outlet } from "react-router";
import { Menu, Nav } from "../layout";

const Dashboard = () => (
  <Layout style={{ height: "100vh" }}>
    <Nav />
    <Layout>
      <Menu />
      <Layout.Content style={{ overflow: "auto" }}>
        <Outlet />
      </Layout.Content>
    </Layout>
  </Layout>
);

export default Dashboard;
