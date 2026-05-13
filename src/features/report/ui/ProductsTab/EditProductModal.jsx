import { Modal, Form, Input, Button } from "antd";

const EditProductModal = ({ open, form, onFinish, onCancel }) => {
  return (
    <Modal
      title="Editar Complemento"
      open={open}
      onCancel={onCancel}
      footer={null}
    >
      <Form layout="horizontal" form={form} onFinish={(values) => onFinish(values, form)}>
        <Form.Item label="Codigo" name="referencia">
          <Input disabled />
        </Form.Item>
        <Form.Item label="Descripcion" name="descripcion">
          <Input />
        </Form.Item>
        <Form.Item label="Marca" name="marca">
          <Input />
        </Form.Item>
        <Form.Item label="Tipo" name="type">
          <Input />
        </Form.Item>
        <Form.Item label="Grosor" name="grosor">
          <Input />
        </Form.Item>
        <Form.Item label="Cantidad" name="qty">
          <Input />
        </Form.Item>
        <Form.Item label="Descuento" name="discount">
          <Input />
        </Form.Item>
        <Form.Item label="Total" name="unidad">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Guardar
          </Button>
          <Button onClick={onCancel} style={{ marginLeft: 8 }}>
            Cancelar
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProductModal;
