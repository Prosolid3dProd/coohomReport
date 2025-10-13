import React, { useEffect, useState } from "react";
import { QuestionCircleOutlined } from "@ant-design/icons";
import "./../../index.css";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Typography,
  Popconfirm,
  Space,
  Tag,
  Card,
  message,
  Table,
} from "antd";
import {
  getOrders,
  getOrderById,
  fixOrder,
  archivedOrder,
} from "../../handlers/order"; 
import { Header } from "../content"; 

const getDiferenciaDias = (creacionPresupuesto) => {
  if (!creacionPresupuesto) return [0, false];
  const creationalDate = new Date(creacionPresupuesto);
  if (isNaN(creationalDate)) return [0, false];
  const actualDate = new Date();
  const esMismoDia = (d1, d2) =>
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();
  const creadoHoy = esMismoDia(actualDate, creationalDate);
  const diffTiempo = creadoHoy
    ? 0
    : Math.ceil(Math.abs(actualDate - creationalDate) / (1000 * 3600 * 24));
  return [diffTiempo, creadoHoy];
};

const History = () => {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const navigate = useNavigate();

  // eliminar
  const onDelete = async (item) => {
    setLoad(true);
    try {
      const result = await archivedOrder(item);
      if (result) {
        message.success(`Pedido ${item.orderCode} eliminado correctamente`);
        fetchData(pagination.current, pagination.pageSize); // recargar la página actual
      } else {
        message.error(`Error al eliminar el pedido ${item.orderCode}`);
      }
    } catch (e) {
      message.error(`Error al eliminar el pedido ${item.orderCode}`);
    } finally {
      setLoad(false);
    }
  };

  // navegar
  const onNavigate = async (item) => {
    try {
      const result = await getOrderById({ _id: item._id });
      fixOrder(result, 0, () => {
        navigate("/Dashboard/Report/", { replace: true });
      });
    } catch (e) {
      console.log(e);
    }
  };

 // función que calcula pageSize dinámico
// calcula el número de filas visibles según la pantalla
const calculatePageSize = () => {
  const windowHeight = window.innerHeight;

  // margen reservado para header, paddings, etc.
  const reservedSpace = 250; 

  // alto estimado de cada fila de la tabla (ajústalo a tu diseño)
  const rowHeight = 80; 

  let newPageSize = Math.floor((windowHeight - reservedSpace) / rowHeight);

  // asegurar que nunca se queda demasiado pequeño
  if (isNaN(newPageSize) || newPageSize < 5) {
    newPageSize = 5;
  }

  return newPageSize;
};


const fetchData = async (page = 1, pageSize = pagination.pageSize) => {
  try {
    setLoad(true);
    const result = await getOrders({ page, limit: pageSize });
    if (result?.data) {
      setData(result.data);
      setPagination({
        current: result.page,
        pageSize: pageSize, // usamos el dinámico
        total: result.total,
      });
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
  } finally {
    setLoad(false);
  }
};

useEffect(() => {
  const handleResize = () => {
    const newPageSize = calculatePageSize();
    setPagination({pagesize:newPageSize});

    // opcional: recargar datos con el nuevo pageSize
    fetchData(1, newPageSize);
  };

  handleResize(); // inicial
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);


 const getFilterComplements = async (params) => {
  try {
    setLoad(true);
    const searchTerm =
      params && params.text && typeof params.text === "string"
        ? params.text.trim()
        : "";

    // 👇 le pasamos el término de búsqueda al backend
    const result = await getOrders({
      page: 1,
      limit: pagination.pageSize,
      search: searchTerm,
    });

    if (result?.data) {
      setData(result.data);
      setPagination({
        current: result.page,
        pageSize: pagination.pageSize,
        total: result.total,
      });
    } else {
      setData([]);
      message.warning("No se encontraron resultados");
    }
  } catch (error) {
    console.error("Error filtrando las órdenes:", error);
  } finally {
    setLoad(false);
  }
};

  const columns = [
    {
      title: "Ordén",
      dataIndex: "orderCode",
      key: "orderCode",
      width: 180,
      render: (text, record) => (
        <Space>
          <Button type="link" style={{ marginTop: 10 }}>
            <Typography.Link onClick={() => onNavigate(record)}>
              <Tag color="blue">
                <span className="hover:underline text-smd lg:text-md">
                  {text || "Sin especificar"}
                </span>
              </Tag>
            </Typography.Link>
          </Button>
        </Space>
      ),
    },
    {
      title: "Diseñador",
      dataIndex: "designerName",
      key: "designerName",
      width: 120,
    },
    {
      title: "Tienda",
      dataIndex: "storeName",
      key: "storeName",
      width: 150,
    },
    {
      title: "Proyecto",
      dataIndex: "projectName",
      key: "projectName",
      width: 150,
    },
    {
      title: "Cliente",
      dataIndex: "customerName",
      key: "customerName",
      width: 200,
      render: (text, record) => (
        <span>
          {text} <br /> {record.phone || "Sin especificar"}
        </span>
      ),
    },
    {
      title: "Fecha de creación",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (text) => (
        <span>
          {new Date(text).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
          <br />
          {getDiferenciaDias(text)[1]
            ? "Creado Hoy"
            : `Creado hace ${getDiferenciaDias(text)[0]} días`}
        </span>
      ),
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
    <div className="flex flex-col ">
      <div className="px-4">
        <Header
          actions={true}
          name={"Listado"}
          setLoading={setLoad}
          setData={setData}
          data={data}
          input={true}
          getFilter={getFilterComplements}
          addFile={(e) => e}
        />
      </div>
      <article className="border-none rounded-none relative overflow-x-hidden">
        <Card className="border-none">
          <Table
            style={{
              borderBottom: "1px solid #e8e8e8",
              borderLeft: "1px solid #e8e8e8",
              borderRight: "1px solid #e8e8e8",
            }}
            loading={load}
            dataSource={Array.isArray(data) ? data : []}
            columns={columns}
            rowKey="_id"
            pagination={{
              ...pagination,
              onChange: (page, pageSize) => {
                fetchData(page, pageSize);
              },
            }}
          />
        </Card>
      </article>
    </div>
  );
};

export { History };
