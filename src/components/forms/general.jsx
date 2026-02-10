import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Form,
  Card,
  Input,
  message,
  Modal,
  Space,
  Typography,
} from "antd";
import {
  SaveOutlined,
  LockOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { updateOrder } from "../../handlers/order";
import { useOrder } from "../../context/OrderContext";
import { useFloatingButton } from "../../hooks/useFloatingButton";
import FloatingSaveButton from "../common/FloatingSaveButton";

// Import new sub-components
import ClientInfo from "./general/ClientInfo";
import FurnitureSpecs from "./general/FurnitureSpecs";
import FinancialDetails from "./general/FinancialDetails";
import Preferences from "./general/Preferences";

const { Text } = Typography;

export const General = () => {
  const { order, setOrder, preferences, updatePreference } = useOrder();
  const [form] = Form.useForm();

  const role = order?.profile?.role || "";
  const isClient = role === "client";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCoefficientEditable, setIsCoefficientEditable] = useState(!isClient);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({});

  // Use custom hook for floating button logic
  const {
    showFloatingButton,
    mainButtonRef,
    containerRef,
    containerStyle,
    scrollableStyle
  } = useFloatingButton();

  useEffect(() => {
    if (order) {
      const values = {
        ...order,
        observation: order?.observation?.includes("null") ? "" : order?.observation || "",
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
      setInitialValues(values);
      form.setFieldsValue(values);

      if (order?.profile?.role !== "client") {
        setIsCoefficientEditable(true);
      }
    }
  }, [order, form]);

  const handlePrecioChange = useCallback((key) => {
    updatePreference('showPrices', key, !preferences.showPrices[key]);
  }, [preferences.showPrices, updatePreference]);

  const handleTotalesChange = useCallback((key) => {
    updatePreference('showTotals', key, !preferences.showTotals[key]);
  }, [preferences.showTotals, updatePreference]);

  const unlockCoefficient = useCallback(() => {
    if (isClient && !isCoefficientEditable) setIsModalOpen(true);
  }, [isClient, isCoefficientEditable]);

  const handleModalOk = useCallback(() => {
    if (password === "1234") {
      setIsCoefficientEditable(true);
      message.success("Coeficiente desbloqueado");
    } else {
      message.error("Contraseña incorrecta");
    }
    setIsModalOpen(false);
    setPassword("");
  }, [password]);

  const handleModalCancel = useCallback(() => {
    setIsModalOpen(false);
    setPassword("");
  }, []);

  const onFinish = async (values) => {
    if (!order?._id) {
      message.error("No se encontró el ID del pedido");
      return;
    }

    try {
      setLoading(true);
      const updatedOrderData = { ...order, ...values, _id: order._id };
      const result = await updateOrder(updatedOrderData);

      if (result?.order?._id) {
        const updatedData = {
          ...result.order,
          profile: order.profile,
        };
        setOrder(updatedData);
        message.success("Cambios guardados correctamente");
        form.setFieldsValue(updatedData);
      } else {
        throw new Error("Respuesta inválida del servidor");
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      message.error("Error al guardar los cambios");
      form.setFieldsValue(initialValues);
    } finally {
      setLoading(false);
    }
  };

  if (!order) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <Text type="secondary">No hay datos disponibles para mostrar.</Text>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div ref={containerRef} style={scrollableStyle(showFloatingButton)}>
        <Form form={form} layout="vertical" initialValues={initialValues} onFinish={onFinish}>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>

            <ClientInfo />

            <FurnitureSpecs />

            {/* Coeficiente Logic (Kept inline as it has local state specific to this form) */}
            {role === "client" && (
              <Card
                title={
                  <Space>
                    <LockOutlined />
                    <span>Coeficiente de Venta</span>
                  </Space>
                }
                size="small"
              >
                <Form.Item label="Coeficiente" name="coefficient">
                  <Input
                    readOnly={!isCoefficientEditable}
                    onClick={unlockCoefficient}
                    placeholder="Coeficiente de venta"
                    suffix={!isCoefficientEditable && <LockOutlined style={{ color: '#999' }} />}
                    style={!isCoefficientEditable ? { cursor: "pointer" } : {}}
                  />
                </Form.Item>
              </Card>
            )}

            {role === "admin" && (
              <Card
                title={
                  <Space>
                    <FileTextOutlined />
                    <span>Información de Coeficiente</span>
                  </Space>
                }
                size="small"
              >
                <Form.Item label="Coeficiente Venta Cliente">
                  <Input
                    value={order.userId?.coefficient || "N/A"}
                    disabled
                    style={{ backgroundColor: '#f5f5f5' }}
                  />
                </Form.Item>
              </Card>
            )}

            <FinancialDetails />

            <Preferences
              preferences={preferences}
              handlePrecioChange={handlePrecioChange}
              handleTotalesChange={handleTotalesChange}
            />

            {/* Botón Guardar */}
            <div ref={mainButtonRef} style={{ display: 'flex', justifyContent: 'center', paddingTop: 16 }}>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                size="large"
                loading={loading}
                style={{ width: '90%', maxWidth: 800, height: 50, fontSize: 16 }}
              >
                Guardar Cambios
              </Button>
            </div>
          </Space>
        </Form>
      </div>

      <FloatingSaveButton
        visible={showFloatingButton}
        onClick={() => form.submit()}
        loading={loading}
      />

      {/* Modal de contraseña */}
      <Modal
        title="Desbloquear Coeficiente"
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Desbloquear"
        cancelText="Cancelar"
      >
        <Form.Item label="Contraseña">
          <Input.Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Introduce la contraseña"
            onPressEnter={handleModalOk}
          />
        </Form.Item>
      </Modal>
    </div>
  );
};

export default General;