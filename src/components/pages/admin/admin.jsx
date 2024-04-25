import React, { useContext, useEffect, useRef, useState } from "react";
import "../../../index.css";
import {} from "antd";
import "./admin.css";

import {
  Button,
  Divider,
  Form,
  Input as Input_ant,
  Select,
  Row,
  Col,
  message,
  Popconfirm,
  Modal,
  Typography,
  Empty,
  Table,
  Checkbox,
  Space,
} from "antd";

import { Header } from "../../content";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Label, TablaModal, Input } from "./../../content/modals";
import { archivedOrder } from "../../../handlers/order";

import { createUser, getUsers } from "../../../handlers/user";

const { Option } = Select;

const { success, info, error } = message;

const MENSAJES = {
  SUCCESS: () => success("Se ha actualizado Correctamente"),
  INFO: (nombreTienda) => info(`Nueva Tienda: ${nombreTienda}`),
  ERROR: (problema) => error(`Error: ${problema}`),
  DELETE: (nombreTienda) => info(`Se ha eliminado la Tienda: ${nombreTienda}`),
};

// const Datos = () => {
//   const [form] = Form.useForm();
//   const [data, setData] = useState(
//     JSON.parse(localStorage.getItem("Tiendas")) || []
//   );
//   const [modal, setModal] = useState(false);
//   const [rowActual, setRowActual] = useState(false);
//   const [filtroTabla, setFiltroTabla] = useState("");
//   const [listaTiendas, setListaTiendas] = useState([]);
//   // const onFinish = async (values) => {
//   //   /** @type {<{phone: string, name: string, email: string, observation: string, password: string}>} */
//   //   const nuevaTienda = await createUser({
//   //     phone: `${values.prefix}${values.phone}`,
//   //     tienda: values.tienda,
//   //     name: values.propietario,
//   //     email: values.email,
//   //     observation: values.intro,
//   //     gender: values.gender,
//   //     password: values.password,
//   //   });

//   //   const tiendasTemporal = await getUsers();
//   //   setListaTiendas(tiendasTemporal);

//   //   if (!nuevaTienda) return MENSAJES.ERROR("Conexión Base de Datos");

//   //   // IMPORTANTE! --> Cambiar LocalStorage por Base de Datos

//   //   /** @type {Array.<{phone: string, name: string, email: string, observation: string, password: string}>} */
//   //   let tiendas = JSON.parse(localStorage.getItem("Tiendas")) || [];
//   //   tiendas = [...tiendas, nuevaTienda];

//   //   localStorage.setItem("Tiendas", JSON.stringify(tiendas));
//   //   setData((data) => (data = JSON.parse(localStorage.getItem("Tiendas"))));

//   //   MENSAJES.INFO(nuevaTienda.name);
//   //   MENSAJES.SUCCESS;

//   //   setTimeout(() => form.resetFields(), 500);
//   // };
//   const onFinish = async (values) => {
//     try {
//       const nuevaTienda = await createUser({
//         phone: `${values.prefix}${values.phone}`,
//         tienda: values.tienda,
//         name: values.propietario,
//         email: values.email,
//         observation: values.intro,
//         gender: values.gender,
//         password: values.password,
//       });

//       if (!nuevaTienda) {
//         return MENSAJES.ERROR("Conexión Base de Datos");
//       }

//       const tiendasTemporal = await getUsers();

//       if (!tiendasTemporal) {
//         return MENSAJES.ERROR("Conexión Base de Datos");
//       }

//       setListaTiendas(tiendasTemporal);
//       console.log(tiendasTemporal);

//       console.log(values);
//       MENSAJES.INFO(nuevaTienda.name);

//       setTimeout(() => window.location.reload(), 500);
//     } catch (error) {
//       console.error("Error en onFinish:", error);
//     }
//   };

//   const prefixSelector = (
//     <Form.Item name="prefix" noStyle>
//       <Select style={{ width: 70 }}>
//         <Option value="34">+34</Option>
//         <Option value="86">+86</Option>
//         <Option value="87">+87</Option>
//       </Select>
//     </Form.Item>
//   );
//   const Filtrar = () => {
//     const f = listaTiendas.filter((obj, key) => {
//       const { name } = obj;
//       if (name.toLowerCase().startsWith(filtroTabla.toLowerCase())) return obj;
//     });
//     if (f.length === 0 && data.length !== 0)
//       return (
//         <Row className="border-b-[1px] border-border p-8 grid place-content-center">
//           <Col>
//             <Empty
//               className="py-2 text-md"
//               image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
//               imageStyle={{
//                 height: 60,
//                 display: "grid",
//                 placeContent: "center",
//               }}
//               description={
//                 <span>No se han encontrado Tiendas con ese nombre</span>
//               }
//             />
//           </Col>
//         </Row>
//       );
//       console.log(f)

