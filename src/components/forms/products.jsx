import React, { useState, useCallback, useMemo } from "react";
import {
  Button,
  Card,
  message,
  Space,
  Flex,
  Modal,
  Typography,
  Form
} from "antd";
import {
  SearchOutlined,
  AppstoreAddOutlined,
  PlusOutlined
} from "@ant-design/icons";
import {
  CreateOrderDetails,
  updateOrderDetails,
  handleArchivedOrderDetails,
  getOrderById,
  fixOrder,
} from "../../handlers/order";
import EncimerasModal from "../pages/Encimeras/encimerasModal";
import { useOrder } from "../../context/OrderContext";
import { useFloatingButton } from "../../hooks/useFloatingButton";
import FloatingSaveButton from "../common/FloatingSaveButton";
import ProductTable from "./products/ProductTable";
import AddProductForm from "./products/AddProductForm";
import EditProductForm from "./products/EditProductForm";

const { Text } = Typography;

export const Product = () => {
  const { order, setOrder } = useOrder();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const [uiState, setUiState] = useState({
    type: null,
    isModalOpen: false,
    isEditModalOpen: false,
  });

  // Use custom hook for floating button logic
  const {
    showFloatingButton,
    mainButtonRef,
    containerRef,
    containerStyle,
    scrollableStyle
  } = useFloatingButton();

  const toggleModal = useCallback((modalName, isOpen) => {
    setUiState((prev) => ({ ...prev, [modalName]: isOpen }));
  }, []);

  const setType = useCallback((type) => {
    setUiState((prev) => ({ ...prev, type }));
    form.setFieldValue('type', type);
  }, [form]);

  const handleEncimeraSelect = useCallback((encimera) => {
    if (encimera) {
      const initialUnit = parseFloat(encimera?.price || 0);
      form.setFieldsValue({
        descripcion: encimera?.name,
        marca: encimera?.marca,
        unidad: initialUnit.toFixed(2),
        referencia: encimera?.code,
        qty: 1,
        discount: 0,
      });
      setUiState((prev) => ({ ...prev, isModalOpen: false }));
    }
  }, [form]);

  const onFinish = async (values) => {
    try {
      if (!uiState.type) {
        message.error("Por favor seleccione un tipo de componente");
        return;
      }

      if (!order?._id) {
        message.error("No se encontró el pedido");
        return;
      }

      setLoading(true);

      const parsedUnidad = parseFloat(values.unidad || 0);
      const descuento = parseFloat(values.discount || 0);
      const qtyNueva = parseFloat(values.qty || 1);

      const unidadConDescuento = parsedUnidad - (descuento / 100) * parsedUnidad;
      const total = qtyNueva * unidadConDescuento;

      const existingDetailIndex = order.details
        ? order.details.findIndex((detail) => detail.referencia === values.referencia)
        : -1;

      let updatedDetails;

      if (existingDetailIndex !== -1) {
        const existingDetail = order.details[existingDetailIndex];
        const nuevaCantidad = parseFloat(existingDetail.qty) + qtyNueva;
        const nuevoTotal = nuevaCantidad * unidadConDescuento;

        updatedDetails = {
          ...existingDetail,
          qty: nuevaCantidad,
          unidad: unidadConDescuento.toFixed(2),
          total: nuevoTotal.toFixed(2),
          discount: descuento,
        };

        const newDetails = [...order.details];
        newDetails[existingDetailIndex] = updatedDetails;

        const result = await updateOrderDetails({
          details: updatedDetails,
          isUpdate: true,
          _id: order._id,
        });

        if (result) {
          const updatedData = { ...order, details: newDetails };
          setOrder(updatedData);
          message.success("Cantidad actualizada correctamente");
        }
      } else {
        updatedDetails = {
          ...values,
          type: uiState.type,
          unidad: unidadConDescuento.toFixed(2),
          total: total.toFixed(2),
        };

        const result = await CreateOrderDetails({
          details: updatedDetails,
          isUpdate: false,
          _id: order._id,
        });

        if (result) {
          const freshOrder = await getOrderById({ _id: order._id });
          if (freshOrder) {
            const fixedOrder = fixOrder(freshOrder);
            setOrder(fixedOrder);
          }
          message.success("Componente agregado correctamente");
          form.resetFields();
          setUiState((prev) => ({ ...prev, type: null }));
        }
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      message.error("Error al procesar el componente");
    } finally {
      setLoading(false);
    }
  };

  const onEditFinish = async (values) => {
    try {
      setLoading(true);
      const parsedUnidad = parseFloat(values.unidad) || 0;
      const parsedDiscount = parseFloat(values.discount) || 0;
      const parsedQty = parseFloat(values.qty) || 1;

      const discountedPrice = parsedUnidad - (parsedDiscount / 100) * parsedUnidad;
      const updatedTotal = discountedPrice * parsedQty;

      const idEncontrado = order.details.find(
        (det) => det.referencia === values.referencia
      )?.id;

      const updatedValues = {
        id: idEncontrado,
        ...values,
        unidad: parsedUnidad.toFixed(2),
        total: updatedTotal.toFixed(2),
      };

      const result = await updateOrderDetails({
        details: updatedValues,
        isUpdate: true,
        _id: order._id,
      });

      if (result) {
        const freshOrder = await getOrderById({ _id: order._id });
        if (freshOrder) {
          const fixedOrder = fixOrder(freshOrder);
          setOrder(fixedOrder);
        }
        message.success("Componente actualizado correctamente");
        toggleModal("isEditModalOpen", false);
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      message.error("Error al actualizar el componente");
    } finally {
      setLoading(false);
    }
  };

  const archivedComplementDetails = async (details) => {
    try {
      setLoading(true);
      const result = await handleArchivedOrderDetails({
        _id: order._id,
        details,
      });

      if (result) {
        const freshOrder = await getOrderById({ _id: order._id });
        if (freshOrder) {
          const fixedOrder = fixOrder(freshOrder);
          setOrder(fixedOrder);
        }
        message.success("Componente eliminado correctamente");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      message.error("Error al eliminar el componente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div ref={containerRef} style={scrollableStyle(showFloatingButton)}>
        <Flex vertical gap="middle" style={{ width: "100%" }}>
          {/* Form para agregar componentes */}
          <Card
            title={
              <Space>
                <AppstoreAddOutlined />
                <span>Agregar Componente</span>
              </Space>
            }
            size="small"
            extra={
              <Button
                icon={<SearchOutlined />}
                onClick={() => {
                  if (!uiState.type) {
                    message.warning("Seleccione un tipo de componente primero");
                    return;
                  }
                  toggleModal("isModalOpen", true);
                }}
              >
                Buscar en catálogo
              </Button>
            }
          >
            <AddProductForm
              form={form}
              onFinish={onFinish}
              loading={loading}
              setType={setType}
              type={uiState.type}
              mainButtonRef={mainButtonRef}
            />
          </Card>

          {/* Tabla de componentes */}
          <Card
            title={
              <Space>
                <Text strong>Componentes del Pedido</Text>
                {order?.details?.length > 0 && (
                  <Text type="secondary">({order.details.length} items)</Text>
                )}
              </Space>
            }
            size="small"
          >
            <ProductTable
              dataSource={order?.details || []}
              loading={loading}
              onEdit={(record) => {
                editForm.setFieldsValue(record);
                toggleModal("isEditModalOpen", true);
              }}
              onDelete={archivedComplementDetails}
            />
          </Card>
        </Flex>
      </div>

      <FloatingSaveButton
        visible={showFloatingButton}
        onClick={() => form.submit()}
        loading={loading}
        icon={<PlusOutlined />}
        text="Agregar Componente"
      />

      {/* Modal de búsqueda */}
      <Modal
        title="Buscar en Catálogo"
        open={uiState.isModalOpen}
        width={1400}
        onCancel={() => toggleModal("isModalOpen", false)}
        footer={null}
      >
        <EncimerasModal title="Catálogo de Componentes" setEncimera={handleEncimeraSelect} />
      </Modal>

      {/* Modal de edición */}
      <Modal
        title="Editar Componente"
        open={uiState.isEditModalOpen}
        onCancel={() => toggleModal("isEditModalOpen", false)}
        footer={null}
        width={600}
      >
        <EditProductForm
          form={editForm}
          onFinish={onEditFinish}
          onCancel={() => toggleModal("isEditModalOpen", false)}
          loading={loading}
        />
      </Modal>
    </div>
  );
};

export default Product;