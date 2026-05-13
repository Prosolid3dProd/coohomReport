import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import { updateProfile } from "../../../handlers/order";
import { getUsers } from "../../../handlers/user";

export const useProfileForm = (order) => {
  const [initialValues, setInitialValues] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchUserData = useCallback(async () => {
    if (!order?.profile?.email) return;
    try {
      setLoading(true);
      const users = await getUsers();
      const currentUser = users?.find(
        (user) => user.email === order?.profile?.email
      );
      if (currentUser) {
        const values = {
          email: currentUser.email,
          info1: currentUser.info1,
          info2: currentUser.info2,
          info3: currentUser.info3,
          logo: currentUser.logo,
          coefficient: currentUser.coefficient,
          observacion1: currentUser.observacion1,
          observacion2: currentUser.observacion2,
          observacion3: currentUser.observacion3,
          observacion4: currentUser.observacion4,
          observacion5: currentUser.observacion5,
        };
        setInitialValues(values);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      message.error("Error al cargar los datos del usuario");
    } finally {
      setLoading(false);
    }
  }, [order?.profile?.email]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const onFinish = async (values) => {
    try {
      if (order?._id) {
        const result = await updateProfile({ ...values });
        if (result) {
          message.success("Se ha actualizado correctamente");
          await fetchUserData();
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error("Error al actualizar el perfil");
    }
  };

  return {
    initialValues,
    onFinish,
    loading,
    refresh: fetchUserData,
  };
};
