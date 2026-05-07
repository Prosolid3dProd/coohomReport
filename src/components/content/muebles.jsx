import {
  Button,
  Popconfirm,
  Table,
  Typography,
  Modal,
  Row,
  Col,
  Form,
  Input,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { updateCabinetsOrder } from "../../handlers/order";
import { useOrder } from "../../context";
import { Header } from "./index";

const Muebles = () => {
  const { order, refreshOrder } = useOrder();
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [selected, setSelected] = useState({});

  useEffect(() => {
    if (selected) {
      form.setFieldsValue({
        name: selected.name,
        reference: selected.reference,
        priceCabinet: selected.priceCabinet,
        priceVariants: selected.priceVariants,
        priceDrawers: selected.priceDrawers,
        total: selected.total,
        id: selected.id,
      });
    }
  }, [selected]);

  const handleFinished = async () => {
    const fields = form.getFieldsValue();
    const cabinetFields =
      selected.mode === "edit"
        ? order.cabinets.filter((cabinet) => cabinet.id !== selected.id)
        : order.cabinets;
    const allFields = [...cabinetFields, fields];

    setLoading(true);
    try {
      const result = await updateCabinetsOrder({
        _id: order?._id,
        cabinets: allFields,
      });

      if (result?.ok !== false) {
        message.success(result?.message || "Mueble actualizado correctamente");
        setOpenModal(false);
        await refreshOrder();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleArchived = async (row) => {
    const cabinetFields = order.cabinets.filter(
      (cabinet) => cabinet.id !== row.id
    );

    setLoading(true);
    try {
      const result = await updateCabinetsOrder({
        _id: order?._id,
        cabinets: cabinetFields,
      });

      if (result?.ok !== false) {
        message.success(result?.message || "Mueble eliminado correctamente");
        await refreshOrder();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <Header
        name={"Muebles"}
        funcion={() => {
          setSelected({ mode: "new" });
          setOpenModal(true);
        }}
      />

      {order && order.cabinets && (
        <Table
          className="border border-t-0 border-border"
          loading={loading}
          dataSource={order.cabinets}
          pagination={false}
          rowKey={"id"}
          scroll={{ y: "calc(100vh - 390px)" }}
        >
          <Table.Column
            title="Acción"
            dataIndex="action"
            align="center"
            key="action"
            width={150}
            render={(_, rows) => (
              <>
                <Typography.Link
                  onClick={() => {
                    setSelected({ ...rows, mode: "edit" });
                    setOpenModal(true);
                  }}
                >
                  Editar
                </Typography.Link>
                &nbsp;&nbsp; | &nbsp;&nbsp;
                <Popconfirm
                  okType="default"
                  okText="Si"
                  cancelText="No"
                  title="¿Estás seguro de eliminar este mueble?"
                  onConfirm={() => handleArchived(rows)}
                >
                  <Typography.Link>Eliminar</Typography.Link>
                </Popconfirm>
              </>
            )}
          />
          <Table.Column
            title="Referencia"
            dataIndex="reference"
            key="reference"
            width={120}
            render={(_, rows) => rows.reference}
          />
          <Table.Column
            title="Nombre"
            dataIndex="name"
            key="name"
            width={400}
            render={(_, rows) => rows.name}
          />
          <Table.Column
            title="Precio"
            align="right"
            dataIndex="price"
            key="price"
            render={(_, rows) => <>{rows.total || 0}&nbsp;€</>}
          />
        </Table>
      )}

      <Form
        layout="vertical"
        form={form}
        initialValues={{
          name: selected.name,
          reference: selected.reference,
          priceCabinet: selected.priceCabinet,
          priceVariants: selected.priceVariants,
          priceDrawers: selected.priceDrawers,
          total: selected.total,
          id: selected.id,
        }}
        onFinish={handleFinished}
        style={{ maxWidth: 600 }}
      >
        <Modal
          title="Editar Mueble"
          open={openModal}
          onOk={() => {}}
          destroyOnClose
          onCancel={() => setOpenModal(false)}
          footer={false}
        >
          <br />
          <Row gutter={[16, 16]}>
            <Col span={8}>ID</Col>
            <Col span={16}>
              <Form.Item name="id">
                <Input disabled={selected.mode !== "new"} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={8}>Nombre</Col>
            <Col span={16}>
              <Form.Item name="name">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={8}>Referencía</Col>
            <Col span={16}>
              <Form.Item name="reference">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={8}>Precio del Mueble</Col>
            <Col span={16}>
              <Form.Item name="priceCabinet">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={8}>Precio de la variante</Col>
            <Col span={16}>
              <Form.Item name="priceVariants">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={8}>Precio de los Cajones</Col>
            <Col span={16}>
              <Form.Item name="priceDrawers">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={8}>Precio total</Col>
            <Col span={16}>
              <Form.Item name="total">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={16}></Col>
            <Col span={8}>
              <Button
                style={{ background: "#000", color: "#fff", width: "100%" }}
                onClick={handleFinished}
              >
                Guardar
              </Button>
            </Col>
          </Row>
        </Modal>
      </Form>
    </section>
  );
};

export default Muebles;
