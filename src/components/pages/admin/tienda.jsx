// import React, { useEffect, useState } from "react";
// import "../../../index.css";

// import {
//   Button,
//   Divider,
//   Form,
//   Input as Input_ant,
//   message,
//   Modal,
// } from "antd";

// import { createUser, getUsers } from "../../../handlers/user";

// const { success, info, error } = message;

// const MENSAJES = {
//   SUCCESS: () => success("Se ha actualizado Correctamente"),
//   INFO: (nombreTienda) => info(`Nueva Tienda: ${nombreTienda}`),
//   ERROR: (problema) => error(`Error: ${problema}`),
//   DELETE: (nombreTienda) => info(`Se ha eliminado la Tienda: ${nombreTienda}`),
// };

// const ModalTienda = (tiendaData) => {
//   const [form] = Form.useForm();
//   const [data, setData] = useState(tiendaData);

//   const [listaTiendas, setListaTiendas] = useState([]);

//   const onFinish = async (values) => {
//     /** @type {<{phone: string, name: string, email: string, observation: string, password: string}>} */
//     const nuevaTienda = await createUser({
//       phone: `${values.prefix}${values.phone}`,
//       tienda: values.tienda,
//       name: values.propietario,
//       email: values.email,
//       observation: values.intro,
//       gender: values.gender,
//       password: values.password,
//     });

//     const tiendasTemporal = await getUsers();
//     setListaTiendas(tiendasTemporal);
//     console.log(tiendasTemporal)

//     if (!nuevaTienda) return MENSAJES.ERROR("Conexión Base de Datos");

//     // IMPORTANTE! --> Cambiar LocalStorage por Base de Datos

//     /** @type {Array.<{phone: string, name: string, email: string, observation: string, password: string}>} */

//     let tiendas = JSON.parse(localStorage.getItem("Tiendas")) || [];
//     tiendas = [...tiendas, nuevaTienda];

//     localStorage.setItem("Tiendas", JSON.stringify(tiendas));
//     setData((data) => (data = JSON.parse(localStorage.getItem("Tiendas"))));

//     console.log(values)
//     MENSAJES.INFO(nuevaTienda.name);

//     setTimeout(() => form.resetFields(), 500);
//   };

//   return (
//     <Modal
//       title="Basic Modal"
//       open={() => {}}
//       onOk={{}}
//       onCancel={{}}
//       destroyOnClose
//       footer={false}
//     >
//       <Form
//         id="form2"
//         form={form}
//         name="register"
//         onFinish={onFinish}
//         scrollToFirstError
//         className="w-full gap-1 flex flex-col bg-gray border-border border px-8 py-4 transition-all duration-150"
//       >
//         <Form.Item
//           name="propietario"
//           label={<span className="">Propietario</span>}
//           className="w-full  p-4 flex items-center  m-0"
//           rules={[
//             {
//               required: true,
//               message: "Porfavor introduce tu Propietario",
//               whitespace: true,
//             },
//           ]}
//         >
//           <Input className="" />
//         </Form.Item>
//         <Form.Item
//           name="tienda"
//           label={<span className="">Tienda</span>}
//           className="w-full  p-4 flex items-center  m-0"
//           onChange={(e) => e.target.value}
//           rules={[
//             {
//               required: true,
//               message: "Porfavor introduce tu Tienda",
//               whitespace: true,
//             },
//           ]}
//         >
//           <Input className="" />
//         </Form.Item>
//         <Form.Item
//           name="email"
//           label={<span className="">E-mail</span>}
//           className="w-full  p-4 flex items-center  m-0"
//           rules={[
//             {
//               type: "email",
//               message: "El email no es valido",
//             },
//             {
//               required: true,
//               message: "Porfavor introduce un email",
//             },
//           ]}
//         >
//           <Input className="" />
//         </Form.Item>

//         <Form.Item
//           name="phone"
//           className="w-full  p-4 flex items-center  m-0"
//           label={<span className="">Teléfono</span>}
//           rules={[
//             {
//               max: 9,
//               min: 9,
//               required: true,
//               message: "Introduce un número de teléfono correcto",
//             },
//           ]}
//         >
//           <Input className="" />
//         </Form.Item>
//         <Form.Item
//           name="password"
//           className="w-full p-4 flex items-center  m-0"
//           label={<span className="">Contraseña</span>}
//           rules={[
//             {
//               required: true,
//               whitespace: true,
//               type: "password",
//             },
//           ]}
//         >
//           <Input_ant className="" />
//         </Form.Item>
//         <Divider className="text-border" orientation="left">
//           No obligatorios
//         </Divider>
//         <Form.Item
//           name="intro"
//           className="pl-4"
//           label={<span className="italic">Comentario</span>}
//         >
//           <Input_ant.TextArea
//             showCount
//             maxLength={100}
//             className="lg:w-[200px] h-[100px]"
//             placeholder="Añada información más allá de los campos requeridos."
//           />
//         </Form.Item>
//         <Form.Item className="flex justify-end  m-0">
//           <Button
//             className="border border-blue text-blue hover:bg-blue flex items-center justify-center w-[75px] h-[50px] "
//             type="primary"
//             htmlType="submit"
//           >
//             Registrar
//           </Button>
//         </Form.Item>
//       </Form>
//     </Modal>
//   );
// };

// export default ModalTienda;
