import { useState, useCallback } from "react";
import { message } from "antd";
import {
  CreateOrderDetails,
  updateOrderDetails,
  handleArchivedOrderDetails,
} from "../../../handlers/order";
import { useOrder } from "../../../context";

export const useProductsManager = (order) => {
  const { refreshOrder } = useOrder();
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    type: null,
    encimera: null,
    isUpdate: null,
    modals: {
      isModalOpen: false,
      isEditModalOpen: false,
    },
  });

  const updateModals = useCallback((modals) => {
    setState((prev) => ({ ...prev, modals: { ...prev.modals, ...modals } }));
  }, []);

  const setType = useCallback((type) => {
    setState((prev) => ({ ...prev, type }));
  }, []);

  const setEncimera = useCallback((encimera) => {
    setState((prev) => ({ ...prev, encimera }));
  }, []);

  const onFinish = async (values, form) => {
    try {
      const qtyNueva = parseFloat(values.qty || 1);
      const discount = parseFloat(values.discount || 0);
      const unitPrice = parseFloat(values.unidad || 0);
      
      const priceWithDiscount = unitPrice - (discount / 100) * unitPrice;
      const total = priceWithDiscount * qtyNueva;

      if (!values.type) {
        message.error("Por favor seleccione un TIPO DE COMPONENTE");
        return;
      }

      if (!order?._id) return;

      const existingDetailIndex = order.details.findIndex(
        (detail) => detail.referencia === values.referencia
      );

      if (existingDetailIndex !== -1) {
        const existingDetail = order.details[existingDetailIndex];
        const nuevaCantidad = parseFloat(existingDetail.qty) + qtyNueva;
        const nuevoTotal = nuevaCantidad * priceWithDiscount;

        const updatedDetails = {
          ...existingDetail,
          qty: nuevaCantidad,
          unidad: priceWithDiscount.toFixed(2),
          total: nuevoTotal.toFixed(2),
          discount: values.discount,
        };

        const result = await updateOrderDetails({
          details: updatedDetails,
          isUpdate: true,
          _id: order._id,
        });

        if (result) {
          await refreshOrder();
          message.success("Se ha actualizado la cantidad del elemento existente");
        }
      } else {
        const result = await CreateOrderDetails({
          details: { ...values },
          isUpdate: state.isUpdate,
          _id: order._id,
        });

        if (result) {
          await refreshOrder();
          message.success("Se ha añadido un nuevo elemento");
        }
      }

      form.resetFields();
    } catch (error) {
      console.error("Error al guardar los detalles:", error);
      message.error("Hubo un error al procesar el elemento");
    }
  };

  const onEditFinish = async (values, editForm) => {
    try {
      const unidad = parseFloat(values.unidad) || 0;
      const qty = parseFloat(values.qty) || 1;
      const updatedTotal = +(unidad * qty).toFixed(2);

      const idEncontrado = order.details.find((d) => d.referencia === values.referencia)?.id ?? null;

      const updatedValues = {
        id: idEncontrado,
        ...values,
        unidad: unidad.toFixed(2),
        total: updatedTotal.toFixed(2),
      };

      const updatedDetails = order.details.map(detail =>
        detail.referencia === values.referencia ? updatedValues : detail
      );

      const result = await updateOrderDetails({
        details: updatedDetails,
        isUpdate: true,
        _id: order._id,
      });

      if (result) {
        await refreshOrder();
        message.success("Producto actualizado correctamente");
        updateModals({ isEditModalOpen: false });
      }
    } catch (error) {
      console.error("Error al actualizar detalles:", error);
    }
  };

  const deleteProduct = async (record) => {
    try {
      setLoading(true);
      const result = await handleArchivedOrderDetails({
        _id: order._id,
        details: record,
      });

      if (result) {
        await refreshOrder();
        message.success("Se ha eliminado el complemento");
      }
    } catch (error) {
      console.error("Error al eliminar detalles:", error);
      message.error("Hubo un error al eliminar el complemento");
    } finally {
      setLoading(false);
    }
  };

  return {
    state,
    loading,
    updateModals,
    setType,
    setEncimera,
    onFinish,
    onEditFinish,
    deleteProduct,
  };
};
