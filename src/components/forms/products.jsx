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
    const descuento = form.getFieldValue("discount") || 0; // Obtener el descuento del formulario
    const unidadConDescuento = unidad - (descuento / 100) * unidad; // Aplicar descuento

    const total =
      !isNaN(cantidad) && !isNaN(unidadConDescuento)
        ? cantidad * unidadConDescuento
        : 0;

    setFormValues((prev) => ({ ...prev, unidad: unidadConDescuento, total }));
    form.setFieldsValue({ unidad: unidadConDescuento.toFixed(2) }); // Actualizar visualmente
  }, [form.getFieldValue("discount")]);

  const updateLocalOrderData = useCallback(
    (updatedDetails) => {
      const updatedData = {
        ...state.data,
        details: state.data.details.map((detail) =>
          detail.referencia === updatedDetails.referencia
            ? { ...detail, ...updatedDetails } // Solo actualiza el que coincide
            : detail
        ),
      };

      // Actualizar el estado global
      setState((prev) => ({ ...prev, data: updatedData }));

      setLocalOrder(updatedData).then(() => {
        getData(updatedData); // Ahora se ejecuta solo después de actualizar localStorage
      });
    },
    [state.data, getData]
  );

  const onFinish = async (values) => {
    try {
      const parsedUnidad = parseFloat(values.unidad || 0);
      const descuento = parseFloat(values.discount || 0);
      const unidadConDescuento =
        parsedUnidad - (descuento / 100) * parsedUnidad;
      const qtyNueva = parseFloat(values.qty || 1);

      if (!values.type) {
        message.error("Por favor seleccione un TIPO DE COMPONENTE");
        return;
      }

      if (!state.data?._id) return;

      const existingDetailIndex = state.data.details.findIndex(
        (detail) => detail.referencia === values.referencia
      );

      let updatedDetails;
      let updatedData;

      if (existingDetailIndex !== -1) {
        const existingDetail = state.data.details[existingDetailIndex];
        const nuevaCantidad = parseFloat(existingDetail.qty) + qtyNueva;
        const nuevoTotal = nuevaCantidad * unidadConDescuento;

        updatedDetails = {
          ...existingDetail,
          qty: nuevaCantidad,
          unidad: unidadConDescuento.toFixed(2),
          total: nuevoTotal.toFixed(2),
          discount: descuento,
        };

        const newDetails = [...state.data.details];
        newDetails[existingDetailIndex] = updatedDetails;

        updatedData = { ...state.data, details: newDetails };

        const result = await updateOrderDetails({
          details: updatedDetails,
          isUpdate: true,
          _id: state.data._id,
        });

        if (result) {
          setState((prev) => ({ ...prev, data: updatedData }));
          setLocalOrder(updatedData).then(() => {
            getData(updatedData); // Ahora se ejecuta solo después de actualizar localStorage
          });
          message.success(
            "Se ha actualizado la cantidad del elemento existente"
          );
        }
      } else {
        updatedDetails = {
          ...values,
          unidad: unidadConDescuento.toFixed(2),
          total: (qtyNueva * unidadConDescuento).toFixed(2),
        };

        const result = await CreateOrderDetails({
          details: updatedDetails,
          isUpdate: state.isUpdate,
          _id: state.data._id,
        });

        if (result) {
          updatedData = { ...state.data, details: result.details };
          setState((prev) => ({ ...prev, data: updatedData }));
          setLocalOrder(updatedData).then(() => {
            getData(updatedData); // Ahora se ejecuta solo después de actualizar localStorage
          });
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
      const parsedUnidad = parseFloat(values.unidad) || 0;
      const parsedDiscount = parseFloat(values.discount) || 0;
      const parsedQty = parseFloat(values.qty) || 1;

      const discountedPrice = parsedUnidad - (parsedDiscount / 100) * parsedUnidad;
      const updatedTotal = discountedPrice * parsedQty;

      const updatedValues = {
        ...values,
        unidad: parsedUnidad.toFixed(2),
        total: updatedTotal.toFixed(2),
      };

      // console.log("Valores antes de actualizar:", updatedValues);

      // ✅ CORRECCIÓN: Mantener todos los detalles al actualizar
      const updatedDetails = state.data.details.map(detail =>
          detail.referencia === values.referencia ? updatedValues : detail
      );

      // console.log("Detalles actualizados a enviar:", updatedDetails); // <-- Nuevo log

      const result = await updateOrderDetails({
        details: updatedDetails, // ✅ Ahora enviamos TODA la lista de detalles
        isUpdate: state.isUpdate,
        _id: state.data._id,
      });

      // console.log("Respuesta de updateOrderDetails:", result);

      if (result) {
        const updatedData = { ...state.data, details: updatedDetails };

        setState((prev) => ({ ...prev, data: updatedData }));
        setLocalOrder(updatedData).then(() => {
          getData(updatedData);
        });

        message.success("Producto actualizado correctamente");
        updateModals({ isEditModalOpen: false });
      }
    } catch (error) {
      console.error("Error al actualizar detalles:", error);
    }
  };


  const [loading, setLoading] = useState(false); // Estado de carga para la tabla

  const archivedComplementDetails = async (details) => {
    try {
      setLoading(true); // Activar el loading antes de eliminar

      // Llamada a la API para archivar/eliminar el complemento
      const result = await handleArchivedOrderDetails({
        _id: state.data._id,
        details,
      });

      if (result) {
        // Filtrar los detalles para eliminar solo el elemento correcto
        const updatedDetails = state.data.details.filter(
          (detail) => detail.referencia !== details.referencia
        );

        // Crear un nuevo objeto de datos actualizado
        const updatedData = { ...state.data, details: updatedDetails };

        // Actualizar el estado de forma inmutable
        setState((prev) => ({ ...prev, data: updatedData }));

        // Sincronizar con el almacenamiento local y propagar los datos
        setLocalOrder(updatedData).then(() => {
          getData(updatedData); // Ahora se ejecuta solo después de actualizar localStorage
        });

        message.success("Se ha eliminado el complemento");
      }
    } catch (error) {
      console.error("Error al eliminar detalles:", error);
      message.error("Hubo un error al eliminar el complemento");
    } finally {
      setLoading(false); // Desactivar el loading cuando termine
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
                onChange={(e) =>
                  setFormValues({ cantidad: e.target.value || 0 })
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
                onChange={(e) => setFormValues({ unidad: e.target.value || 0 })}
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
        dataSource={state.data?.details || []}
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