//     return f.map((obj, key) => {
//       return (
//         <Row key={key} className="grid grid-cols-[1fr_1fr_1fr_.75fr] gap-1 border-b border-border py-4">
//           {obj &&
//             Object.entries(obj)
//               .filter((val) => ["email", "name", "phone"].includes(val[0]))
//               .map((val) => {
//                 localStorage.setItem("Tabla_Entera", JSON.stringify(obj));
//                 return (
//                   <Col className={`flex items-center`}>
//                     <p className={`pl-4`}>{val[1]}</p>
//                   </Col>
//                 );
//               })}
//           <div div className="flex flex-row justify-end mr-4">
//             <Button
//               onClick={() => {
//                 setModal(true);
//                 setRowActual(key);
//               }}
//               data-index={key}
//               className="border-blue text-blue w-[65px] mr-2"
//             >
//               Editar
//             </Button>
//             <Popconfirm
//               //Cambio TablaModal, sino fallo
//               title="¿Estás seguro de que desea eliminar este reporte?"
//               className="flex justify-center items-center"
//               icon={<QuestionCircleOutlined style={{ color: "red" }} />}
//               onConfirm={async () => {
//                 try {
//                   const result = await archivedOrder(obj);
//                   if (result) {
//                     message.success("Se ha eliminado correctamente");
//                     location.reload();
//                   }
//                 } catch (e) {
//                   console.log(e);
//                 }

//                 // const nuevasTiendas = [];

//                 // for (const index in data)
//                 //   if (index != key) nuevasTiendas.push(data[index]);

//                 // localStorage.setItem("Tiendas", JSON.stringify(nuevasTiendas));
//                 // setData(
//                 //   (data) => (data = JSON.parse(localStorage.getItem("Tiendas")))
//                 // );
//                 // console.log(data)
//                 // MENSAJES.SUCCESS();
//                 // MENSAJES.DELETE(data[key].tienda);
//               }}
//               okType="default"
//               okText="Yes"
//               cancelText="No"
//             >
//               <Typography.Link>
//                 <Button
//                   danger
//                   className="w-[65px] flex justify-center items-center"
//                 >
//                   Eliminar
//                 </Button>
//               </Typography.Link>
//             </Popconfirm>
//           </div>
//         </Row>
//       );
//     });
//   };

//   const getTiendas = async () => {
//     const tiendas = await getUsers();
//     setListaTiendas(tiendas);
//   };

//   useEffect(() => {
//     getTiendas();
//   }, []);

//   return (
//     <>
//       <Header actions={false} name={"Tiendas"} />
//       <section className=" grid grid-rows-[750px_1fr] grid-cols-1 xl:grid-rows-1 xl:grid-cols-[420px_1fr] mb-4">
//         <div>
//           <Divider orientation="left" className="">
//             Registro de Tiendas
//           </Divider>
//           <Form
//             id="form"
//             form={form}
//             name="register"
//             onFinish={onFinish}
//             onFinishFailed={() => onFailed("Problemas al enviar el formulario")}
//             initialValues={{ prefix: "+34" }}
//             scrollToFirstError
//             className="w-full gap-1 flex flex-col bg-gray border-border border px-8 py-4 transition-all duration-150"
//           >
//             <Divider orientation="left">Obligatorios</Divider>
//             <Form.Item
//               name="propietario"
//               label={<span className="">Propietario</span>}
//               className="w-full  p-4 flex items-center  m-0"
//               rules={[
//                 {
//                   required: true,
//                   message: "Porfavor introduce tu Propietario",
//                   whitespace: true,
//                 },
//               ]}
//             >
//               <Input_ant className="" id="firstInputForm" />
//             </Form.Item>
//             <Form.Item
//               name="tienda"
//               label={<span className="">Tienda</span>}
//               className="w-full  p-4 flex items-center  m-0"
//               onChange={(e) => e.target.value}
//               rules={[
//                 {
//                   required: true,
//                   message: "Porfavor introduce tu Tienda",
//                   whitespace: true,
//                 },
//               ]}
//             >
//               <Input_ant className="" />
//             </Form.Item>
//             <Form.Item
//               name="email"
//               label={<span className="">E-mail</span>}
//               className="w-full p-4 flex items-center  m-0"
//               rules={[
//                 {
//                   type: "email",
//                   message: "El email no es valido",
//                 },
//                 {
//                   required: true,
//                   message: "Porfavor introduce un email",
//                 },
//               ]}
//             >
//               <Input_ant />
//             </Form.Item>

