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
  const fechas = [actualDate, creationalDate];

  const diff = () => {
    const [a, b] = fechas;
    return Math.ceil(Math.abs(a - b) / (1000 * 3600 * 24));
  };

  const diffTiempo = diff();
  const creadoHoy = diffTiempo === 0;

  return [diffTiempo, creadoHoy];
};
// const bugetOrder = useCallback(
//   async (values) => {
//     if (!data._id) return;

//     console.log(data);
//     const result = await updateOrder({
//       ...values,
//       _id: data._id,
//     });

//     if (!result) return;

//     console.log(result);

//     setInitialValues([result, ...initialValues]);

//     console.log(initialValues);
//     getData(result);
//     setLocalOrder(result);
//     message.success("Se ha actualizado correctamente");
//   },
//   [data, getData, initialValues]
// );
// const CopyButton = ({ item }) => {
//   const [texto, copiar] = useCopyToClipboard();
//   const [copiado, toggle] = useToggle();
//   const [textCopy, setTextCopy] = useState("Copy");

//   useEffect(() => {
//     if (!copiado) return;
//     setTextCopy((text) => (text = "Copied!"));
//     setTimeout(() => {
//       toggle(false);
//       setTextCopy((text) => (text = "Copy"));
//     }, 2000);
//   }, [copiado]);

//   return (
//     <Tooltip title={textCopy} color={copiado ? "#1a7a" : "#1a7af8"}>
//       <article className={`gap-1 flex pr-0`}>
//         <p
//           onClick={() => {
//             copiar(item);
//             toggle(true);
//           }}
//           className={`${
//             copiado ? "bg-green/25" : "bg-blue/25"
//           } rounded-full w-[25px] h-[25px] grid place-content-center cursor-pointer transition-all ease-in-out duration-300  shadow-md`}
//         >
//           {copiado ? (
//             <CheckCircle className="transition-all ease-in-out duration-300 text-green" />
//           ) : (
//             <CopyClip className="transition-all ease-in-out duration-300 text-blue" />
//           )}
//         </p>
//       </article>
//     </Tooltip>
//   );
// };

// const History = ({ getData, data }) => {
//   const [form] = Form.useForm();
//   const [initialValues, setInitialValues] = useState([]);
//   const [load, setLoad] = useState(true);

//   const navigate = useNavigate();

//   const onFinish = async (values) => {
//     if (!data._id) return;
//     console.log(values)

//     const result = await updateOrder(
//       {
//         ...values,
//         _id: data._id,
//       },
//       setLoad(true)
//     );

//     if (!result) return;

//     getData(result);
//     setLocalOrder(result);
//     message.success("Se ha actualizado correctamente");
//   };

//   const fetchData = async () => {
//     try {
//       setLoad(true);
//       const result = await getOrders({});
//       setInitialValues(result);

