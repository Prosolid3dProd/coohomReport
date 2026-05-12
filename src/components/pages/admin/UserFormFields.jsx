import { FileAddOutlined } from "@ant-design/icons";
import { Button, Form, Input as Input_ant, Select, Row, Col } from "antd";

const { Option } = Select;

const UserFormFields = ({ logoUrl, onUploadLogo, isEdit = false }) => (
  <Row gutter={16}>
    <Col span={12}>
      <Form.Item name="name" label="Propietario" rules={[{ required: true }]}>
        <Input_ant autoComplete="off" />
      </Form.Item>
      <Form.Item name="email" label="E-mail" rules={[{ required: true, type: "email" }]}>
        <Input_ant autoComplete="off" />
      </Form.Item>
      <Form.Item name="nif" label="NIF">
        <Input_ant autoComplete="off" />
      </Form.Item>
      <Form.Item name="info1" label="Info1">
        <Input_ant autoComplete="off" />
      </Form.Item>
      <Form.Item name="coefficient" label="Coeficiente" rules={[{ required: true }]}>
        <Input_ant autoComplete="off" />
      </Form.Item>
    </Col>
    <Col span={12}>
      <Form.Item name="logo" label="Logo">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Button type="default" onClick={onUploadLogo}>
            <FileAddOutlined /> Logo
          </Button>
          {logoUrl && (
            <img
              src={logoUrl}
              alt="Logo"
              style={{ width: 100, height: 100, objectFit: "contain" }}
            />
          )}
        </div>
      </Form.Item>
      <Form.Item
        name="password"
        label="Contraseña"
        rules={isEdit ? [] : [{ required: true }]}
      >
        <Input_ant.Password
          autoComplete="new-password"
          placeholder={isEdit ? "Nueva contraseña (opcional)" : ""}
        />
      </Form.Item>
      <Form.Item name="role" label="Rol" rules={[{ required: true }]}>
        <Select>
          <Option value="admin">Administrador</Option>
          <Option value="client">Cliente</Option>
        </Select>
      </Form.Item>
      <Form.Item name="coefficientVenta" label="Coef. Venta">
        <Input_ant autoComplete="off" />
      </Form.Item>
    </Col>
  </Row>
);

export default UserFormFields;
