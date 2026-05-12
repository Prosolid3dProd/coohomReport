import { Button } from "antd";
import { Arrow } from "./icons";

const ButtonReport = ({ title, click }) => (
  <Button
    type="primary"
    onClick={click}
    style={{ width: 170, height: 56, fontWeight: 600 }}
  >
    <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {title} <Arrow style={{ fontSize: 22 }} />
    </span>
  </Button>
);

export default ButtonReport;
