import { useEffect, useState } from "react";
import * as filestack from "filestack-js";
import "../../../index.css";
import "./admin.css";
import {
  Button,
  Form,
  message,
  Popconfirm,
  Modal,
  Table,
  Space,
} from "antd";
import { Header } from "../../content";
import { getUsers, deleteUser, updateUser } from "../../../handlers/user";
import CreateUserModal from "./CreateUserModal";
import UserFormFields from "./UserFormFields";

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
      const availableHeight =
        windowHeight - 65 - 42 - 32 - 55;
      setPageSize(Math.max(1, Math.floor(availableHeight / 122)));
      const totalColumnWidth = 150 + 200 + 120 + 100 + 100 + 100 + 100 + 200;
      setTableScrollX(Math.max(800, Math.min(totalColumnWidth, windowWidth - 32)));
    };
    updateTableDimensions();
    window.addEventListener("resize", updateTableDimensions);
    return () => window.removeEventListener("resize", updateTableDimensions);
  }, []);

  const handleUpload = () => {
    const client = filestack.init(import.meta.env.VITE_FILESTACK_KEY);
    client.picker({
      onUploadDone: (file) => setLogoUrl(file.filesUploaded[0].url),
    }).open();
  };

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
      password: "",
    });
    setEditModalOpen(true);
  };

  const handleEditOk = async () => {
    try {
      const values = await form.validateFields();
      const updatedUserData = { ...selectedUser, ...values, logo: logoUrl };
      if (!values.password) delete updatedUserData.password;
      const updatedUser = await updateUser(updatedUserData);
      if (updatedUser) {
        setListaTiendas(await getUsers());
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
      setListaTiendas((prev) => prev.filter((user) => user._id !== item._id));
      message.success("Usuario eliminado correctamente");
    } catch {
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
      render: (text) =>
        text && (
          <img
            src={text}
            alt="logo"
            style={{ width: 50, height: 50, objectFit: "contain" }}
          />
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

  return (
    <main style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16, height: "100vh" }}>
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
          pageSize,
          defaultPageSize: pageSize,
          showSizeChanger: true,
          pageSizeOptions: Array.from(
            { length: 5 },
            (_, i) => (i + 1) * Math.max(1, Math.floor(pageSize / 2))
          ).map(String),
          total: listaTiendas.length,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} de ${total} usuarios`,
          position: ["bottomRight"],
        }}
        scroll={{ x: tableScrollX }}
      />

      <CreateUserModal
        open={createModalOpen}
        setOpen={setCreateModalOpen}
        onCreated={setListaTiendas}
      />

      <Modal
        title="Editar Usuario"
        open={editModalOpen}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        width={800}
      >
        <Form form={form} layout="vertical">
          <UserFormFields
            logoUrl={logoUrl}
            onUploadLogo={handleUpload}
            isEdit
          />
        </Form>
      </Modal>
    </main>
  );
};

export { Admin };
