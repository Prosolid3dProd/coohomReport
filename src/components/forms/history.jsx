import React, { useEffect, useState, useCallback } from "react";
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
  const creationalDate = new Date(creacionPresupuesto);
  const actualDate = new Date();

  const esMismoDia = (date1, date2) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const creadoHoy = esMismoDia(actualDate, creationalDate);
  const diffTiempo = creadoHoy
    ? 0
    : Math.ceil(Math.abs(actualDate - creationalDate) / (1000 * 3600 * 24));
  return [diffTiempo, creadoHoy];
};

const History = () => {
  let columns = [];
  const [initialValues, setInitialValues] = useState([]);
  const [load, setLoad] = useState(true);
  const [pageSize, setPageSize] = useState(5);
  const navigate = useNavigate();

  const onDelete = async (item) => {
    setLoad(true);
    try {
      const result = await archivedOrder(item);
      if (result) {
        setInitialValues((prevValues) =>
          prevValues.filter((value) => value._id !== item._id)
        );
        message.success(`Pedido ${item.orderCode} eliminado correctamente`);
        setLoad(false);
      } else {
        message.error(`Error al eliminar el pedido ${item.orderCode}`);
      }
    } catch (e) {
      console.log(e);
      message.error(`Error al eliminar el pedido ${item.orderCode}`);
    }
  };

  const onNavigate = async (item) => {
    try {
      const result = await getOrderById({
        _id: item._id,
      });
      fixOrder(result, 0 ,() => {
        navigate("/Dashboard/Report/", {
          replace: true,
        });
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoad(true);
        const result = await getOrders({});
        if (Array.isArray(result)) {
          result.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
          setInitialValues(result);
        } else {
          console.error("Error: getOrders() did not return an array.");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoad(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const windowHeight = window.innerHeight;
      const newRowHeight = 108;
      const newPageSize = Math.floor((windowHeight - 200) / newRowHeight);
      setPageSize(newPageSize);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  initialValues &&
    initialValues.map(() => {
      columns = [
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
          render: (text, record) => (
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
    });

  return (
    <div className="flex flex-col overflow-y-scroll">
      <div className="px-4">
        <Header
          actions={true}
          addFile={(e) => {
            return e;
          }}
          name={"Listado"}
          setLoading={setLoad}
          setData={setInitialValues}
          data={initialValues}
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
            dataSource={initialValues}
            columns={columns}
            pagination={{ pageSize }}
          ></Table>
        </Card>
      </article>
    </div>
  );
};

export { History };
