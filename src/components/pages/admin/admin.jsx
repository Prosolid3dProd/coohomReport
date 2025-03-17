import React, { useEffect, useState } from "react";
import { FileAddOutlined } from "@ant-design/icons";
import * as filestack from "filestack-js";
import "../../../index.css";
import "./admin.css";
import {
  Button,
  Form,
  Input as Input_ant,
  Select,
  message,
  Popconfirm,
  Modal,
  Table,
  Space,
} from "antd";
import { Header } from "../../content";
import { QuestionCircleOutlined } from "@ant-design/icons";
import {
  createUser,
  getUsers,
  deleteUser,
  updateUser,
  resetPassword,
} from "../../../handlers/user";

const { Option } = Select;
const { success, info, error } = message;

const MENSAJES = {
  SUCCESS: () => success("Se ha actualizado Correctamente"),
  INFO: (nombreTienda) => info(`Nueva Tienda: ${nombreTienda}`),
  ERROR: (problema) => error(`Error: ${problema}`),
  DELETE: (nombreTienda) => info(`Se ha eliminado la Tienda: ${nombreTienda}`),
};

const ShopsForm = ({ setListaTiendas }) => {
  const [logoUrl, setLogoUrl] = useState(""); // Estado para URL del logo

  // Función para manejar la subida del logo
  const handleUpload = () => {
    const client = filestack.init("AXPWPBPSTvSKYoyHwByaaz");
    const options = {
      onUploadDone: async (file) => {
        const uploadedUrl = file.filesUploaded[0].url;
        setLogoUrl(uploadedUrl); // Actualiza la URL del logo
      },
      onFileUploadFailed: (error) => {
        console.error("Error en la carga del archivo:", error);
      },
    };
    const picker = client.picker(options);
    picker.open();
  };

  // Función para manejar el envío del formulario
  const onFinish = async (values) => {
    try {
      // Incluye el logo solo si hay una URL
      const finalValues = { ...values, logo: logoUrl || "" }; // Usa logoUrl si existe, sino una cadena vacía

      // Llama a la API para crear el usuario
      const nuevaTienda = await createUser(finalValues);
      if (nuevaTienda.response?.data.message === "Usuario ya existe") {
        return MENSAJES.ERROR("Usuario existente");
      }
      if (!nuevaTienda) {
        return MENSAJES.ERROR("Conexión Base de Datos");
      }

      // Obtén la lista actualizada de tiendas
      const tiendasTemporal = await getUsers();
      if (!tiendasTemporal) {
        return MENSAJES.ERROR("Conexión Base de Datos");
      }

      // Actualiza el estado de la lista de tiendas
      setListaTiendas(tiendasTemporal);
      MENSAJES.INFO(nuevaTienda[0].name);
    } catch (error) {
      console.error("Error en onFinish:", error);
    }
  };

  // Función para manejar el fallo del envío del formulario
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div style={{ height: "75vh", overflowY: "scroll" }}>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        className="w-full"
      >
        <Form.Item
          name="name"
          label="Propietario"
          className="p-4 flex items-center m-0"
          rules={[
            {
              required: true,
              message: "Por favor introduce tu Propietario",
              whitespace: true,
            },
          ]}
        >
          <Input_ant id="firstInputForm" />
        </Form.Item>
        <Form.Item
          name="email"
          label="E-mail"
          className="w-full p-4 flex items-center m-0"
          rules={[
            { type: "email", message: "El email no es válido" },
            { required: true, message: "Por favor introduce un email" },
          ]}
        >
          <Input_ant />
        </Form.Item>
        <Form.Item name="logo" label="Logo" className="w-full flex items-center m-0">
            <div style={{ display: "flex", alignItems: "center" }}>
              <Button type="default" size="large" onClick={handleUpload}>
                <FileAddOutlined /> Logo
              </Button>
              {logoUrl && (
                <img
                  src={logoUrl + `?${new Date().getTime()}`} // Forzar la recarga de la imagen
                  alt="Logo"
                  style={{ width: 200, height: 100, objectFit: 'contain'}}
                />
              )}
            </div>
          </Form.Item>
        <Form.Item
          name="nif"
          label="NIF"
          className="w-full p-4 flex items-center m-0"
        >
          <Input_ant />
        </Form.Item>
        <Form.Item
          name="info1"
          label="Info1"
          className="w-full p-4 flex items-center m-0"
        >
          <Input_ant />
        </Form.Item>
        <Form.Item
          name="info2"
          className="w-full p-4 flex items-center m-0"
          label="Info2"
        >
          <Input_ant className="" />
        </Form.Item>
        <Form.Item
          name="info3"
          className="w-full p-4 flex items-center m-0"
          label="Info3"
        >
          <Input_ant className="" />
        </Form.Item>
        <Form.Item
          name="password"
          className="w-full p-4 flex items-center m-0"
          label="Contraseña"
          rules={[{ required: true, whitespace: true, type: "password" }]}
        >
          <Input_ant className="" />
        </Form.Item>
        <Form.Item
          name="coefficient"
          label="Coeficiente"
          className="w-full p-4 flex items-center m-0"
          rules={[
            { required: true, message: "Por favor introduce un coeficiente" },
          ]}
        >
          <Input_ant className="" />
        </Form.Item>
        <Form.Item
          name="coefficientVenta"
          label="Coeficiente Venta"
          className="w-full p-4 flex items-center m-0"
          rules={[
            { required: true, message: "Por favor introduce un coeficiente" },
          ]}
        >
          <Input_ant className="" />
        </Form.Item>
        <Form.Item
          name="role"
          label="Rol"
          className="w-full p-4 flex items-center m-0"
          rules={[{ required: true, message: "Por favor introduce un rol" }]}
        >
          <Select
            defaultValue=""
            style={{ width: 150 }}
            options={[
              { value: "admin", label: "Administrador" },
              { value: "client", label: "Cliente" },
            ]}
          />
        </Form.Item>
        {[...Array(5).keys()].map((index) => (
          <Form.Item
            key={`observacion${index + 1}`}
            name={`observacion${index + 1}`}
            label={`Observacion${index + 1}`}
            className="w-full p-4 flex items-center m-0"
          >
            <Input_ant className="" />
          </Form.Item>
        ))}
        <Form.Item wrapperCol={{ offset: 14 }}>
          <Button
            className="bg-blue-600 text-white"
            type="default"
            htmlType="submit"
          >
            Crear
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};


