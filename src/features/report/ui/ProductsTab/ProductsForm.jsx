import { Form, Row, Col, Divider, Input, Select, Space, Button } from "antd";

const ProductsForm = ({ form, type, onTypeChange, onFinish, onOpenSearch }) => {
  return (
    <Form layout="vertical" form={form} onFinish={(values) => onFinish(values, form)}>
      <Divider orientation="left">
        <b>Agregar Componentes</b>
      </Divider>
      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Form.Item label="Tipo de componente" name="type">
            <Select placeholder="Seleccione" onChange={onTypeChange}>
              <Select.Option value="Encimera">Encimera</Select.Option>
              <Select.Option value="Equipamiento">Equipamiento</Select.Option>
              <Select.Option value="Electrodomestico">Electrodomésticos</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item
            label="Descripcion"
            name="descripcion"
            rules={[{ required: true, message: "Por favor complete este campo" }]}
          >
            <Input placeholder={`Descripción ${type || ""}`} />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item
            label="Referencia"
            name="referencia"
            rules={[{ required: true, message: "Por favor complete este campo" }]}
          >
            <Input maxLength={60} />
          </Form.Item>
        </Col>
        <Col xs={24} md={4}>
          <Form.Item label="Cantidad" name="qty">
            <Input type="number" min={0} />
          </Form.Item>
        </Col>
        <Col xs={24} md={6}>
          <Form.Item label="Marca" name="marca">
            <Input maxLength={60} />
          </Form.Item>
        </Col>
        {type === "Encimera" && (
          <Col xs={24} md={4}>
            <Form.Item label="Grosor" name="grosor">
              <Input maxLength={60} />
            </Form.Item>
          </Col>
        )}
        <Col xs={24} md={6}>
          <Form.Item label="Precio Unidad" name="unidad">
            <Input type="number" />
          </Form.Item>
        </Col>
        <Col xs={24} md={4}>
          <Form.Item label="Descuento(%)" name="discount" initialValue={0}>
            <Input type="number" />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col xs={24}>
          <Space>
            <Button type="primary" htmlType="submit">
              Guardar
            </Button>
            <Button type="link" onClick={onOpenSearch}>
              Buscar más elementos
            </Button>
          </Space>
        </Col>
      </Row>
    </Form>
  );
};

export default ProductsForm;
