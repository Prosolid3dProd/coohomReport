import { useEffect, useState, useCallback } from "react";
import { getDiferenciaDias } from "../../shared/lib/date";
import { useOrder } from "../../context";
import { QuestionCircleOutlined } from "@ant-design/icons";
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
import { getOrders, archivedOrder } from "../../handlers/order";
import { Header } from "../content";

const calculatePageSize = () => {
  const available = window.innerHeight - 250;
  const size = Math.floor(available / 80);
  return isNaN(size) || size < 5 ? 5 : size;
};

const History = () => {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: calculatePageSize(),
    total: 0,
  });
  const navigate = useNavigate();
  const { setActiveOrder } = useOrder();

  const fetchData = useCallback(async (page = 1, pageSize = pagination.pageSize) => {
    setLoad(true);
    try {
      const result = await getOrders({ page, limit: pageSize });
      if (result?.data) {
        setData(result.data);
        setPagination((prev) => ({
          ...prev,
          current: result.page,
          pageSize,
          total: result.total,
        }));
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoad(false);
    }
  }, []);

  useEffect(() => {
    const newPageSize = calculatePageSize();
    fetchData(1, newPageSize);

    const handleResize = () => {
      const ps = calculatePageSize();
      setPagination((prev) => ({ ...prev, pageSize: ps }));
      fetchData(1, ps);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [fetchData]);

  const onDelete = async (item) => {
    setLoad(true);
    try {
      const result = await archivedOrder(item);
      if (result) {
        message.success(`Pedido ${item.orderCode} eliminado correctamente`);
        fetchData(pagination.current, pagination.pageSize);
      } else {
        message.error(`Error al eliminar el pedido ${item.orderCode}`);
      }
    } catch {
      message.error(`Error al eliminar el pedido ${item.orderCode}`);
    } finally {
      setLoad(false);
    }
  };

  const onNavigate = async (item) => {
    try {
      await setActiveOrder(item._id);
      navigate("/Dashboard/Report/", { replace: true });
    } catch (e) {
      console.error(e);
    }
  };

  const getFilterComplements = async (params) => {
    setLoad(true);
    try {
      const search =
        params?.text && typeof params.text === "string"
          ? params.text.trim()
          : "";
      const result = await getOrders({
        page: 1,
        limit: pagination.pageSize,
        search,
      });
      if (result?.data) {
        setData(result.data);
        setPagination((prev) => ({
          ...prev,
          current: result.page,
          total: result.total,
        }));
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
                <span style={{ fontSize: 16 }}>
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
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="¿Estás seguro de que deseas eliminar este reporte?"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            onConfirm={() => onDelete(record)}
            okText="Si"
            cancelText="No"
          >
            <Button danger>Eliminar</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "0 16px" }}>
        <Header
          name={"Listado"}
          setLoading={setLoad}
          setData={setData}
          data={data}
          input={true}
          getFilter={getFilterComplements}
          addFile={(e) => e}
        />
      </div>
      <article style={{ borderRadius: 0, position: "relative", overflowX: "hidden" }}>
        <Card style={{ border: "none" }}>
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
              onChange: (page, pageSize) => fetchData(page, pageSize),
            }}
          />
        </Card>
      </article>
    </div>
  );
};

export { History };