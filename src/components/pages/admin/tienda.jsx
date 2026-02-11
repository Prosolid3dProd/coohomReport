import {
    message,
    Row,
    Col,
    Empty,
    Spin,
} from "antd";
import React, { useEffect, useState, useCallback } from "react";
import { getUsers, deleteUser, createUser, updateUser } from "../../../handlers/user";
import { Header } from "../../content";
import UserCard from "./components/UserCard";
import UserForm from "./components/UserForm";
import { useUser } from "../../../context/UserContext";

const Tiendas = () => {
    const { user: currentUser, refreshUser } = useUser();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const result = await getUsers();
            setData(Array.isArray(result) ? result : []);
        } catch (error) {
            console.error("Error fetching users:", error);
            setData([]);
            message.error("Error al obtener usuarios");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const getFilterUsers = useCallback(async (params) => {
        setLoading(true);
        try {
            const searchTerm = params?.text?.trim() || "";
            const result = await getUsers({ search: searchTerm });

            if (Array.isArray(result)) {
                setData(result);
            } else {
                setData([]);
                message.warning("No se encontraron resultados");
            }
        } catch (error) {
            console.error("Error filtrando usuarios:", error);
            message.error("Error al filtrar");
        } finally {
            setLoading(false);
        }
    }, []);

    const handleDelete = useCallback(async (item) => {
        setLoading(true);
        try {
            const result = await deleteUser({ _id: item._id });
            if (result) {
                setData(prev => prev.filter(u => u._id !== item._id));
                message.success(`${item.name} eliminado correctamente`);
            } else {
                message.error(`Error al eliminar ${item.name}`);
            }
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
            message.error(`Error al eliminar ${item.name}`);
        } finally {
            setLoading(false);
        }
    }, []);

    // Handlers for Form
    const handleCreate = useCallback(() => {
        setSelectedUser(null);
        setModalOpen(true);
    }, []);

    const handleEdit = useCallback((user) => {
        setSelectedUser(user);
        setModalOpen(true);
    }, []);

    const handleFormFinish = async (values) => {
        try {
            if (selectedUser) {
                // Update
                const updatedUserData = { ...selectedUser, ...values };
                const result = await updateUser(updatedUserData);
                if (result) {
                    message.success("Usuario actualizado correctamente");
                    // If we updated ourselves, refresh the global context
                    if (currentUser && currentUser._id === updatedUserData._id) {
                        await refreshUser();
                    }
                } else {
                    throw new Error("Update failed");
                }
            } else {
                // Create
                const result = await createUser(values);
                if (result.response?.data?.message === "Usuario ya existe") {
                    message.error("Usuario ya existe");
                    return;
                }
                if (result) {
                    message.success(`Usuario creado: ${values.name}`);
                } else {
                    throw new Error("Create failed");
                }
            }

            await fetchData();
            setModalOpen(false);
            setSelectedUser(null);

        } catch (error) {
            console.error("Error in form submit:", error);
            message.error("Error al guardar usuario");
        }
    };

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", padding: "16px", overflow: "hidden" }}>
            <div style={{ flex: "0 0 auto" }}>
                <Header
                    name="Tiendas"
                    input
                    getFilter={getFilterUsers}
                    setLoading={setLoading}
                    setData={setData}
                    data={data}
                    funcion={handleCreate}
                    buttonText="Crear Usuario"
                />
            </div>

            <div style={{ flex: "1 1 auto", overflow: "auto", marginTop: "16px", padding: "8px" }}>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <Spin size="large" />
                    </div>
                ) : data.length === 0 ? (
                    <Empty description="No hay usuarios" />
                ) : (
                    <Row gutter={[16, 16]}>
                        {data.map(user => (
                            <Col xs={24} sm={12} md={8} lg={6} xl={6} key={user._id}>
                                <UserCard
                                    user={user}
                                    onDelete={handleDelete}
                                    onEdit={handleEdit}
                                />
                            </Col>
                        ))}
                    </Row>
                )}
            </div>

            <UserForm
                open={modalOpen}
                onCancel={() => {
                    setModalOpen(false);
                    setSelectedUser(null);
                }}
                onFinish={handleFormFinish}
                initialValues={selectedUser}
            />
        </div>
    );
};

export default Tiendas;
