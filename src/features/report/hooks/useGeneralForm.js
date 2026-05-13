import { useMemo } from "react";
import { message } from "antd";
import { updateOrder } from "../../../handlers/order";
import { useOrder } from "../../../context";

export const useGeneralForm = (order) => {
  const { refreshOrder } = useOrder();

  const initialValues = useMemo(() => {
    if (!order) return {};
    return {
      ...order,
      observation: order?.observation?.includes("null")
        ? ""
        : order?.observation || "",
      fecha: order?.fecha?.split(" ")[0] || "",
      fechaEntrega: order?.fechaEntrega?.split(" ")[0] || "",
      coefficient: order?.coefficient || "",
      drawer: `${order?.modelDrawer || ""}${order?.materialDrawer || ""}`,
      discountEncimeras: order?.discountEncimeras || "",
      discountCabinets: order?.discountCabinets || "",
      discountElectrodomesticos: order?.discountElectrodomesticos || "",
      discountEquipamientos: order?.discountEquipamientos || "",
      modelHandler: order?.modelHandler || "",
      semanaEntrega: order?.semanaEntrega || "",
      customerName: order?.customerName || "",
      phone: order?.phone || "",
      location: order?.location || "",
      modelDoor: order?.modelDoor || "",
      materialDoor: order?.materialDoor || "",
      materialCabinet: order?.materialCabinet || "",
      ivaEncimeras: order?.ivaEncimeras || "",
      ivaCabinets: order?.ivaCabinets || "",
      ivaElectrodomesticos: order?.ivaElectrodomesticos || "",
      ivaEquipamientos: order?.ivaEquipamientos || "",
    };
  }, [order]);

  const onFinish = async (values) => {
    if (!order?._id) {
      message.error("No se encontró el ID del pedido");
      return;
    }

    try {
      const updatedOrder = { ...order, ...values, _id: order._id };
      const result = await updateOrder(updatedOrder);

      if (result && result.order && result.order._id) {
        message.success("Se ha actualizado correctamente");
        await refreshOrder();
      } else {
        throw new Error("La respuesta de updateOrder no contiene un order válido");
      }
    } catch (error) {
      console.error("Error en onFinish:", error);
      message.error("Error al guardar los cambios: " + error.message);
    }
  };

  return {
    initialValues,
    onFinish,
  };
};
