import {
  Table,
  message,
  Button,
  Space,
  Popconfirm,
  Typography,
  Card,
} from "antd";
import React, { useEffect, useState } from "react";
import { QuestionCircleOutlined } from "@ant-design/icons";
import {
  deleteComplements,
  getComplements,
  getComplementsByText,
} from "../../../handlers/order";
import { Header } from "../../content";
import { exportarArchivo } from "../../../utils/excel";

export const fetchData = async (setLoading, setData) => {
  try {
    setLoading(true);
    const result = await getComplements();

    if (!Array.isArray(result) || result.length === 0) {
      console.warn("No se encontraron datos");
      setData([]);
      return;
    }

    const newData = result.filter((el) => el.name);

    setData((prevData) => (JSON.stringify(prevData) !== JSON.stringify(newData) ? newData : prevData));
  } catch (error) {
    console.error("Error fetching orders:", error);
    setData([]);
  } finally {
    setLoading(false);
  }
};

const Encimeras = () => {
  const [data, setData] = useState([]);
  const [editado, setEditado] = useState(true);
  const [scrollY, setScrollY] = useState(500);

  useEffect(() => {
    fetchData(setEditado, setData);
  }, []);

  // Calculate dynamic height
  useEffect(() => {
    const calculateHeight = () => {
      const availableHeight = window.innerHeight - 300;
      setScrollY(availableHeight > 200 ? availableHeight : 200);
    };

    calculateHeight();
    window.addEventListener('resize', calculateHeight);
    return () => window.removeEventListener('resize', calculateHeight);
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

  const columns = [
    {
      title: "Referencia",
      dataIndex: "code",
      key: "code",
      width: 150,
    },
    {
      title: "Descripción",
      dataIndex: "name",
      key: "name",
      width: 400,
    },
    {
      title: "Tipo",
      dataIndex: "type",
      key: "type",
      width: 150,
    },
    {
      title: "Marca",
      dataIndex: "marca",
      key: "marca",
      width: 150,
    },
    {
      title: "Precio",
      dataIndex: "price",
      key: "price",
      width: 120,
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
            title="¿Estás seguro de que deseas eliminar este elemento?"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            onConfirm={() => onDelete(record)}
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
    <div style={{ height: "100%", display: "flex", flexDirection: "column", padding: "16px", overflow: "hidden" }}>
      <div style={{ flex: "0 0 auto" }}>
        <Header
          name={"Biblioteca"}
          input={true}
          getFilter={getFilterComplements}
          downloadFile={() => exportarArchivo(data)}
          showUploadButtons={true}
          setLoading={setEditado}
          setData={setData}
        />
      </div>
      <div style={{ flex: "1 1 auto", overflow: "hidden", marginTop: "16px" }}>
        <Card
          style={{
            borderRadius: "0",
            boxShadow: "none",
            height: "100%"
          }}
          styles={{ body: { padding: 0, height: "100%" } }}
          variant="borderless"
        >
          <Table
            bordered
            loading={editado}
            dataSource={data}
            rowKey={"_id"}
            columns={columns}
            pagination={{
              pageSize: 10,
              pageSizeOptions: ['10', '20', '50'],
              showSizeChanger: true,
              placement: ['bottomCenter'],
              style: { marginTop: 16, marginBottom: 0 }
            }}
            scroll={{ y: scrollY, x: 'max-content' }}
          />
        </Card>
      </div>
    </div>
  );
};

export default Encimeras;