//             <Form.Item
//               name="phone"
//               className="w-full  p-4 flex items-center  m-0"
//               label={<span className="">Teléfono</span>}
//               rules={[
//                 {
//                   max: 9,
//                   min: 9,
//                   required: true,
//                   message: "Introduce un número de teléfono correcto",
//                 },
//               ]}
//             >
//               <Input_ant
//                 className="rounded-none w-full"
//                 addonBefore={prefixSelector}
//               />
//             </Form.Item>
//             <Form.Item
//               name="password"
//               className="w-full p-4 flex items-center  m-0"
//               label={<span className="">Contraseña</span>}
//               rules={[
//                 {
//                   required: true,
//                   whitespace: true,
//                   type: "password",
//                 },
//               ]}
//             >
//               <Input_ant className="" />
//             </Form.Item>
//             <Divider className="text-border" orientation="left">
//               No obligatorios
//             </Divider>
//             <Form.Item
//               name="intro"
//               className="pl-4"
//               label={<span className="italic">Comentario</span>}
//             >
//               <Input_ant.TextArea
//                 showCount
//                 maxLength={100}
//                 className="lg:w-[200px] h-[100px]"
//                 placeholder="Añada información más allá de los campos requeridos."
//               />
//             </Form.Item>
//             <Form.Item className="flex justify-end  m-0">
//               <Button
//                 className="border border-blue text-blue hover:bg-blue flex items-center justify-center w-[75px] h-[50px] "
//                 type="primary"
//                 htmlType="submit"
//               >
//                 Registrar
//               </Button>
//             </Form.Item>
//           </Form>
//         </div>
//         <div className="pb-8">
//           <Divider orientation="left" className="px-4 py-0 m-0">
//             Historial
//           </Divider>
//           <article className="flex flex-col gap-4">
//             <Input_ant.Search
//               addonAfter
//               placeholder="Filtrar por Nombre de Tienda"
//               className="w-[500px] ml-4"
//               onChange={(e) =>
//                 setFiltroTabla((filtro) => (filtro = e.target.value))
//               }
//             />
//             <Form
//               layout="vertical"
//               onFinish={onFinish}
//               form={form}
//               className="border border-b-0 mx-4 border-border rounded-none"
//             >
//               <Row className="grid grid-cols-[1fr_1fr_1fr_.75fr] border-b border-border py-4 bg-gray divide-x-[1px] divide-border">
//                 {/* <Col xs={24} sm={24} md={4}>
//                   <b className="ml-4">Tienda</b>
//                 </Col> */}
//                 <Col xs={24} sm={24} md={4}>
//                   <b className="ml-4">Email</b>
//                 </Col>
//                 <Col xs={24} sm={24} md={4}>
//                   <b className="ml-4">Propietario</b>
//                 </Col>
//                 <Col xs={24} sm={24} md={4}>
//                   <b className="ml-4">Teléfono</b>
//                 </Col>
//                 <Col xs={24} sm={24} md={4}>
//                   <b className="ml-4">Actions</b>
//                 </Col>
//               </Row>
//               {listaTiendas && listaTiendas.length === 0 ? (
//                 <Row className="border-b-[1px] border-border py-4 flex justify-center items-center">
//                   <Col className="flex justify-center items-center">
//                     {/* <Col className="text-slate-400 italic text-md pl-4 col-span-4 ">No se ha agregado ninguna Tienda...</Col> */}
//                     {/* <Col className="pl-4"> */}

//                     {/* </Col> */}
//                     <Empty
//                       className="py-2"
//                       image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
//                       imageStyle={{
//                         height: 60,
//                         display: "grid",
//                         placeContent: "center",
//                       }}
//                       description={<span>No hay Tiendas</span>}
//                     >
//                       <Button
//                         type="primary"
//                         className="bg-blue text-white"
//                         onClick={() => {
//                           document.getElementById("firstInputForm").focus();

//                           document
//                             .getElementById("form")
//                             .classList.add("bg-form");
//                           setTimeout(() => {
//                             document
//                               .getElementById("form")
//                               .classList.remove("bg-form");
//                           }, 1500);
//                         }}
//                       >
//                         Agregar
//                       </Button>
//                     </Empty>
//                   </Col>
//                 </Row>
//               ) : (
//                 <Filtrar />
//               )}
//             </Form>
//           </article>
//         </div>
//       </section>
//     </>
//   );
// };

