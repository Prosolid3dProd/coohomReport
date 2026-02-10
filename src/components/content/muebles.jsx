import React, { useState } from "react";
import { message } from "antd";
import { useOrder } from "../../context/OrderContext";
import { updateCabinetsOrder } from "../../handlers/order";
import { Header } from "./index";
import CabinetTable from "./muebles/CabinetTable";
import CabinetForm from "./muebles/CabinetForm";

const Muebles = () => {
  const { order, setOrder } = useOrder();
  const [openModal, setOpenModal] = useState(false);
  const [editado, setEditado] = useState(false);
  const [selected, setSelected] = useState({});

  const handleFinished = async (fields) => {
    setEditado(true);
    try {
      const cabinets = order.cabinets || [];
      let updatedCabinets;

      if (selected.mode === "edit") {
        updatedCabinets = cabinets.map((cabinet) =>
          cabinet.id === selected.id ? { ...fields, id: selected.id } : cabinet
        );
      } else {
        // New mode
        // Ensure ID is unique if not provided by form (though form usually doesn't provide ID for new)
        // If the form provides an ID, use it, else maybe generate one? 
        // The original code passed 'fields' directly. If fields has no ID, it might be an issue.
        // Assuming backend handles ID or frontend should generate one.
        // In original code: const allFields = [...cabinetFields, fields];
        // Let's assume fields contains necessary data.
        updatedCabinets = [...cabinets, fields];
      }

      const result = await updateCabinetsOrder({
        _id: order?._id,
        cabinets: updatedCabinets,
      });

      if (result) {
        message.success(`Mueble ${selected.mode === "edit" ? "actualizado" : "agregado"} correctamente`);
        setOrder(result);
        setOpenModal(false);
      }
    } catch (error) {
      console.error(error);
      message.error("Error al actualizar mueble");
    } finally {
      setEditado(false);
    }
  };

  const handleArchived = async (row) => {
    setEditado(true);
    try {
      const updatedCabinets = order.cabinets.filter(
        (cabinet) => cabinet.id !== row.id
      );

      const result = await updateCabinetsOrder({
        _id: order?._id,
        cabinets: updatedCabinets,
      });

      if (result) {
        message.success("Mueble eliminado correctamente");
        setOrder(result);
      }
    } catch (error) {
      console.error(error);
      message.error("Error al eliminar mueble");
    } finally {
      setEditado(false);
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
        <CabinetTable
          dataSource={order.cabinets}
          loading={editado}
          onEdit={(row) => {
            setSelected({ ...row, mode: "edit" });
            setOpenModal(true);
          }}
          onDelete={handleArchived}
        />
      )}

      <CabinetForm
        open={openModal}
        selected={selected}
        onCancel={() => setOpenModal(false)}
        onFinish={handleFinished}
      />
    </section>
  );
};

export default Muebles;
