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
  updateOrderDetails,
  handleArchivedOrderDetails,
  getLocalOrder,
  setLocalOrder,
} from "../../handlers/order";
import EncimerasModal from "../pages/Encimeras/encimerasModal";

const Product = ({ getData }) => {
  const [form] = Form.useForm();
  const [data, setData] = useState(getLocalOrder());
  const [type, setType] = useState(null);
  const [encimera, setEncimera] = useState(null);
  const [isUpdate, setUpdate] = useState(null);
  const [open, setOpen] = useState(false);
  const [cantidad, setCantidad] = useState(0);
  const [total, setTotal] = useState(0);
  const [unidad, setUnidad] = useState(0);

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

  useEffect(() => {
    const newTotal = isNaN(cantidad) || isNaN(unidad) ? 0 : parseFloat(cantidad) * parseFloat(unidad);
    setTotal(newTotal);
  }, [cantidad, unidad]);

  const onFinish = async (values) => {
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
          ? parseFloat(parsedUnidadValue) - (parseFloat(values.discount) / 100) * parseFloat(parsedUnidadValue)
          : parseFloat(parsedUnidadValue),
      total: parseFloat(values.qty) * parseFloat(parsedUnidadValue),
    };

    const result = await updateOrderDetails({
      details: updatedDetails,
      isUpdate,
      _id: data._id,
    });

    if (!result) return;

    const existingDetail = result.details.find(detail => detail.referencia === values.referencia);
    if (existingDetail) {
      existingDetail.qty += parseFloat(values.qty);
    } else {
      result.details.push(updatedDetails);
    }

    getData(result);
    setLocalOrder(result);
    message.success("Se ha actualizado correctamente");

    setTimeout(() => {
      location.reload();
    }, 1000);
  };

  const archivedComplementDetails = async (details) => {
    try {
      const result = await handleArchivedOrderDetails({
        _id: data._id,
        details,
      });
      if (result) {
        message.success("Se ha eliminado el complemento");
        setTimeout(() => {
          location.reload();
        }, 200);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const columns = [
    {
      title: "Codigo",
      dataIndex: "referencia",
      key: "referencia",
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
    },
    {
      title: "Marca",
      dataIndex: "marca",
      key: "marca",
    },
    {
      title: "Tipo",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Grosor",
      dataIndex: "grosor",
      key: "grosor",
    },
    {
      title: "Cantidad",
      dataIndex: "qty",
      key: "qty",
    },
    {
      title: "Descuento",
      dataIndex: "discount",
      key: "discount",
    },
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
        </>
      ),
    },
  ];

  return (
    <Card className="rounded-none bg-gray border border-border">
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
      >
        <Row>
          <Col xs={24}>
            <Divider orientation="left"><b>Agregar Componentes</b></Divider>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item label="Tipo de componente" name="type">
              <Select placeholder="Seleccione" onChange={setType}>
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
              <Input placeholder={`Descripción ${type}`} />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              label="Referencia"
              name="referencia"
              rules={[{ required: true, message: "Por favor complete este campo" }]}
            >
              <Input maxLength="60" />
            </Form.Item>
          </Col>
          <Col xs={24} md={4}>
            <Form.Item
              label="Cantidad"
              name="qty"
            >
              <Input
                type="number"
                min="0"
                onChange={(e) => setCantidad(e.target.value || 0)}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item
              label="Marca"
              name="marca"
            >
              <Input maxLength="60" />
            </Form.Item>
          </Col>
          {type === "Encimera" && (
            <Col xs={24} md={4}>
              <Form.Item
                label="Grosor"
                name="grosor"
              >
                <Input maxLength="60" />
              </Form.Item>
            </Col>
          )}
          <Col xs={24} md={6}>
            <Form.Item label="Precio Unidad" name="unidad">
              <Input
                type="number"
                onChange={(e) => setUnidad(parseFloat(e.target.value).toFixed(2))}
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
              style={{ marginBottom: 10, width: 200 }}
              onClick={() => {
                if (type) {
                  setOpen(true);
                } else {
                  message.error("Porfavor selecciona un tipo");
                }
              }}
            >
              Buscar en base de datos
            </Button>
            </Space>
          </Col>
        </Row>
        <Modal
          open={open}
          onCancel={() => setOpen(false)}
          width={1000}
          footer={false}
          maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
          bodyStyle={{ maxHeight: "70vh", overflowY: "auto" }}
        >
          <EncimerasModal title={type} setEncimera={setEncimera} />
        </Modal>
          <>
            <Divider orientation="left"><b>Listado de los Complementos</b></Divider>
            <Table
              dataSource={data.details}
              columns={columns}
              rowKey="_id"
              bordered
            />
          </>
      </Form>
    </Card>
  );
};

export default Product;
