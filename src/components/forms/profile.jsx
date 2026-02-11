import React, { useEffect, useState, useCallback } from "react";
import {
  Button,
  Form,
  message,
  Space,
  Flex,
} from "antd";
import {
  SaveOutlined,
} from "@ant-design/icons";
import { updateProfile } from "../../handlers/order";
import { getUsers } from "../../handlers/user";
import { useOrder } from "../../context/OrderContext";
import { useUser } from "../../context/UserContext";
import { useFloatingButton } from "../../hooks/useFloatingButton";
import FloatingSaveButton from "../common/FloatingSaveButton";

// Import new sub-components
import StoreInfo from "./profile/StoreInfo";
import CoefficientInfo from "./profile/CoefficientInfo";
import Observations from "./profile/Observations";

export const Profile = () => {
  const { order, setOrder } = useOrder();
  const { user: contextUser, refreshUser } = useUser();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Use custom hook for floating button logic
  const {
    showFloatingButton,
    mainButtonRef,
    containerRef,
    containerStyle,
    scrollableStyle
  } = useFloatingButton();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (order?.profile?.email) {
          let currentUser = null;

          // 1. Try to use Context User (Optimized)
          if (contextUser && contextUser.email === order.profile.email) {
            currentUser = contextUser;
          } else {
            // 2. Fallback to API Fetch
            const users = await getUsers();
            currentUser = users.find((user) => user.email === order.profile.email);
          }

          if (currentUser) {
            const updatedValues = {
              email: currentUser.email || "",
              info1: currentUser.info1 || "",
              info2: currentUser.info2 || "",
              info3: currentUser.info3 || "",
              logo: currentUser.logo || "",
              coefficient: currentUser.coefficient || "",
              observacion1: currentUser.observacion1 || "",
              observacion2: currentUser.observacion2 || "",
              observacion3: currentUser.observacion3 || "",
              observacion4: currentUser.observacion4 || "",
              observacion5: currentUser.observacion5 || "",
            };
            form.setFieldsValue(updatedValues);
          }
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
        message.error("Error al cargar los datos del usuario");
      }
    };
    fetchUserData();
  }, [order, form, contextUser]);

  const onFinish = useCallback(async (values) => {
    try {
      if (!order?._id) {
        message.error("No se encontró el pedido");
        return;
      }

      setLoading(true);
      const result = await updateProfile({ ...values, _id: order._id });

      if (result) {
        message.success("Perfil actualizado correctamente");
        setOrder(result);
        // Propagate changes globally
        await refreshUser();
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      message.error("Error al actualizar el perfil");
    } finally {
      setLoading(false);
    }
  }, [order, setOrder, refreshUser]);

  return (
    <div style={containerStyle}>
      <div ref={containerRef} style={scrollableStyle(showFloatingButton)}>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Flex vertical gap="middle" style={{ width: "100%" }}>

            <StoreInfo />

            <CoefficientInfo role={order?.profile?.role} />

            <Observations />

            {/* Botón Guardar */}
            <div ref={mainButtonRef} style={{ display: 'flex', justifyContent: 'center', paddingTop: 16 }}>
              <Button
                htmlType="submit"
                type="primary"
                icon={<SaveOutlined />}
                size="large"
                loading={loading}
                style={{ width: '90%', maxWidth: 800, height: 50, fontSize: 16 }}
              >
                Guardar Cambios
              </Button>
            </div>
          </Flex>
        </Form>
      </div>

      <FloatingSaveButton
        visible={showFloatingButton}
        onClick={() => form.submit()}
        loading={loading}
      />
    </div>
  );
};

export default Profile;
