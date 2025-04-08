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
  Row,
  Col,
} from "antd";
import { Header } from "../../content";
import { QuestionCircleOutlined } from "@ant-design/icons";
import {
  createUser,
  getUsers,
  deleteUser,
  updateUser,
} from "../../../handlers/user";

const { Option } = Select;
const { success, info, error } = message;

const MENSAJES = {
  SUCCESS: () => success("Se ha actualizado Correctamente"),
  INFO: (nombreTienda) => info(`Nueva Tienda: ${nombreTienda}`),
  ERROR: (problema) => error(`Error: ${problema}`),
  DELETE: (nombreTienda) => info(`Se ha eliminado la Tienda: ${nombreTienda}`),
};

const ShopsForm = ({ setListaTiendas, open, setOpen }) => {
  const [logoUrl, setLogoUrl] = useState("");
  const [form] = Form.useForm();

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

  const onFinish = async (values) => {
    try {
      const finalValues = { ...values, logo: logoUrl || "" };
      const nuevaTienda = await createUser(finalValues);
      if (nuevaTienda.response?.data.message === "Usuario ya existe") {
        return MENSAJES.ERROR("Usuario existente");
      }
      if (!nuevaTienda) {
        return MENSAJES.ERROR("Conexión Base de Datos");
      }
      const tiendasTemporal = await getUsers();
      setListaTiendas(tiendasTemporal);
      MENSAJES.INFO(nuevaTienda[0].name);
      setOpen(false);
      form.resetFields();
      setLogoUrl("");
    } catch (error) {
      console.error("Error en onFinish:", error);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
    setLogoUrl("");
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
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="name" label="Propietario" rules={[{ required: true }]}>
              <Input_ant autoComplete="off" />
            </Form.Item>
            <Form.Item name="email" label="E-mail" rules={[{ required: true, type: "email" }]}>
              <Input_ant autoComplete="off" />
            </Form.Item>
            <Form.Item name="nif" label="NIF">
              <Input_ant autoComplete="off" />
            </Form.Item>
            <Form.Item name="info1" label="Info1">
              <Input_ant autoComplete="off" />
            </Form.Item>
            <Form.Item name="coefficient" label="Coeficiente" rules={[{ required: true }]}>
              <Input_ant autoComplete="off" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="logo" label="Logo">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Button type="default" onClick={handleUpload}>
                  <FileAddOutlined /> Logo
                </Button>
                {logoUrl && (
                  <img
                    src={logoUrl}
                    alt="Logo"
                    style={{ width: 100, height: 100, objectFit: "contain" }}
                  />
                )}
              </div>
            </Form.Item>
            <Form.Item name="password" label="Contraseña" rules={[{ required: true }]}>
              <Input_ant.Password autoComplete="new-password" />
            </Form.Item>
            <Form.Item name="role" label="Rol" rules={[{ required: true }]}>
              <Select>
                <Option value="admin">Administrador</Option>
                <Option value="client">Cliente</Option>
              </Select>
            </Form.Item>
            <Form.Item name="coefficientVenta" label="Coef. Venta">
              <Input_ant autoComplete="off" />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Crear Usuario
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

const Admin = () => {
  const [listaTiendas, setListaTiendas] = useState([]);
  const [load, setLoad] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [logoUrl, setLogoUrl] = useState("");
  const [pageSize, setPageSize] = useState(6);
  const [tableScrollX, setTableScrollX] = useState(1500);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      setLoad(true);
      try {
        const result = await getUsers();
        setListaTiendas(result);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoad(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const updateTableDimensions = () => {
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;
      
      const headerHeight = 65;
      const buttonHeight = 42;
      const paddingAndGaps = 32;
      const paginationHeight = 55;
      const availableHeight = windowHeight - headerHeight - buttonHeight - paddingAndGaps - paginationHeight;
      const rowHeight = 122;
      const calculatedPageSize = Math.max(1, Math.floor(availableHeight / rowHeight));
      setPageSize(calculatedPageSize);

      const totalColumnWidth = 150 + 200 + 120 + 100 + 100 + 100 + 100 + 200;
      const minScrollX = 800;
      const calculatedScrollX = Math.max(minScrollX, Math.min(totalColumnWidth, windowWidth - 32));
      setTableScrollX(calculatedScrollX);
    };

    updateTableDimensions();
    window.addEventListener("resize", updateTableDimensions);
    return () => window.removeEventListener("resize", updateTableDimensions);
  }, []);

  const showEditModal = (user) => {
    setSelectedUser(user);
    setLogoUrl(user.logo || "");
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      nif: user.nif,
      info1: user.info1,
      coefficient: user.coefficient,
      info2: user.info2,
      info3: user.info3,
      coefficientVenta: user.coefficientVenta,
      role: user.role,
      password: "", // No cargamos la contraseña actual por seguridad
    });
    setEditModalOpen(true);
  };

  const handleEditOk = async () => {
    try {
      const values = await form.validateFields();
      const updatedUserData = {
        ...selectedUser,
        ...values,
        logo: logoUrl,
      };
      // Solo incluir password si se ingresó un valor
      if (!values.password) {
        delete updatedUserData.password; // Evitar enviar contraseña vacía
      }
      const updatedUser = await updateUser(updatedUserData);
      
      if (updatedUser) {
        const tiendasTemporal = await getUsers(); // Recargar desde el servidor
        setListaTiendas(tiendasTemporal);
        setEditModalOpen(false);
        setSelectedUser(null);
        setLogoUrl("");
        form.resetFields();
        message.success("Usuario actualizado correctamente");
      } else {
        throw new Error("No se recibió respuesta válida del servidor");
      }
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      message.error("Error al actualizar usuario");
    }
  };

  const handleEditCancel = () => {
    setEditModalOpen(false);
    form.resetFields();
    setLogoUrl("");
    setSelectedUser(null);
  };

  const onDelete = async (item) => {
    try {
      await deleteUser(item);
      setListaTiendas(prev => prev.filter(user => user._id !== item._id));
      message.success("Usuario eliminado correctamente");
    } catch (error) {
      message.error("Error al eliminar usuario");
    }
  };

  const columns = [
    { title: "Propietario", dataIndex: "name", key: "name", width: 150 },
    { title: "Email", dataIndex: "email", key: "email", width: 200 },
    { title: "NIF", dataIndex: "nif", key: "nif", width: 120 },
    { title: "Rol", dataIndex: "role", key: "role", width: 100 },
    { title: "Coeficiente", dataIndex: "coefficient", key: "coefficient", width: 100 },
    { title: "Coef. Venta", dataIndex: "coefficientVenta", key: "coefficientVenta", width: 100 },
    {
      title: "Logo",
      dataIndex: "logo",
      key: "logo",
      width: 100,
      render: (text) => text && (
        <img src={text} alt="logo" style={{ width: 50, height: 50, objectFit: "contain" }} />
      ),
    },
    {
      title: "Acción",
      key: "action",
      width: 200,
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => showEditModal(record)}>
            Editar
          </Button>
          <Popconfirm
            title="¿Seguro que quieres eliminar este usuario?"
            onConfirm={() => onDelete(record)}
          >
            <Button danger>Eliminar</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleUpload = () => {
    const client = filestack.init("AXPWPBPSTvSKYoyHwByaaz");
    const options = {
      onUploadDone: async (file) => {
        setLogoUrl(file.filesUploaded[0].url);
      },
    };
    const picker = client.picker(options);
    picker.open();
  };

  return (
    <main className="px-4 py-4 flex flex-col gap-4 h-screen">
      <Header actions={false} name={"Tiendas"} />
      <Button 
        type="primary" 
        onClick={() => setCreateModalOpen(true)}
        style={{ width: "200px" }}
      >
        Crear Nuevo Usuario
      </Button>
      
      <Table
        columns={columns}
        dataSource={listaTiendas}
        loading={load}
        rowKey="_id"
        pagination={{
          pageSize: pageSize,
          defaultPageSize: pageSize,
          showSizeChanger: true,
          pageSizeOptions: Array.from(
            { length: 5 },
            (_, i) => (i + 1) * Math.max(1, Math.floor(pageSize / 2))
          ).map(String),
          total: listaTiendas.length,
          showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} usuarios`,
          position: ['bottomRight'],
        }}
        scroll={{ x: tableScrollX }}
      />

      <ShopsForm 
        setListaTiendas={setListaTiendas}
        open={createModalOpen}
        setOpen={setCreateModalOpen}
      />
      
      <Modal
        title="Editar Usuario"
        open={editModalOpen}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="Propietario" rules={[{ required: true }]}>
                <Input_ant />
              </Form.Item>
              <Form.Item name="email" label="E-mail" rules={[{ required: true, type: "email" }]}>
                <Input_ant />
              </Form.Item>
              <Form.Item name="nif" label="NIF">
                <Input_ant />
              </Form.Item>
              <Form.Item name="info1" label="Info1">
                <Input_ant />
              </Form.Item>
              <Form.Item name="coefficient" label="Coeficiente" rules={[{ required: true }]}>
                <Input_ant />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="logo" label="Logo">
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Button type="default" onClick={handleUpload}>
                    <FileAddOutlined /> Logo
                  </Button>
                  {logoUrl && (
                    <img
                      src={logoUrl}
                      alt="Logo"
                      style={{ width: 100, height: 100, objectFit: "contain" }}
                    />
                  )}
                </div>
              </Form.Item>
              <Form.Item name="password" label="Contraseña">
                <Input_ant.Password autoComplete="new-password" placeholder="Nueva contraseña (opcional)" />
              </Form.Item>
              <Form.Item name="coefficientVenta" label="Coef. Venta">
                <Input_ant />
              </Form.Item>
              <Form.Item name="role" label="Rol" rules={[{ required: true }]}>
                <Select>
                  <Option value="admin">Administrador</Option>
                  <Option value="client">Cliente</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </main>
  );
};

export { Admin };