//       setLoad(false);
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   return (
//     <div className="flex flex-col overflow-y-scroll ">
//       <div className="px-4">
//         <Header
//           actions={true}
//           addFile={(e) => obtenerArchivo(e)}
//           name={"Listado"}
//         />
//       </div>
//       <article className="border-none rounded-none relative overflow-x-hidden">
//         <Card loading={load} className="border-none">
//           <Form
//             style={{
//               borderBottom: "1px solid #e8e8e8",
//               borderLeft: "1px solid #e8e8e8",
//               borderRight: "1px solid #e8e8e8",
//             }}
//             layout="vertical"
//             form={form}
//             initialValues={initialValues}
//             onFinish={onFinish}
//           >
//             <div class="tableHeader:hidden">
//               <Row
//                 align="middle"
//                 style={{
//                   height: "55px",
//                   background: "#FAFAFA",
//                   color: "black",
//                 }}
//               >
//                 <Col xs={24} sm={24} md={4}>
//                   <p className="font-semibold pl-2"> Ordén Número</p>
//                 </Col>

//                 <Col xs={24} sm={24} md={3}>
//                   <p className="font-semibold">Diseñador</p>
//                 </Col>
//                 <Col xs={24} sm={24} md={3}>
//                   <p className="font-semibold"> Tienda</p>
//                 </Col>
//                 <Col xs={24} sm={24} md={4}>
//                   <p className="font-semibold">Nombre Proyecto</p>
//                 </Col>
//                 <Col xs={24} sm={24} md={4}>
//                   <p className="font-semibold"> Cliente</p>
//                 </Col>
//                 <Col xs={24} sm={24} md={4}>
//                   <p className="font-semibold"> Fecha de creación</p>
//                 </Col>
//                 <Col xs={24} sm={24} md={2} className="text-center">
//                   <p className="font-semibold pr-2">Acciones</p>
//                 </Col>
//               </Row>
//             </div>
//             {initialValues &&
//               initialValues.map((item, index) => {
//                 const [fecha, creadoHoy] = getDiferenciaDias(item.createdAt);
//                 return (
//                   <Row
//                     key={index}
//                     style={{ background: "#fcfcfc", marginBottom: 5 }}
//                   >
//                     <Col xs={24} sm={24} md={4}>
//                       <Space>
//                         <Button type="link" style={{ marginTop: 10 }}>
//                           <Typography.Link
//                             onClick={async () => {
//                               console.log(item)
//                               // try {
//                               //   console.log(item)
//                               //   const result = await getOrderById({
//                               //     _id: item._id,
//                               //   });
//                               //   fixOrder(result, () => {
//                               //     navigate("/Dashboard/Report/", {
//                               //       replace: true,
//                               //     });
//                               //   });
//                               //   console.log(result)
//                               // } catch (e) {
//                               //   console.log(e);
//                               // }
//                             }}
//                           >
//                             <Tag color="blue">
//                               <span className="hover:underline text-smd lg:text-md">
//                                 {item.orderCode || "Sin especificar"}
//                               </span>
//                             </Tag>
//                           </Typography.Link>
//                         </Button>
//                       </Space>
//                     </Col>

//                     <Col xs={24} sm={24} md={3}>
//                       <p className="">
//                         <br />
//                         <b>{item.designerName || "------"}</b>
//                       </p>
//                     </Col>

//                     <Col xs={24} sm={24} md={3} className="py-4">
//                       <b>
//                         {" "}
//                         <p className="">{item.storeName || "------"}</p>
//                       </b>
//                     </Col>

//                     <Col xs={24} sm={24} md={4} className="py-4">
//                       <p className="">{item.projectName || "------"}</p>
//                     </Col>

//                     <Col xs={24} sm={24} md={4} className="py-4">
//                       <p className="">
//                         {item.customerName} <br />{" "}
//                         {item.phone || "Sin especificar"}
//                       </p>
//                     </Col>

//                     <Col xs={24} sm={24} md={4} className="py-4 flex gap-4">
//                       <p>
//                         {new Date(item.createdAt).toLocaleDateString("es-ES", {
//                           year: "numeric",
//                           month: "2-digit",
//                           day: "2-digit",
//                         })}
//                         <br />
//                         {creadoHoy ? "Creado Hoy" : `Creado hace ${fecha} días`}
//                       </p>
//                     </Col>

//                     <Col
//                       xs={24}
//                       sm={24}
//                       md={2}
//                       className="py-4 flex gap-2 justify-end"
//                     >
//                       <Popconfirm
//                         title="¿Estás seguro de que desea eliminar este reporte?"
//                         className="flex justify-center items-center"
//                         icon={
//                           <QuestionCircleOutlined style={{ color: "red" }} />
//                         }
//                         onConfirm={async () => {
//                           try {
//                             const result = await archivedOrder(item);
//                             if (result) {
//                               location.reload();
//                             }
//                           } catch (e) {
//                             console.log(e);
//                           }
//                         }}
//                         onCancel={() => {}}
//                         okType="default"
//                         okText="Si"
//                         cancelText="No"
//                       >
//                         <Typography.Link className="pr-2">
//                           <Button
//                             danger
//                             className="w-[75px] flex justify-center items-center"
//                           >
//                             Eliminar
//                           </Button>
//                         </Typography.Link>
//                       </Popconfirm>
//                     </Col>
//                   </Row>
//                 );
//               })}
//           </Form>
//         </Card>
//       </article>
//     </div>
//   );
// };

// export { History };

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
      // console.log(result)
      fixOrder(result, () => {
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
        result.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        setInitialValues(result);
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
        ,
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
          addFile={(e) => {return e}}
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
