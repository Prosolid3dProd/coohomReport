import {
  Table,
  message,
  Button,
  Space,
  Popconfirm,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { QuestionCircleOutlined } from "@ant-design/icons";
import {
  deleteComplements,
  getComplements,
  getComplementsByText,
} from "../../../handlers/order";
import { Header } from "../../content";
import { exportarArchivo } from "../../content/logic/obtenerArchivoJson";

export const fetchData = async (setLoading, setData) => {
  try {
    setLoading(true);
    const result = await getComplements();

    if (!Array.isArray(result) || result.length === 0) {
      console.warn("No se encontraron datos");
      setData([]); // Setear como [] solo si no hay datos
      return;
    }

    const newData = result.filter((el) => el.name); // Filtrar solo con nombre definido

    setData((prevData) => (JSON.stringify(prevData) !== JSON.stringify(newData) ? newData : prevData));
  } catch (error) {
    console.error("Error fetching orders:", error);
    setData([]); // Asegurar que en caso de error, el estado es un array vacío
  } finally {
    setLoading(false);
  }
};

const Encimeras = () => {
  const [data, setData] = useState([]);
  const [editado, setEditado] = useState(true);
  const [pageSize, setPageSize] = useState(5);
  
  useEffect(() => {
    fetchData(setEditado, setData);
  }, []);

  const handleResize = () => {
      const windowHeight = window.innerHeight;
      const newRowHeight = 88;
      const newPageSize = Math.floor((windowHeight - 200) / newRowHeight);
      setPageSize(newPageSize);
    };
  
    useEffect(() => {
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

  const getFilterComplements = async (params) => {
    setEditado(true);
    try {
      const result = await getComplementsByText(params);
      if (result && result.length > 0) setData(result);
      else {
        message.error("No se encontraron resultados");
        fetchData(setEditado, setData);
      }
    } catch (error) {
      console.error("Error filtering orders:", error);
    }
    setEditado(false);
  };

  const onDelete = async (item) => {
    setEditado(true);
    try {
      const result = await deleteComplements(item);
      if (result) {
        setData((prevValues) =>
          prevValues.filter((value) => value._id !== item._id)
        );
        message.success(`${item.code} eliminado correctamente`);
        setEditado(false);
      } else {
        message.error(`Error al eliminar ${item.code}`);
      }
    } catch (e) {
      console.log(e);
      message.error(`Error al eliminar ${item.code}`);
    }
  };
  
  let columns = [
    {
      title: "Referencia",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Descripcion",
      dataIndex: "name",
      key: "name",
      width: 720,
    },
    {
      title: "Tipo",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Marca",
      dataIndex: "marca",
      key: "marca",
    },
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
      render: (text, record) => (
        <Space>
          <Popconfirm
            title="¿Estás seguro de que deseas eliminar este reporte?"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            onConfirm={() => onDelete(record)}
            onCancel={() => {}}
            okType="default"
            okText="Si"
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
        name={"Biblioteca"}
        input={true}
        getFilter={getFilterComplements}
        downloadFile={() => exportarArchivo(data)}
        showUploadButtons={true}
        setLoading={setEditado}
        setData={setData}
      />
      <Table
        className="border border-t-0 border-border mx-3 relative"
        loading={editado}
        dataSource={data}
        rowKey={"_id"}
        pagination={{pageSize}}
        searchable
        columns={columns}
      />
    </main>
  );
};

export default Encimeras;