const Admin = () => {
  const [listaTiendas, setListaTiendas] = useState([]);
  const [load, setLoad] = useState(true);
  const [pageSize, setPageSize] = useState(5);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [logoUrl, setLogoUrl] = useState("");
  const [form] = Form.useForm();

  const handleCancel = () => setOpen(false);

  const handleResize = () => {
    const windowHeight = window.innerHeight;
    const newRowHeight = 75;
    const newPageSize = Math.floor((windowHeight - 200) / newRowHeight);
    setPageSize(newPageSize);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (open && selectedUser) {
      setLogoUrl(selectedUser.logo);
      form.setFieldsValue({
        ...selectedUser,
        logo: selectedUser.logo, // Asegúrate de que la URL del logo se pase aquí si es necesario
      });
    }
  }, [open, selectedUser]);

  useEffect(() => {
    const fetchData = async () => {
      setLoad(true);
      try {
        const result = await getUsers();
        setListaTiendas(result);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoad(false);
      }
    };
    fetchData();
  }, []);

  const showModal = (user) => {
    if (user) {
      setSelectedUser(user);
      form.setFieldsValue({
        ...user,
        logo: user.logo, // Asegúrate de que la URL del logo se pase aquí si es necesario
      });
      setLogoUrl(user.logo); // Establecer la URL del logo en el estado
      setOpen(true);
    } else {
      console.error("User is undefined");
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setConfirmLoading(true);

      if (values.oldPassword && values.newPassword) {
        const resetResult = await resetPassword({
          email: selectedUser.email,
          password: values.newPassword,
        });
        if (resetResult.error) {
          message.error("Error al cambiar la contraseña");
          return;
        }
        message.success("Contraseña cambiada correctamente");
      }

      // Incluye la URL del logo en los valores a actualizar
      const updateResult = await updateUser({
        ...selectedUser,
        ...values,
        logo: logoUrl,
      });
      if (!updateResult) {
        message.error("Error al actualizar el usuario");
        return;
      }

      setListaTiendas((prevValues) =>
        prevValues.map((user) =>
          user._id === selectedUser._id
            ? { ...user, ...values, logo: logoUrl }
            : user
        )
      );
      message.success("Usuario actualizado correctamente");
      setOpen(false);
    } catch (error) {
      console.error("Failed to update user:", error);
    } finally {
      form.resetFields(["oldPassword", "newPassword"]);
      setConfirmLoading(false);
    }
  };

  const onDelete = async (item) => {
    setLoad(true);
    try {
      const result = await deleteUser(item);
      if (result) {
        setListaTiendas((prevValues) =>
          prevValues.filter((value) => value._id !== item._id)
        );
        message.success(`Usuario ${item.name} eliminado correctamente`);
      } else {
        message.error(`Error al eliminar el usuario ${item.name}`);
      }
    } catch (e) {
      console.error(e);
      message.error(`Error al eliminar el usuario ${item.name}`);
    } finally {
      setLoad(false);
    }
  };

  const columns = [
    {
      title: "Propietario",
      width: 100,
      dataIndex: "name",
      key: "name",
      fixed: "left",
    },
    { title: "Email", width: 100, dataIndex: "email", key: "email" },

    {
      title: "Acción",
      key: "operation",
      fixed: "right",
      width: 100,
      render: (text, record) => (
        <div className="flex flex-row justify-around">
          <Space>
            <Button type="default" onClick={() => showModal(record)}>
              Editar
            </Button>
          </Space>
          <Space>
            <Popconfirm
              title="¿Estás seguro de que deseas eliminar este reporte?"
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              onConfirm={() => onDelete(record)}
              okType="default"
              okText="Sí"
              cancelText="No"
            >
              <Button danger>Eliminar</Button>
            </Popconfirm>
          </Space>
        </div>
      ),
    },
  ];

  const validateEmail = (_, value) => {
    if (
      !value ||
      /^[^@]*[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
    ) {
      return Promise.resolve();
    }
    return Promise.reject(
      new Error("El email no es válido: no se permiten símbolos antes del @")
    );
  };

  const handleUpload = () => {
    const client = filestack.init("AXPWPBPSTvSKYoyHwByaaz");
    const options = {
      onUploadDone: async (file) => {
        const uploadedUrl = file.filesUploaded[0].url;
        setLogoUrl(uploadedUrl);
      },
      onFileUploadFailed: (error) => {
        console.error("Error en la carga del archivo:", error);
      },
    };
    const picker = client.picker(options);
    picker.open();
  };

  return (
    <main className="px-4 flex gap-4 flex-col">
      <Header actions={false} name={"Tiendas"} />
      <section className="grid grid-cols-[500px_1fr]">
        <ShopsForm setListaTiendas={setListaTiendas} />
        <Table
          columns={columns}
          dataSource={listaTiendas}
          loading={load}
          rowKey={"id"}
          pagination={{ pageSize }}
        />
      </section>
      <Modal
        title="Actualizar Usuario"
        centered
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okButtonProps={{
          style: { backgroundColor: "blue", borderColor: "blue" },
        }}
        styles={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
        mask={{ maxHeight: "70vh", overflowY: "auto" }}
      >
        <Form form={form} layout="vertical" name="userForm">
          <Form.Item
            name="name"
            label="Propietario"
            rules={[
              {
                required: true,
                message: "Por favor introduce tu Propietario",
                whitespace: true,
              },
            ]}
          >
            <Input_ant />
          </Form.Item>
          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              { type: "email", message: "El email no es valido" },
              { required: true, message: "Por favor introduce un email" },
              { validator: validateEmail, message: "Email no es valido" },
            ]}
          >
            <Input_ant />
          </Form.Item>

          <Form.Item name="logo" label="Logo" className="w-full">
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Button type="default" size="large" onClick={handleUpload}>
                <FileAddOutlined /> Logo
              </Button>
              {logoUrl && (
                <img
                  src={logoUrl + `?${new Date().getTime()}`} // Forzar la recarga de la imagen
                  alt="Logo"
                  style={{ width: 150, height: 120, objectFit: 'contain'}}
                />
              )}
            </div>
          </Form.Item>

          <Form.Item name="nif" label="NIF">
            <Input_ant />
          </Form.Item>
          <Form.Item
            name="info1"
            label="Info1"
            rules={[{ message: "Por favor introduce una localización" }]}
          >
            <Input_ant />
          </Form.Item>
          <Form.Item
            name="info2"
            label="Info2"
            rules={[
              {
                message: "Introduce un número de teléfono correcto",
              },
            ]}
          >
            <Input_ant className="" />
          </Form.Item>
          <Form.Item name="info3" label="Info3">
            <Input_ant />
          </Form.Item>
          <Form.Item
            name="coefficient"
            label="Coeficiente"
            rules={[
              {
                required: true,
                message: "Por favor introduce el coeficiente",
              },
            ]}
          >
            <Input_ant />
          </Form.Item>
          <Form.Item
            name="coefficientVenta"
            label="Coeficiente Venta"
            rules={[
              {
                required: true,
                message: "Por favor introduce el coeficiente",
              },
            ]}
          >
            <Input_ant />
          </Form.Item>

          <Form.Item name="oldPassword" label="Contraseña antigua">
            <Input_ant />
          </Form.Item>

          <Form.Item name="newPassword" label="Nueva contraseña">
            <Input_ant />
          </Form.Item>
        </Form>
      </Modal>
    </main>
  );
};

export { Admin };
