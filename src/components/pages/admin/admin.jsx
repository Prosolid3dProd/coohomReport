import React, { useContext, useEffect, useRef, useState } from "react";
import "../../../index.css";
import "./admin.css";
import {
  Button,
  Divider,
  Form,
  Input as Input_ant,
  Select,
  Row,
  Col,
  message,
  Popconfirm,
  Modal,
  Typography,
  Empty,
  Table,
  Checkbox,
  Space,
} from "antd";
import { Header } from "../../content";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Label, TablaModal } from "./../../content/modals";
import { archivedOrder } from "../../../handlers/order";
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

const onFinish = async (values, setListaTiendas) => {
  try {
    const nuevaTienda = await createUser(values);
    if (nuevaTienda.response?.data.message === "Usuario ya existe") {
      return MENSAJES.ERROR("Usuario existente");
    }
    if (!nuevaTienda) {
      return MENSAJES.ERROR("Conexión Base de Datos");
    }
    const tiendasTemporal = await getUsers();
    if (!tiendasTemporal) {
      return MENSAJES.ERROR("Conexión Base de Datos");
    }
    setListaTiendas(tiendasTemporal);
    MENSAJES.INFO(nuevaTienda[0].name);
  } catch (error) {
    console.error("Error en onFinish:", error);
  }
};

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const ShopsForm = ({ setListaTiendas }) => (
  <div style={{ height: "400px", overflowY: "scroll" }}>
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={(values) => onFinish(values, setListaTiendas)}
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
            message: "Porfavor introduce tu Propietario",
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
          { type: "email", message: "El email no es valido" },
          { required: true, message: "Porfavor introduce un email" },
        ]}
      >
        <Input_ant />
      </Form.Item>
      <Form.Item
        name="cif"
        label="CIF"
        className="w-full p-4 flex items-center m-0"
      >
        <Input_ant />
      </Form.Item>
      <Form.Item
        name="location"
        label="Info1"
        className="w-full p-4 flex items-center m-0"
      >
        <Input_ant />
      </Form.Item>
      <Form.Item
        name="phone"
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
          { required: true, message: "Porfavor introduce un coeficiente" },
        ]}
      >
        <Input_ant className="" />
      </Form.Item>
      <Form.Item
        name="role"
        label="Rol"
        className="w-full p-4 flex items-center m-0"
        rules={[{ required: true, message: "Porfavor introduce un rol" }]}
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
        <Button className="bg-blue text-white" type="default" htmlType="submit">
          Crear
        </Button>
      </Form.Item>
    </Form>
  </div>
);

const Admin = () => {
  const [listaTiendas, setListaTiendas] = useState([]);
  const [load, setLoad] = useState(true);
  const [pageSize, setPageSize] = useState(5);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
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
    const fetchData = async () => {
      setLoad(true);
      try {
        const result = await getUsers({});
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
      const filteredUser = {
        name: user.name,
        password: user.password,
        cif: user.cif,
        email: user.email,
        phone: user.phone,
        info3: user.info3,
        location: user.location,
        coefficient: user.coefficient,
        role: user.role,
        observacion1: user.observacion1,
        observacion2: user.observacion2,
        observacion3: user.observacion3,
        observacion4: user.observacion4,
        observacion5: user.observacion5,
      };
      form.setFieldsValue(filteredUser);
      setOpen(true);
    } else {
      console.error("User is undefined");
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setConfirmLoading(true);
      console.log(selectedUser.password);

      // Comprobar si la contraseña está en listaTiendas
      // const passwordExistsInStores = listaTiendas.some(store => store.password === selectedUser.password);
      // if (!passwordExistsInStores) {
      //   message.error("La contraseña del usuario seleccionado no coincide con ninguna tienda en la lista");
      //   setConfirmLoading(false);
      //   return;
      // }

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

      const updateResult = await updateUser({ ...selectedUser, ...values });
      if (!updateResult) {
        message.error("Error al actualizar el usuario");
        return;
      }

      setListaTiendas((prevValues) =>
        prevValues.map((user) =>
          user._id === selectedUser._id ? { ...user, ...values } : user
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
  return (
    <main className="overflow-y-scroll px-4 flex gap-4 flex-col">
      <Header actions={false} name={"Tiendas"} />
      <section className="grid grid-cols-[500px_1fr]">
        <ShopsForm setListaTiendas={setListaTiendas} />
        <Table
          columns={columns}
          dataSource={listaTiendas}
          loading={load}
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
        maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
        bodyStyle={{ maxHeight: "70vh", overflowY: "auto" }}
      >
        <Form form={form} layout="vertical" name="userForm">
          <Form.Item
            name="name"
            label="Propietario"
            rules={[
              {
                required: true,
                message: "Porfavor introduce tu Propietario",
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
              { required: true, message: "Porfavor introduce un email" },
              { validator: validateEmail, message: "Email no es valido" },
            ]}
          >
            <Input_ant />
          </Form.Item>
          <Form.Item name="cif" label="CIF">
            <Input_ant />
          </Form.Item>
          <Form.Item
            name="location"
            label="Info1"
            rules={[{ message: "Porfavor introduce un localizacion" }]}
          >
            <Input_ant />
          </Form.Item>
          <Form.Item
            name="phone"
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
              { required: true, message: "Porfavor introduce un coeficiente" },
            ]}
          >
            <Input_ant className="" />
          </Form.Item>
          <Form.Item
            name="role"
            label="Rol"
            rules={[{ required: true, message: "Porfavor introduce un rol" }]}
          >
            <Select
              defaultValue=""
              options={[
                { value: "admin", label: "Administrador" },
                { value: "client", label: "Cliente" },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="oldPassword"
            label="Contraseña Antigua"
            rules={[
              {
                required: false,
                message: "Porfavor introduce tu contraseña antigua",
                whitespace: true,
              },
            ]}
          >
            <Input_ant defaultValue={""} />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="Nueva Contraseña"
            rules={[
              {
                required: false,
                message: "Porfavor introduce tu nueva contraseña",
                whitespace: true,
              },
            ]}
          >
            <Input_ant defaultValue={""} />
          </Form.Item>
          {[...Array(5).keys()].map((index) => (
            <Form.Item
              key={`observacion${index + 1}`}
              name={`observacion${index + 1}`}
              label={`Observacion${index + 1}`}
            >
              <Input_ant className="" />
            </Form.Item>
          ))}
        </Form>
      </Modal>
    </main>
  );
};

export { Admin };
