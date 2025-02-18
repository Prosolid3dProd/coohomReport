import {
  Table,
  message,
  Button,
  Space,
  Popconfirm,
  Typography,
} from "antd";
import React, { useEffect, useState, useCallback } from "react";
import { QuestionCircleOutlined } from "@ant-design/icons";
import {
  deleteComplements,
  getComplements,
  getComplementsByText,
} from "../../../handlers/order";
import { Header } from "../../content";
import { exportarArchivo } from "../../content/logic/obtenerArchivoJson";

// ✅ Función para obtener datos de manera reutilizable
export const fetchData = async (setLoading, setData) => {
  try {
    setLoading(true);
    const result = await getComplements();
    const newData = Array.isArray(result) ? result.filter((el) => el.name) : [];

    setData((prevData) =>
      JSON.stringify(prevData) !== JSON.stringify(newData) ? newData : prevData
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    setData([]); // En caso de error, asegurar que el estado es un array vacío
  } finally {
    setLoading(false);
  }
};

const Encimeras = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(5);

  // ✅ Carga inicial de datos
  useEffect(() => {
    fetchData(setLoading, setData);
  }, []);

  // ✅ Manejo de tamaño de la tabla en función del viewport
  const handleResize = useCallback(() => {
    const windowHeight = window.innerHeight;
    const newRowHeight = 88;
    setPageSize(Math.floor((windowHeight - 200) / newRowHeight));
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  // ✅ Filtrar complementos por texto
  const getFilterComplements = async (params) => {
    setLoading(true);
    try {
      const result = await getComplementsByText(params);
      if (result && result.length > 0) {
        setData(result);
      } else {
        message.error("No se encontraron resultados");
        fetchData(setLoading, setData);
      }
    } catch (error) {
      console.error("Error filtering orders:", error);
    }
    setLoading(false);
  };

  // ✅ Eliminar un complemento
  const onDelete = async (item) => {
    setLoading(true);
    try {
      const result = await deleteComplements(item);
      if (result) {
        setData((prev) => prev.filter((value) => value._id !== item._id));
        message.success(`${item.code} eliminado correctamente`);
      } else {
        message.error(`Error al eliminar ${item.code}`);
      }
    } catch (error) {
      console.error("Error deleting complement:", error);
      message.error(`Error al eliminar ${item.code}`);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Definición de columnas de la tabla
  const columns = [
    { title: "Referencia", dataIndex: "code", key: "code" },
    { title: "Descripción", dataIndex: "name", key: "name", width: 720 },
    { title: "Tipo", dataIndex: "type", key: "type" },
    { title: "Marca", dataIndex: "marca", key: "marca" },
    {
      title: "Precio",
      dataIndex: "price",
      key: "price",
      render: (text) => parseFloat(text).toFixed(2),
    },
    {
      title: "Acciones",
      key: "actions",
      fixed: "right",
      width: 110,
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="¿Seguro que deseas eliminar este complemento?"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            onConfirm={() => onDelete(record)}
            okText="Sí"
            cancelText="No"
          >
            <Typography.Link>
              <Button danger>Eliminar</Button>
            </Typography.Link>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <main className="flex flex-col px-4">
      <Header
        name="Biblioteca"
        input
        getFilter={getFilterComplements}
        downloadFile={() => exportarArchivo(data)}
        showUploadButtons
        setLoading={setLoading}
        setData={setData}
      />
      <Table
        className="border border-t-0 border-border mx-3 relative"
        loading={loading}
        dataSource={data}
        rowKey="_id"
        pagination={{ pageSize }}
        columns={columns}
      />
    </main>
  );
};

export default Encimeras;
