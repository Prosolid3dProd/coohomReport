// Archivo Product.js
import React, { useEffect, useState } from "react";
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
  // Hooks de estado para gestionar datos y formularios
  const [form] = Form.useForm();
  const [formValues] = Form.useForm();
  const [data, setData] = useState(getLocalOrder());
  const [type, setType] = useState(null);
  const [encimera, setEncimera] = useState(null);
  const [isUpdate, setUpdate] = useState(null);
  const [open, setOpen] = useState(false);
  const [modal2Open, setModal2Open] = useState(false);
  const [total, setTotal] = useState(0);
  const [unidad, setUnidad] = useState(0);
  const [cantidad, setCantidad] = useState(0);


  // Actualiza los campos del formulario cuando se selecciona una encimera
  useEffect(() => {
    if (encimera) {
      const fields = {
        descripcion: encimera?.name,
        marca: encimera?.type,
        unidad: parseFloat(encimera?.price).toFixed(2),
        referencia: encimera?.code,
        qty: 1,
      };
      form.setFieldsValue(fields);
      setUpdate(null);
      setOpen(false);
    }
  }, [encimera, form]);

  // Calcula el total dinámicamente cuando cambian cantidad o unidad
  useEffect(() => {
    const newTotal =
      isNaN(cantidad) || isNaN(unidad)
        ? 0
        : parseFloat(cantidad) * parseFloat(unidad);
    setTotal(newTotal);
  }, [cantidad, unidad]);

  const onFinishw = async (values) => {
    try {
      const updatedDetails = { ...values };
      const result = await updateOrderDetails({ details: updatedDetails, isUpdate, _id: data._id });
      if (result) {
        getData(result);
        setLocalOrder(result);
        message.success("Actualización exitosa");
        setModal2Open(false);
        setTimeout(() => location.reload(), 1000);
      }
    } catch (error) {
      console.error("Error al actualizar detalles:", error);
    }
  };

  // Maneja el envío del formulario
  const onFinish = async (values) => {
    try {
      const unidadValue = values.unidad !== undefined ? values.unidad : 0;
      const parsedUnidadValue = parseFloat(unidadValue).toFixed(2);
      setUnidad(parsedUnidadValue);

      if (!values.type) {
        message.error("Por favor seleccione un TIPO DE COMPONENTE");
        return;
      }

      if (!data?._id) return;

      const updatedDetails = {
        ...values,
        unidad:
          values.discount !== undefined
            ? parseFloat(parsedUnidadValue) -
              (parseFloat(values.discount) / 100) *
                parseFloat(parsedUnidadValue)
            : parseFloat(parsedUnidadValue),
        total: parseFloat(values.qty) * parseFloat(parsedUnidadValue),
      };

      const result = await CreateOrderDetails({
        details: updatedDetails,
        isUpdate,
        _id: data._id,
      });

      if (result) {
        const existingDetail = result.details.find(
          (detail) => detail.referencia === values.referencia
        );
        if (existingDetail) {
          existingDetail.qty += parseFloat(values.qty);
        } else {
          result.details.push(updatedDetails);
        }

        getData(result);
        setLocalOrder(result);
        message.success("Se ha actualizado correctamente");
        setTimeout(() => location.reload(), 1000);
      }
    } catch (error) {
      console.error("Error al guardar los detalles:", error);
    }
  };

  // Elimina un complemento de los detalles
  const archivedComplementDetails = async (details) => {
    try {
      const result = await handleArchivedOrderDetails({
        _id: data._id,
        details,
      });
      if (result) {
        message.success("Se ha eliminado el complemento");
        setTimeout(() => location.reload(), 200);
      }
    } catch (error) {
      console.error("Error al archivar detalles:", error);
    }
  };

  // Configuración de las columnas para la tabla
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
      dataIndex: "_id",
      key: "_id",
      width: 135,
      render: (text, record) => (
        <>
          <Typography.Link onClick={() => archivedComplementDetails(record)}>
            Eliminar
          </Typography.Link>
          <Divider type="right" />
          {/* <Typography.Link
            onClick={() => {
              formValues.setFieldsValue(record);
              setModal2Open(true);
            }}
          >
            Editar
          </Typography.Link>

          <>
            <Modal
              title="Editar Complemento"
              centered
              open={modal2Open}
              onCancel={() => setModal2Open(false)}
              footer={null}
            >
              <Form layout="vertical" onFinish={onFinishw} form={formValues}>
                <Form.Item label="Codigo" name="referencia">
                  <Input/>
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
                  <Button type="primary" htmlType="submit" onClick={() => setModal2Open(false)}>
                    Guardar
                  </Button>
                  <Button
                    onClick={() => setModal2Open(false)}
                    style={{ marginLeft: 8 }}
                  >
                    Cancelar
                  </Button>
                </Form.Item>
              </Form>
            </Modal>
          </> */}
        </>
      ),
    },
  ];

  return (
    <Card className="rounded-none bg-gray border border-border">
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Row>
          <Col xs={24}>
            <Divider orientation="left">
              <b>Agregar Componentes</b>
            </Divider>
          </Col>
        </Row>
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
              <Input placeholder={`Descripción ${type}`} />
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
              <Input maxLength="60" />
            </Form.Item>
          </Col>
          <Col xs={24} md={4}>
            <Form.Item label="Cantidad" name="qty">
              <Input
                type="number"
                min="0"
                onChange={(e) => setCantidad(e.target.value || 0)}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item label="Marca" name="marca">
              <Input maxLength="60" />
            </Form.Item>
          </Col>
          {type === "Encimera" && (
            <Col xs={24} md={4}>
              <Form.Item label="Grosor" name="grosor">
                <Input maxLength="60" />
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
            <Form.Item label="Descuento(%)" name="discount">
              <Input type="number" defaultValue="0" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col xs={24}>
            <Space>
              <Button
                htmlType="submit"
                type="primary"
                style={{
                  height: 50,
                  width: 150,
                  marginTop: 30,
                  background: "#1a7af8",
                  color: "#fff",
                }}
              >
                Guardar
              </Button>
              <Button
                type="link"
                onClick={() => setOpen(true)}
                style={{ height: 50, width: 150, marginTop: 30 }}
              >
                Buscar mas elementos
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
      <Divider />
      {/* Tabla para mostrar los detalles del pedido */}
      <Table
        dataSource={data?.details || []}
        columns={columns}
        rowKey="referencia"
        scroll={{ x: "100%" }}
      />
      {/* Modal para buscar y seleccionar encimeras */}
      <Modal
        title="Seleccionar Encimera"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        centered
        width={1000}
        bodyStyle={{
          padding: "0", // Elimina márgenes internos para más espacio útil.
          maxHeight: "calc(100vh - 100px)", // Ajusta la altura según la pantalla.
          overflow: "hidden", // Elimina scroll adicional en el modal.
        }}
        afterOpenChange={(visible) => {
          document.body.style.overflow = visible ? "hidden" : ""; // Controla el scroll del body.
        }}
      >
        <EncimerasModal
          setEncimera={setEncimera}
          title="Encimeras Disponibles"
        />
      </Modal>
    </Card>
  );
};

export default Product;
