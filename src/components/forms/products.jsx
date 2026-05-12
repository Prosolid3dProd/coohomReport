import { useEffect, useState } from "react";
import {
  Button,
  Input,
  Form,
  Card,
  Row,
  Col,
  Select,
  Divider,
  message,
  Space,
  Modal,
  Table,
  Typography,
} from "antd";
import {
  CreateOrderDetails,
  updateOrderDetails,
  handleArchivedOrderDetails,
} from "../../handlers/order";
import { useOrder } from "../../context";
import EncimerasModal from "../pages/encimeras/encimerasModal";

const applyDiscount = (basePrice, discountPct, qty) => {
  const price = parseFloat(basePrice) || 0;
  const discount = parseFloat(discountPct) || 0;
  const quantity = parseFloat(qty) || 1;
  const priceWithDiscount = price - (discount / 100) * price;
  return { priceWithDiscount, total: +(priceWithDiscount * quantity).toFixed(2) };
};

const Product = () => {
  const { order, refreshOrder } = useOrder();
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [state, setState] = useState({
    type: null,
    encimera: null,
    isUpdate: null,
    modals: {
      isModalOpen: false,
      isEditModalOpen: false,
    },
  });

  const [formValues, setFormValues] = useState({
    cantidad: 0,
    unidad: 0,
    total: 0,
  });

  const updateModals = (modals) => {
    setState((prev) => ({ ...prev, modals: { ...prev.modals, ...modals } }));
  };

  const setType = (type) => {
    setState((prev) => ({ ...prev, type }));
  };

  useEffect(() => {
    if (state.encimera) {
      form.setFieldsValue({
        descripcion: state.encimera?.name,
        marca: state.encimera?.marca,
        unidad: parseFloat(state.encimera?.price).toFixed(2),
        referencia: state.encimera?.code,
        qty: 1,
      });
      setState((prev) => ({ ...prev, isUpdate: null }));
      updateModals({ isModalOpen: false });
    }
  }, [state.encimera, form]);

  const discount = Form.useWatch("discount", form);

  useEffect(() => {
    const { cantidad, unidad } = formValues;
    const descuento = discount || 0;
    const unidadConDescuento = unidad - (descuento / 100) * unidad;

    const total =
      !isNaN(cantidad) && !isNaN(unidadConDescuento)
        ? cantidad * unidadConDescuento
        : 0;

    setFormValues((prev) => ({ ...prev, unidad: unidadConDescuento, total }));
    form.setFieldsValue({ unidad: unidadConDescuento.toFixed(2) });
  }, [discount]);

  const onFinish = async (values) => {
    try {
      const qtyNueva = parseFloat(values.qty || 1);
      const { priceWithDiscount: unidadConDescuento } = applyDiscount(values.unidad, values.discount, qtyNueva);

      if (!values.type) {
        message.error("Por favor seleccione un TIPO DE COMPONENTE");
        return;
      }

      if (!order?._id) return;

      const existingDetailIndex = order.details.findIndex(
        (detail) => detail.referencia === values.referencia
      );

      if (existingDetailIndex !== -1) {
        const existingDetail = order.details[existingDetailIndex];
        const nuevaCantidad = parseFloat(existingDetail.qty) + qtyNueva;
        const nuevoTotal = nuevaCantidad * unidadConDescuento;

        const updatedDetails = {
          ...existingDetail,
          qty: nuevaCantidad,
          unidad: unidadConDescuento.toFixed(2),
          total: nuevoTotal.toFixed(2),
          discount: values.discount,
        };

        const result = await updateOrderDetails({
          details: updatedDetails,
          isUpdate: true,
          _id: order._id,
        });

        if (result) {
          await refreshOrder();
          message.success("Se ha actualizado la cantidad del elemento existente");
        }
      } else {
        const result = await CreateOrderDetails({
          details: { ...values },
          isUpdate: state.isUpdate,
          _id: order._id,
        });

        if (result) {
          await refreshOrder();
          message.success("Se ha añadido un nuevo elemento");
        }
      }

      form.resetFields();
    } catch (error) {
      console.error("Error al guardar los detalles:", error);
      message.error("Hubo un error al procesar el elemento");
    }
  };

  const onEditFinish = async (values) => {
    try {
      const unidad = parseFloat(values.unidad) || 0;
      const qty = parseFloat(values.qty) || 1;
      const updatedTotal = +(unidad * qty).toFixed(2);

      const idEncontrado = order.details.find((d) => d.referencia === values.referencia)?.id ?? null;

      const updatedValues = {
        id: idEncontrado,
        ...values,
        unidad: unidad.toFixed(2),
        total: updatedTotal.toFixed(2),
      };

      const updatedDetails = order.details.map(detail =>
        detail.referencia === values.referencia ? updatedValues : detail
      );

      const result = await updateOrderDetails({
        details: updatedDetails,
        isUpdate: state.isUpdate,
        _id: order._id,
      });

      if (result) {
        await refreshOrder();
        message.success("Producto actualizado correctamente");
        updateModals({ isEditModalOpen: false });
      }
    } catch (error) {
      console.error("Error al actualizar detalles:", error);
    }
  };


  const [loading, setLoading] = useState(false);

  const archivedComplementDetails = async (details) => {
    try {
      setLoading(true);
      const result = await handleArchivedOrderDetails({
        _id: order._id,
        details,
      });

      if (result) {
        await refreshOrder();
        message.success("Se ha eliminado el complemento");
      }
    } catch (error) {
      console.error("Error al eliminar detalles:", error);
      message.error("Hubo un error al eliminar el complemento");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: "Codigo", dataIndex: "referencia", key: "referencia" },
    { title: "Descripción", dataIndex: "descripcion", key: "descripcion" },
    { title: "Marca", dataIndex: "marca", key: "marca" },
    { title: "Tipo", dataIndex: "type", key: "type" },
    { title: "Grosor", dataIndex: "grosor", key: "grosor" },
    { title: "Cantidad", dataIndex: "qty", key: "qty" },
    { title: "Descuento", dataIndex: "discount", key: "discount" },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (text) => `${text}€`,
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_, record) => (
        <>
          <Typography.Link onClick={() => archivedComplementDetails(record)}>
            Eliminar
          </Typography.Link>
          <Divider type="vertical" />
          <Typography.Link
            onClick={() => {
              editForm.setFieldsValue(record);
              updateModals({ isEditModalOpen: true });
            }}
          >
            Editar
          </Typography.Link>
        </>
      ),
    },
  ];

  return (
    <Card style={{ borderRadius: 0, background: "var(--color-bg-layout)", border: "1px solid var(--color-border)" }}>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Divider orientation="left">
          <b>Agregar Componentes</b>
        </Divider>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item label="Tipo de componente" name="type">
              <Select placeholder="Seleccione" onChange={setType}>
                <Select.Option value="Encimera">Encimera</Select.Option>
                <Select.Option value="Equipamiento">Equipamiento</Select.Option>
                <Select.Option value="Electrodomestico">
                  Electrodomésticos
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              label="Descripcion"
              name="descripcion"
              rules={[
                { required: true, message: "Por favor complete este campo" },
              ]}
            >
              <Input placeholder={`Descripción ${state.type || ""}`} />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              label="Referencia"
              name="referencia"
              rules={[
                { required: true, message: "Por favor complete este campo" },
              ]}
            >
              <Input maxLength={60} />
            </Form.Item>
          </Col>
          <Col xs={24} md={4}>
            <Form.Item label="Cantidad" name="qty">
              <Input
                type="number"
                min={0}
                onChange={(e) =>
                  setFormValues((prev) => ({ ...prev, cantidad: e.target.value || 0 }))
                }
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item label="Marca" name="marca">
              <Input maxLength={60} />
            </Form.Item>
          </Col>
          {state.type === "Encimera" && (
            <Col xs={24} md={4}>
              <Form.Item label="Grosor" name="grosor">
                <Input maxLength={60} />
              </Form.Item>
            </Col>
          )}
          <Col xs={24} md={6}>
            <Form.Item label="Precio Unidad" name="unidad">
              <Input
                type="number"
                onChange={(e) => setFormValues((prev) => ({ ...prev, unidad: e.target.value || 0 }))}
              />
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
              <Button
                type="link"
                onClick={() => {
                  if (!state.type) {
                    message.warning(
                      "Por favor seleccione un TIPO DE COMPONENTE antes de buscar."
                    );
                    return;
                  }
                  updateModals({ isModalOpen: true });
                }}
              >
                Buscar más elementos
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
      <Divider />
      <Table
        dataSource={order?.details || []}
        columns={columns}
        loading={loading}
        rowKey="referencia"
      />
      <Modal
        title="Seleccionar Complemento"
        open={state.modals.isModalOpen}
        width={1000}
        onCancel={() => updateModals({ isModalOpen: false })}
        footer={null}
      >
        <EncimerasModal
          title={"Complementos"}
          setEncimera={(encimera) =>
            setState((prev) => ({ ...prev, encimera }))
          }
        />
      </Modal>
      <Modal
        title="Editar Complemento"
        open={state.modals.isEditModalOpen}
        onCancel={() => updateModals({ isEditModalOpen: false })}
        footer={null}
      >
        <Form layout="horizontal" form={editForm} onFinish={onEditFinish}>
          <Form.Item label="Codigo" name="referencia">
            <Input disabled  />
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
            <Button
              onClick={() => updateModals({ isEditModalOpen: false })}
              style={{ marginLeft: 8 }}
            >
              Cancelar
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Product;