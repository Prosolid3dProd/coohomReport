import { Button, Row, Col, Form, Input, Modal } from "antd";

const FIELDS = [
  { name: "id", label: "ID", disabledOnEdit: true },
  { name: "name", label: "Nombre" },
  { name: "reference", label: "Referencia" },
  { name: "priceCabinet", label: "Precio del Mueble" },
  { name: "priceVariants", label: "Precio de la variante" },
  { name: "priceDrawers", label: "Precio de los Cajones" },
  { name: "total", label: "Precio total" },
];

const MuebleModal = ({ open, onClose, onSave, form, isNew }) => (
  <Modal
    title={isNew ? "Nuevo Mueble" : "Editar Mueble"}
    open={open}
    onCancel={onClose}
    destroyOnClose
    footer={null}
  >
    <Form layout="vertical" form={form} onFinish={onSave} style={{ marginTop: 16 }}>
      {FIELDS.map(({ name, label, disabledOnEdit }) => (
        <Row key={name} gutter={[16, 16]}>
          <Col span={8}>{label}</Col>
          <Col span={16}>
            <Form.Item name={name}>
              <Input disabled={disabledOnEdit && !isNew} />
            </Form.Item>
          </Col>
        </Row>
      ))}
      <Row gutter={[16, 16]}>
        <Col span={16} />
        <Col span={8}>
          <Button
            style={{ background: "#000", color: "#fff", width: "100%" }}
            htmlType="submit"
          >
            Guardar
          </Button>
        </Col>
      </Row>
    </Form>
  </Modal>
);

export default MuebleModal;