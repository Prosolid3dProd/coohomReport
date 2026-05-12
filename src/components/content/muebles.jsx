import { Button, Popconfirm, Table, Typography, Form, message } from "antd";
import { useState } from "react";
import { updateCabinetsOrder } from "../../handlers/order";
import { useOrder } from "../../context";
import { Header } from "./index";
import MuebleModal from "./MuebleModal";

const Muebles = () => {
  const { order, refreshOrder } = useOrder();
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [isNew, setIsNew] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const openEdit = (row) => {
    setIsNew(false);
    setSelectedId(row.id);
    form.setFieldsValue({
      id: row.id,
      name: row.name,
      reference: row.reference,
      priceCabinet: row.priceCabinet,
      priceVariants: row.priceVariants,
      priceDrawers: row.priceDrawers,
      total: row.total,
    });
    setOpenModal(true);
  };

  const openNew = () => {
    setIsNew(true);
    setSelectedId(null);
    form.resetFields();
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    form.resetFields();
  };

  const handleSave = async () => {
    const fields = form.getFieldsValue();
    const filteredCabinets = isNew
      ? order.cabinets
      : order.cabinets.filter((c) => c.id !== selectedId);
    const updatedCabinets = [...filteredCabinets, fields];

    setLoading(true);
    try {
      const result = await updateCabinetsOrder({
        _id: order?._id,
        cabinets: updatedCabinets,
      });
      if (result?.ok !== false) {
        message.success(result?.message || "Mueble guardado correctamente");
        setOpenModal(false);
        await refreshOrder();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleArchived = async (row) => {
    const updatedCabinets = order.cabinets.filter((c) => c.id !== row.id);
    setLoading(true);
    try {
      const result = await updateCabinetsOrder({
        _id: order?._id,
        cabinets: updatedCabinets,
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
      <Header name={"Muebles"} funcion={openNew} />

      {order?.cabinets && (
        <Table
          style={{ border: "1px solid var(--color-border)", borderTop: "none" }}
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
            render={(_, row) => (
              <>
                <Typography.Link onClick={() => openEdit(row)}>Editar</Typography.Link>
                &nbsp;&nbsp;|&nbsp;&nbsp;
                <Popconfirm
                  okType="default"
                  okText="Si"
                  cancelText="No"
                  title="¿Estás seguro de eliminar este mueble?"
                  onConfirm={() => handleArchived(row)}
                >
                  <Typography.Link>Eliminar</Typography.Link>
                </Popconfirm>
              </>
            )}
          />
          <Table.Column title="Referencia" dataIndex="reference" key="reference" width={120} />
          <Table.Column title="Nombre" dataIndex="name" key="name" width={400} />
          <Table.Column
            title="Precio"
            align="right"
            dataIndex="price"
            key="price"
            render={(_, row) => <>{row.total || 0}&nbsp;€</>}
          />
        </Table>
      )}

      <MuebleModal
        open={openModal}
        onClose={handleClose}
        onSave={handleSave}
        form={form}
        isNew={isNew}
      />
    </section>
  );
};

export default Muebles;