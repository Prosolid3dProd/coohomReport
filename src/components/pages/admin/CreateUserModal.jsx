import { useEffect, useState } from "react";
import * as filestack from "filestack-js";
import { Button, Form, Modal, message } from "antd";
import { createUser, getUsers } from "../../../handlers/user";
import UserFormFields from "./UserFormFields";

const CreateUserModal = ({ open, setOpen, onCreated }) => {
  const [logoUrl, setLogoUrl] = useState("");
  const [form] = Form.useForm();

  const handleUpload = () => {
    const client = filestack.init(import.meta.env.VITE_FILESTACK_KEY);
    client.picker({
      onUploadDone: (file) => setLogoUrl(file.filesUploaded[0].url),
    }).open();
  };

  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
    setLogoUrl("");
  };

  const onFinish = async (values) => {
    try {
      const finalValues = { ...values, logo: logoUrl || "" };
      const nuevaTienda = await createUser(finalValues);
      if (nuevaTienda.response?.data.message === "Usuario ya existe") {
        message.error("Error: Usuario existente");
        return;
      }
      if (!nuevaTienda) {
        message.error("Error: Conexión Base de Datos");
        return;
      }
      const usuarios = await getUsers();
      onCreated(usuarios);
      message.info(`Nueva Tienda: ${nuevaTienda[0].name}`);
      setOpen(false);
      form.resetFields();
      setLogoUrl("");
    } catch (err) {
      console.error("Error en onFinish:", err);
    }
  };

  useEffect(() => {
    if (open) {
      form.resetFields();
      setLogoUrl("");
    }
  }, [open, form]);

  return (
    <Modal
      title="Crear Nuevo Usuario"
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={800}
    >
      <Form
        form={form}
        name="create_user"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <UserFormFields logoUrl={logoUrl} onUploadLogo={handleUpload} />
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Crear Usuario
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateUserModal;