const onFinish = async (values) => {
  try {
    const nuevaTienda = await createUser({
      phone: `${values.prefix}${values.phone}`,
      tienda: values.tienda,
      name: values.propietario,
      email: values.email,
      observation: values.intro,
      gender: values.gender,
      password: values.password,
    });
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
    if (!nuevaTienda) {
      return MENSAJES.ERROR("Conexión Base de Datos");
    }

    // const tiendasTemporal = await getUsers();

    // console.log(tiendasTemporal)

    // if (!tiendasTemporal) {
    //   return MENSAJES.ERROR("Conexión Base de Datos");
    // }

    // setListaTiendas(tiendasTemporal);
    // console.log(tiendasTemporal);

    // console.log(values);
    // MENSAJES.INFO(nuevaTienda.name);

    setTimeout(() => window.location.reload(), 500);
  } catch (error) {
    console.error("Error en onFinish:", error);
  }
};

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const ShopsForm = () => (
  <Form
    name="basic"
    labelCol={{
      span: 8,
    }}
    wrapperCol={{
      span: 16,
    }}
    initialValues={{
      remember: true,
    }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
    className="w-full"
  >
    <Form.Item
      name="propietario"
      label={<span className="">Propietario</span>}
      className="p-4 flex items-center m-0"
      rules={[
        {
          required: true,
          message: "Porfavor introduce tu Propietario",
          whitespace: true,
        },
      ]}
    >
      <Input_ant id="firstInputForm" />
    </Form.Item>
    <Form.Item
      name="tienda"
      label={<span className="">Tienda</span>}
      className="w-full p-4 flex items-center m-0"
      onChange={(e) => e.target.value}
      rules={[
        {
          required: true,
          message: "Porfavor introduce tu Tienda",
          whitespace: true,
        },
      ]}
    >
      <Input_ant className="" />
    </Form.Item>
    <Form.Item
      name="email"
      label={<span className="">E-mail</span>}
      className="w-full p-4 flex items-center  m-0"
      rules={[
        {
          type: "email",
          message: "El email no es valido",
        },
        {
          required: true,
          message: "Porfavor introduce un email",
        },
      ]}
    >
      <Input_ant />
    </Form.Item>

    <Form.Item
      name="phone"
      className="w-full  p-4 flex items-center  m-0"
      label={<span className="">Teléfono</span>}
      rules={[
        {
          max: 9,
          min: 9,
          required: true,
          message: "Introduce un número de teléfono correcto",
        },
      ]}
    >
      <Input_ant className="" />
    </Form.Item>
    <Form.Item
      name="password"
      className="w-full p-4 flex items-center  m-0"
      label={<span className="">Contraseña</span>}
      rules={[
        {
          required: true,
          whitespace: true,
          type: "password",
        },
      ]}
    >
      <Input_ant className="" />
    </Form.Item>
    <Form.Item
      name="comentario"
      label={<span className="italic">Comentario</span>}
    >
      <Input_ant.TextArea
        showCount
        maxLength={100}
        className="lg:w-[200px] h-[70px]"
        placeholder="Añada información más allá de los campos requeridos."
      />
    </Form.Item>

    <Form.Item
      wrapperCol={{
        offset: 14,
      }}

    >
      <Button className="bg-blue text-white" type="default" htmlType="submit">
        Crear
      </Button>
    </Form.Item>
  </Form>
);

const Admin = () => {
  let columns = [];
  const [listaTiendas, setListaTiendas] = useState([]);
  const [load, setLoad] = useState(true);
  const [pageSize, setPageSize] = useState(5);
  useEffect(() => {
    const handleResize = () => {
      const windowHeight = window.innerHeight;
      const newRowHeight = 75;
      const newPageSize = Math.floor((windowHeight - 200) / newRowHeight);
      setPageSize(newPageSize);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoad(true);
        const result = await getUsers({});
        setListaTiendas(result);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoad(false);
      }
    };

    fetchData();
  }, []);

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

  const onUpdate = async (item) => {
    
  };

  columns = [
    {
      title: "Propietario",
      width: 100,
      dataIndex: "name",
      key: "name",
      fixed: "left",
    },
    {
      title: "Email",
      width: 100,
      dataIndex: "email",
      key: "email",
    },

    {
      title: "Telefono",
      width: 60,
      dataIndex: "phone",
      key: "phone",
      key: "1",
    },
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      width: 100,
      render: (text, record) => (
        <div className="flex flex-row justify-around">
          <Space>
            <Typography.Link>
              <Button type="default" onClick={() => {
                onUpdate(record) 
                }}>
                Editar
              </Button>
            </Typography.Link>
          </Space>
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
        </div>
      ),
    },
  ];
    
  return (
    <main className="overflow-y-scroll px-4 flex gap-4 flex-col">
      <Header actions={false} name={"Tiendas"} />
      <section className="grid grid-cols-2">
        <ShopsForm />
        <Table
          columns={columns}
          dataSource={listaTiendas}
          loading={load}
          pagination={{ pageSize }}
        />
      </section>
    </main>
  );
};

export { Admin };
