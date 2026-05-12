import { useState, useEffect } from "react";
import { Layout } from "antd";
import Lista from "./lista";

const Menu = () => {
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem("MenuDesp") === "true"
  );

  useEffect(() => {
    localStorage.setItem("MenuDesp", collapsed);
  }, [collapsed]);

  return (
    <Layout.Sider
      collapsed={collapsed}
      collapsedWidth={56}
      width={200}
      trigger={null}
      style={{
        background: "var(--color-bg-layout)",
        borderRight: "1px solid var(--color-border)",
      }}
    >
      <Lista collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
    </Layout.Sider>
  );
};

export default Menu;
