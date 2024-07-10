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
import { setPrecio } from "../../data/localStorage";

const Product = ({ getData }) => {
  const [form] = Form.useForm();
  const [data, setData] = useState(getLocalOrder());
  const [type, setType] = useState(null);
  const [encimera, setEncimera] = useState(null);
  const [isUpdate, setUpdate] = useState(null);
  const [open, setOpen] = useState(false);
  const [initialValues, setInitialValues] = useState({
    name: data?.name,
  });
  const [cantidad, setCantidad] = useState(0);
  const [total, setTotal] = useState(0);
  const [unidad, setUnidad] = useState(0);

  const onFinish = async (values) => {
    const unidadValue = values.unidad !== undefined ? values.unidad : 0;
    const parseUnidadValue =parseFloat(unidadValue).toFixed(2)
    setUnidad(parseUnidadValue);

    if (!values.type) {
      message.error("Por favor seleccione un TIPO DE COMPONENTE");
      return;
    }

    if (!data?._id) return;

    const result = await updateOrderDetails({
      details: {
        ...values,
        unidad:
          values.discount !== undefined
            ? parseFloat(parseUnidadValue) -
              (parseFloat(values.discount) / 100) * parseFloat(parseUnidadValue)
            : parseFloat(parseUnidadValue),
        // total: parseFloat(values.qty) * parseFloat(unidadValue),
      },
      isUpdate,
      _id: data._id,
    });

    if (!result) return;

    getData(result);
    setLocalOrder(result);
    message.success("Se ha actualizado correctamente");

    setTimeout(() => {
      location.reload();
    }, 1000);
  };

  const archivedDetails = async (details) => {
    try {
      const result = await archivedOrderDetails({ _id: data._id, details });
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

  const updateDetails = (details) => {
    const fields = [
      "descripcion",
      "marca",
      "unidad",
      "total",
      "referencia",
      "qty",
      "grosor",
      "type",
    ];

    fields.forEach((field) => {
      form.setFieldValue(field, details?.[field]);
    });
    setUpdate(details?.id);
  };

  useEffect(() => {
    const fields = {
      descripcion: encimera?.name,
      marca: encimera?.type,
      unidad: parseFloat(encimera?.price).toFixed(2),
      referencia: encimera?.code,
      qty: 1,
    };

    Object.keys(fields).forEach((field) => {
      form.setFieldValue(field, fields[field]);
    });

    setUpdate(null);
    setOpen(false);
  }, [encimera]);

  useEffect(() => {
    const newTotal =
      isNaN(cantidad) || isNaN(unidad)
        ? 0
        : parseFloat(cantidad) * parseFloat(unidad);
    setTotal(newTotal);
  }, [cantidad, unidad]);


  return (
    <Card className="rounded-none bg-gray border border-border">
      <Form
        layout="vertical"
        form={form}
        initialValues={initialValues}
        onFinish={onFinish}
      >
        <Row>
          <Col xs={24} sm={24} md={24}>
            <Divider orientation="left">
              <b>Agregar Componentes</b>
            </Divider>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={24}>
            <Form.Item label="Tipo de componente" name="type">
              <Select placeholder="Seleccione" onChange={(e) => setType(e)}>
                <Select.Option value="Encimera">Encimera</Select.Option>
                <Select.Option value="Equipamiento">Equipamiento</Select.Option>
                <Select.Option value="Electrodomestico">
                  Electrodomésticos
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24}>
            <Button
              type="link"
              className="flex justify-center items-center"
              style={{
                marginBottom: 10,
                width: 200,
              }}
              onClick={() => {
                if (type !== null) {
                  setOpen(true);
                } else {
                  message.error("Porfavor selecciona un tipo");
                }
              }}
            >
              Buscar en base de datos
            </Button>
            <Form.Item
              label="Descripcion"
              name="descripcion"
              rules={[
                {
                  required: true,
                  message: "Por favor complete este campo",
                },
              ]}
            >
              <Input
                placeholder={`Descripción ${type}`}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          {/* {type !== "Encimera" && ( */}
          <Col xs={24} sm={24} md={3}>
            <Form.Item
              label="Referencia"
              name="referencia"
              rules={[
                {
                  required: true,
                  message: "Por favor complete este campo",
                },
              ]}
            >
              <Input placeholder="" maxLength="60" />
            </Form.Item>
          </Col>
          {/* )} */}
          <Col xs={24} sm={24} md={2}>
            <Form.Item label="Cantidad" name="qty" rules={[]}>
              <Input
                type="number"
                min="0"
                defaultValue={cantidad}
                onChange={(e) => setCantidad(e.target.value || 0)}
              />
            </Form.Item>
          </Col>
          {/* {type !== "Equipamiento" && ( */}
          <Col xs={24} sm={24} md={6}>
            <Form.Item label="Marca" name="marca" rules={[]}>
              <Input placeholder="" maxLength="60" />
            </Form.Item>
          </Col>
          {/* )}*/}
          {type === "Encimera" && (
            <Col xs={24} sm={24} md={2}>
              <Form.Item label="Grosor" name="grosor" rules={[]}>
                <Input placeholder="" maxLength="60" />
              </Form.Item>
            </Col>
          )}
          <Col xs={24} sm={24} md={3}>
            <Form.Item label="Precio Unidad" name="unidad">
              <Input
                type="number"
                className="border-border shadow-sm"
                onChange={(e) => {
                  const unidad =parseFloat(e.target.value).toFixed(2)
                  setUnidad(unidad)
                }}
                defaultValue={parseFloat(unidad).toFixed(2)}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={3}>
            <Form.Item label="Descuento(%)" name="discount">
              <Input
                type="number"
                defaultValue="0"
                className="border-border shadow-sm"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={24} md={24}>
            <Space>
              <Button
                htmlType="submit"
                type="primary"
                className="flex justify-center items-center"
                style={{
                  height: 50,
                  width: 150,
                  marginTop: 30,
                  padding: "5px 20px",
                  background: "#1a7af8",
                  color: "#fff",
                }}
              >
                Guardar
              </Button>
            </Space>
          </Col>
          <Modal
            open={open}
            onOk={() => {}}
            onCancel={() => setOpen(false)}
            width={1000}
            footer={false}
            maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
            bodyStyle={{ maxHeight: "70vh", overflowY: "auto" }}
          >
            <EncimerasModal title={type} setEncimera={setEncimera} />
          </Modal>
        </Row>
        <br /> <br />
        {data?.details && (
          // && data?.details.length > 0
          <>
            <Divider orientation="left">
              {" "}
              <b>Listado de los Complementos</b>
            </Divider>
            <Table
              dataSource={data.details || []}
              searchable
              className="border border-border"
              columns={[
                {
                  title: "Codigo",
                  dataIndex: "code",
                  key: "code",
                  render: (text, record) => <>{record.referencia}</>,
                },
                {
                  title: "Descripción",
                  dataIndex: "descripcion",
                  key: "descripcion",
                  render: (text, record) => <>{record.descripcion}</>,
                },

                {
                  title: "Marca",
                  dataIndex: "marca",
                  key: "marca",
                  render: (text, record) => <>{record.marca}</>,
                },
                {
                  title: "Tipo",
                  dataIndex: "type",
                  key: "type",
                  render: (text, record) => <>{record.type}</>,
                },
                {
                  title: "Grosor",
                  dataIndex: "grosor",
                  key: "grosor",
                  render: (text, record) => <>{record.grosor}</>,
                },
                {
                  title: "Total",
                  dataIndex: "total",
                  key: "total",
                  render: (text, record) => <>{record.total}€</>,
                },
                {
                  title: "Acciones",
                  dataIndex: "acciones",
                  key: "_id",
                  width: 135,
                  render: (text, record) => (
                    <>
                      <Typography.Link
                        onClick={() => {
                          archivedComplementDetails(record);
                        }}
                      >
                        Eliminar
                      </Typography.Link>
                      &nbsp; &nbsp; &nbsp;
                      {/* <Typography.Link
                        onClick={() => {
                          const objetosFiltrados = data.details.filter(
                            (objeto) => objeto.id !== record.id
                          );
                          updateDetails(record);
                          console.log(record);
                        }}
                      >
                        Editar
                      </Typography.Link> */}
                    </>
                  ),
                },
              ]}
            />
          </>
        )}
      </Form>
    </Card>
  );
};
export default Product;
