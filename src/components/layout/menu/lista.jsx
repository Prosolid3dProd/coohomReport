import { Menu as AntMenu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../../context";
import { lista, listaCliente } from "./menuData";
import { ArrowsLeft, ArrowsRight } from "../../../shared/ui/icons";

const Lista = ({ collapsed, onToggle }) => {
  const { user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  const roleItems =
    user?.role === "admin" ? lista : user?.role === "client" ? listaCliente : [];

  const items = roleItems.map(({ name, icon: Icon }) => ({
    key: `/Dashboard/${name}`,
    icon: <Icon style={{ fontSize: 20 }} />,
    label: name,
  }));

  const selectedKey = items.find((item) =>
    location.pathname.startsWith(item.key)
  )?.key;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", paddingTop: 8 }}>
      <div
        onClick={onToggle}
        style={{
          display: "flex",
          justifyContent: collapsed ? "center" : "flex-end",
          padding: "4px 12px 8px",
          cursor: "pointer",
          color: "#9ca3af",
        }}
      >
        {collapsed ? <ArrowsRight /> : <ArrowsLeft />}
      </div>
      <AntMenu
        mode="inline"
        selectedKeys={selectedKey ? [selectedKey] : []}
        inlineCollapsed={collapsed}
        items={items}
        onClick={({ key }) => navigate(key)}
        style={{ background: "transparent", border: "none", flex: 1 }}
      />
    </div>
  );
};

export default Lista;
