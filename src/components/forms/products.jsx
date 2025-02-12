import React, { useEffect, useState, useCallback } from "react";
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
  getLocalOrder,
  setLocalOrder,
} from "../../handlers/order";
import EncimerasModal from "../pages/Encimeras/encimerasModal";

const Product = ({ getData }) => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [state, setState] = useState({
    data: getLocalOrder(),
    type: null,
    encimera: null,
    isUpdate: null,
    modals: {
      isModalOpen: false,
      isEditModalOpen: false,
    },
  });

  // Manejo de estados relacionados con los formularios y cálculos
  const [formValues, setFormValues] = useState({
    cantidad: 0,
    unidad: 0,
    total: 0,
  });

  // Actualiza el estado de modales
  const updateModals = (modals) => {
    setState((prev) => ({ ...prev, modals: { ...prev.modals, ...modals } }));
  };

  // Dentro de tu componente
  const setType = (type) => {
    setState((prev) => ({ ...prev, type }));
  };

  // Maneja los campos de encimera seleccionada
  useEffect(() => {
    if (state.encimera) {
      form.setFieldsValue({
        descripcion: state.encimera?.name,
        marca: state.encimera?.type,
        unidad: parseFloat(state.encimera?.price).toFixed(2),
        referencia: state.encimera?.code,
        qty: 1,
      });
      setState((prev) => ({ ...prev, isUpdate: null }));
      updateModals({ isModalOpen: false });
    }
  }, [state.encimera, form]);

  // Calcula el total dinámicamente
  useEffect(() => {
    const { cantidad, unidad } = formValues;
    const total = !isNaN(cantidad) && !isNaN(unidad) ? cantidad * unidad : 0;
    setFormValues((prev) => ({ ...prev, total }));
  }, [formValues.cantidad, formValues.unidad]);

  const updateLocalOrderData = useCallback(
    (updatedDetails) => {
      const updatedData = {
        ...state.data,
        details: state.data.details.map((detail) =>
          detail.referencia === updatedDetails.referencia
            ? updatedDetails
            : detail
        ),
      };
      setState((prev) => ({ ...prev, data: updatedData }));
      setLocalOrder(updatedData);
      getData(updatedData);
    },
    [state.data, getData]
  );

  const onFinish = async (values) => {
    try {
      const parsedUnidad = parseFloat(values.unidad || 0).toFixed(2);

      if (!values.type) {
        message.error("Por favor seleccione un TIPO DE COMPONENTE");
        return;
      }

      if (!state.data?._id) return;

      const updatedDetails = {
        ...values,
        unidad: values.discount
          ? parseFloat(parsedUnidad) - (values.discount / 100) * parsedUnidad
          : parseFloat(parsedUnidad),
        total: parseFloat(values.qty) * parseFloat(parsedUnidad),
      };

      const result = await CreateOrderDetails({
        details: updatedDetails,
        isUpdate: state.isUpdate,
        _id: state.data._id,
      });

      if (result) {
        const updatedData = {
          ...state.data,
          details: result.details,
        };
        setState((prev) => ({ ...prev, data: updatedData }));
        setLocalOrder(updatedData);
        getData(updatedData);
        message.success("Se ha actualizado correctamente");
      }
    } catch (error) {
      console.error("Error al guardar los detalles:", error);
    }
  };

  const onEditFinish = async (values) => {
    try {
      const result = await updateOrderDetails({
        details: values,
        isUpdate: state.isUpdate,
        _id: state.data._id,
      });
      if (result) {
        updateLocalOrderData(values);
        message.success("Actualización exitosa");
        updateModals({ isEditModalOpen: false });
      }
    } catch (error) {
      console.error("Error al actualizar detalles:", error);
    }
  };

  const archivedComplementDetails = async (details) => {
    try {
      const result = await handleArchivedOrderDetails({
        _id: state.data._id,
        details,
      });
      if (result) {
        const updatedDetails = state.data.details.filter(
          (detail) => detail.referencia !== details.referencia
        );
        const updatedData = { ...state.data, details: updatedDetails };

        setState((prev) => ({ ...prev, data: updatedData }));
        setLocalOrder(updatedData);
        getData(updatedData);
        message.success("Se ha eliminado el complemento");
      }
    } catch (error) {
      console.error("Error al archivar detalles:", error);
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
    <Card className="rounded-none bg-gray border border-border">
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
                onChange={(e) => setCantidad(e.target.value || 0)}
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
                onChange={(e) =>
                  setUnidad(parseFloat(e.target.value).toFixed(2))
                }
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
                onClick={() => updateModals({ isModalOpen: true })}
              >
                Buscar más elementos
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
      <Divider />
      <Table
        dataSource={state.data?.details || []}
        columns={columns}
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
            <Input />
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
          <Form.Item label="Total" name="total">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Guardar
            </Button>
            <Button
              onClick={() => setIsEditModalOpen(false)}
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
