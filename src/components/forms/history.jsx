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
} from "../../handlers/order"; // Importa los handlers para manejar peticiones relacionadas con órdenes.
import { Header } from "../content"; // Componente de encabezado.

const getDiferenciaDias = (creacionPresupuesto) => {
  const creationalDate = new Date(creacionPresupuesto); // Convierte la fecha de creación en un objeto Date.
  const actualDate = new Date(); // Obtiene la fecha actual.

  // Función para verificar si dos fechas son el mismo día.
  const esMismoDia = (date1, date2) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const creadoHoy = esMismoDia(actualDate, creationalDate); // Determina si la fecha de creación es hoy.
  // Calcula la diferencia de días si no es el mismo día.
  const diffTiempo = creadoHoy
    ? 0
    : Math.ceil(Math.abs(actualDate - creationalDate) / (1000 * 3600 * 24));
  return [diffTiempo, creadoHoy]; // Devuelve un array con la diferencia y si fue creado hoy.
};

const History = () => {
  const [data, setData] = useState([]); // Estado para almacenar los datos mostrados en la tabla.
  const [originalData, setOriginalData] = useState([]); // Almacena todos los datos originales.
  const [load, setLoad] = useState(true); // Controla el estado de carga.
  const [pageSize, setPageSize] = useState(5); // Tamaño de la paginación.
  const navigate = useNavigate(); // Hook de navegación.

  // Elimina un pedido específico.
  const onDelete = async (item) => {
    setLoad(true); // Activa el estado de carga.
    try {
      const result = await archivedOrder(item); // Llama al handler para archivar el pedido.
      if (result) {
        // Actualiza el estado eliminando el elemento correspondiente.
        setData((prevData) =>
          prevData.filter((value) => value._id !== item._id)
        );
        message.success(`Pedido ${item.orderCode} eliminado correctamente`);
      } else {
        message.error(`Error al eliminar el pedido ${item.orderCode}`);
      }
    } catch (e) {
      message.error(`Error al eliminar el pedido ${item.orderCode}`);
    } finally {
      setLoad(false); // Desactiva el estado de carga.
    }
  };

  // Navega a otra página con la información del pedido.
  const onNavigate = async (item) => {
    try {
      const result = await getOrderById({ _id: item._id }); // Obtiene el pedido por su ID.
      fixOrder(result, 0, () => {
        navigate("/Dashboard/Report/", { replace: true }); // Navega a la página del reporte.
      });
    } catch (e) {
      console.log(e);
    }
  };

  // Efecto para cargar datos iniciales.
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoad(true);
        const result = await getOrders({}); // Obtiene todos los pedidos.
        if (Array.isArray(result)) {
          result.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)); // Ordena los pedidos por fecha de actualización.
          setData(result);
          setOriginalData(result); // Guarda los datos originales.
        } else {
          console.error("Error: getOrders() did not return an array.");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoad(false); // Desactiva el estado de carga.
      }
    };

    fetchData();
  }, []);

  // Efecto para manejar el tamaño de paginación según el tamaño de la ventana.
  useEffect(() => {
    const handleResize = () => {
      const windowHeight = window.innerHeight; // Altura de la ventana.
      const newRowHeight = 108; // Altura aproximada de una fila.
      const newPageSize = Math.floor((windowHeight - 200) / newRowHeight); // Calcula cuántas filas caben.
      setPageSize(newPageSize); // Actualiza el tamaño de la página.
    };

    handleResize(); // Ajusta el tamaño inicial.
    window.addEventListener("resize", handleResize); // Añade un listener para cambios de tamaño.
    return () => {
      window.removeEventListener("resize", handleResize); // Limpia el listener.
    };
  }, []);

  // Filtra los datos según un término de búsqueda.
  const getFilterComplements = async (params) => {
    try {
      setLoad(true);
      const searchTerm = (params && params.text && typeof params.text === "string")
        ? params.text.toLowerCase()
        : "";

      if (searchTerm === "") {
        setData(originalData); // Restablece los datos originales.
      } else {
        const filteredData = originalData.filter((order) =>
          order.customerName?.toLowerCase().includes(searchTerm)
        );
        if (filteredData.length > 0) {
          setData(filteredData); // Actualiza con los datos filtrados.
        } else {
          message.error("No se encontraron resultados");
        }
      }
    } catch (error) {
      console.error("Error filtrando las órdenes:", error);
    } finally {
      setLoad(false); // Desactiva el estado de carga.
    }
  };

  // Configuración de columnas para la tabla.
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
    <div className="flex flex-col overflow-y-scroll">
      <div className="px-4">
        <Header
          actions={true}
          name={"Listado"}
          setLoading={setLoad}
          setData={setData}
          data={data}
          input={true}
          getFilter={getFilterComplements}
          addFile={(e) => {
            return e;
          }}
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
            dataSource={data}
            columns={columns}
            pagination={{ pageSize }}
          />
        </Card>
      </article>
    </div>
  );
};

export { History };
