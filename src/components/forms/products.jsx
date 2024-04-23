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

  const [unidad, setUnidad] = useState(0);

  const onFinish = async (values) => {
    setUnidad(values.unidad !== undefined ? values.unidad : 0);
    if (values.type) {
      if (data?._id) {
        const result = await updateOrderDetails({
          details: {
            ...values,
            unidad: unidad,
            total: parseFloat(values.qty) * parseFloat(unidad),
          },
          isUpdate,
          _id: data._id,
        });

        if (result) {
          getData(result);
          setLocalOrder(result);

          message.success("Se ha actualizado correctamente");
          setTimeout(() => {
            location.reload();
          }, 1000);
        }
      }
    } else {
      message.error("Por favor seleccione un TIPO DE COMPONENTE");
    }
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
    form.setFieldValue("descripcion", details?.descripcion);
    form.setFieldValue("marca", details?.marca);
    form.setFieldValue("unidad", details?.unidad);
    form.setFieldValue("total", details?.total);
    form.setFieldValue("referencia", details?.referencia);
    form.setFieldValue("qty", details?.qty);
    form.setFieldValue("grosor", details?.grosor);
    form.setFieldValue("type", details?.type);
    setUpdate(details?.id);
  };

  useEffect(() => {
    form.setFieldValue("descripcion", encimera?.name);
    form.setFieldValue("marca", encimera?.name);
    form.setFieldValue("unidad", encimera?.price);
    form.setFieldValue("total", encimera?.price);
    form.setFieldValue("referencia", encimera?.code);
    form.setFieldValue("qty", 1);
    setUpdate(null);
    setOpen(false);
  }, [encimera]);

  const [cantidad, setCantidad] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (isNaN(cantidad) || isNaN(unidad)) setTotal((total) => (total = 0));
    setTotal((total) => (total = parseFloat(cantidad) * parseFloat(unidad)));
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
                <Select.Option value="encimera">Encimera</Select.Option>
                <Select.Option value="equipamiento">Equipamento</Select.Option>
                <Select.Option value="electrodomestico">
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
                height: 50,
                width: 200,
                marginTop: 30,
              }}
              onClick={() => setOpen(true)}
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

          <Col xs={24} sm={24} md={2}>
            <Form.Item label="Grosor" name="grosor" rules={[]}>
              <Input placeholder="" maxLength="60" />
            </Form.Item>
          </Col>
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
          <Col xs={24} sm={24} md={6}>
            <Form.Item label="Marca" name="marca" rules={[]}>
              <Input placeholder="" maxLength="60" />
            </Form.Item>
          </Col>
          <Col xs={32} sm={32} md={6}>
            <Form.Item label="Precio Unidad" name="unidad">
              <Input
                type="number"
                className="border-border shadow-sm"
                onChange={(e) => setUnidad(e.target.value)}
                defaultValue={unidad}
              />
            </Form.Item>
          </Col>
          {/*  <Col xs={24} sm={24} md={3}>
            <Form.Item className="font-bold" label="Total" name="total">
              <Input
                type="number"
                min="0"
                disabled
                className="shadow-sm placeholder:italic placeholder:text-slate-500"
                placeholder={total}
                style={{ border: "1px solid green" }}
              />
            </Form.Item>
            </Col> */}
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
            title="Encimeras"
            open={open}
            onOk={() => {}}
            onCancel={() => setOpen(false)}
            width={1000}
            footer={false}
          >
            <EncimerasModal setEncimera={setEncimera} />
          </Modal>
        </Row>
        <br /> <br />
        <Divider orientation="left">
          {" "}
          <b>Listado de los Complementos</b>
        </Divider>
        {data?.details /*&& data?.details.length > 0*/ && (
          <Table
            dataSource={data.details || []}
            searchable
            className="border border-border"
            columns={[
              {
                title: "Acciones",
                dataIndex: "",
                key: "_id",
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
                    <Typography.Link
                      onClick={() => {
                        const objetosFiltrados = data.details.filter(
                          (objeto) => objeto.id !== record.id
                        );
                        updateDetails(record);
                      }}
                    >
                      Editar
                    </Typography.Link>
                  </>
                ),
              },
              {
                title: "Descripción",
                dataIndex: "descripcion",
                key: "name",
                render: (text, record) => <>{record.descripcion}</>,
              },
              {
                title: "Codigo",
                dataIndex: "code",
                key: "code",
                render: (text, record) => <>{record.referencia}</>,
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
                title: "Total",
                dataIndex: "total",
                key: "total",
                render: (text, record) => <>{record.total}€</>,
              },
              {
                title: "grosor",
                dataIndex: "grosor",
                key: "grosor",
                render: (text, record) => <>{record.grosor}</>,
              },
            ]}
          />
        )}
      </Form>
    </Card>
  );
};
export default Product;
