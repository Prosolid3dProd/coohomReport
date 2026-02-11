import React, { useState, useEffect, useMemo } from "react";
import { Outlet, useNavigate, useLocation, NavLink } from "react-router-dom";
import { Layout, Menu, theme, Typography } from "antd";
import { Nav } from "../interfaces";
import { lista, listaCliente } from "../interfaces/menu/menuData";
import { CONFIG } from "../../data/constants";
import Icon, { LogoutOutlined, SettingOutlined } from '@ant-design/icons';

const { Header, Content, Sider } = Layout;

const Logo = () => (
  <NavLink
    to={`/Dashboard/Presupuestos`}
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "36px",
      height: "36px",
      borderRadius: "6px",
      backgroundColor: "#1677ff", // Ant Design Blue
      textDecoration: "none",
    }}
  >
    <span style={{ color: "white", fontSize: "20px", fontWeight: "bold", lineHeight: 1 }}>S</span>
  </NavLink>
);

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState([]);

  // Memoize menu items calculation
  const menuItems = useMemo(() => {
    const campaign = localStorage.getItem("campaign");
    const roleItems =
      campaign === CONFIG.ROLE.ADMIN
        ? lista
        : campaign === CONFIG.ROLE.CLIENT
          ? listaCliente
          : [];

    const items = roleItems.map((item) => ({
      key: item.name, // Ensure 'name' matches path segments or define specific keys
      icon: <Icon component={item.icon} />,
      label: item.name,
      onClick: () => navigate(`/Dashboard/${item.name}`)
    }));

    // Add Config option
    items.push({
      key: 'Config',
      icon: <SettingOutlined />,
      label: 'Configuración',
      onClick: () => navigate('/Dashboard/Config')
    });

    return items;
  }, [navigate]);

  useEffect(() => {
    const pathArray = location.pathname.split('/');
    const lastSegment = pathArray[pathArray.length - 1];
    if (lastSegment) {
      // Handle potential casing issues or default
      setSelectedKeys([lastSegment]);
    }
  }, [location]);

  // Styles object to avoid inline clutter
  const styles = {
    layout: { height: "100vh", overflow: "hidden" },
    sider: {
      overflow: 'auto',
      height: '100vh',
      boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)',
      zIndex: 10
    },
    logoContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px 0'
    },
    logoText: { margin: 0, color: '#1a7af8', display: collapsed ? 'none' : 'block' },
    menu: { borderRight: 0 },
    mainLayout: { height: "100vh", display: "flex", flexDirection: "column" },
    header: {
      padding: '0 24px',
      background: colorBgContainer,
      zIndex: 9,
      boxShadow: '0 1px 4px rgba(0,21,41,.08)',
      height: 64,
      display: 'flex',
      alignItems: 'center',
      flexShrink: 0
    },
    content: {
      margin: "0",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      flex: 1
    }
  };

  // Logout Button Component for Hover Handling
  const LogoutButton = () => {
    const [isHovered, setIsHovered] = useState(false);
    return (
      <a
        href={CONFIG.URLS.LOGIN}
        style={{ color: 'inherit', display: 'flex', justifyContent: 'center', width: '100%', padding: '10px 0' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <LogoutOutlined
          style={{
            fontSize: '24px',
            color: isHovered ? '#ff4d4f' : 'rgba(0, 0, 0, 0.45)',
            cursor: 'pointer',
            transition: 'color 0.3s'
          }}
        />
      </a>
    );
  };

  return (
    <Layout style={styles.layout}>
      <Sider
        collapsible
        collapsed={true}
        trigger={null}
        theme="light"
        width={100}
        collapsedWidth={100}
        style={styles.sider}
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={styles.logoContainer}>
            <Logo />
          </div>
          <Menu
            theme="light"
            mode="inline"
            selectedKeys={selectedKeys}
            style={{
              ...styles.menu,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: '16px',
              marginTop: '20px',
              flex: 1 // Push subsequent items down
            }}
            items={menuItems.map(item => ({
              ...item,
              icon: React.cloneElement(item.icon, { style: { fontSize: '24px' } })
            }))}
          />
          <div style={{ marginBottom: '20px', width: '100%' }}>
            <LogoutButton />
          </div>
        </div>
      </Sider>
      <Layout style={styles.mainLayout}>
        <Header style={styles.header}>
          <Nav />
        </Header>
        <Content style={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
