// import React, { useState, useEffect } from "react";

// import {
//   Button,
//   Input,
//   Form,
//   Card,
//   Row,
//   Col,
//   message,
//   Divider,
//   Space,
//   Checkbox,
//   Modal
// } from "antd";

// import { updateOrder, setLocalOrder } from "../../handlers/order";
// import {
//   existePrecio,
//   getPrecio,
//   setPrecio,
//   getTotales,
//   existeTotales,
//   setTotales,
// } from "../../data/localStorage";
// import { Select } from "antd";
// import { ButtonAction } from "../utils/btnAction";
// import { configConsumerProps } from "antd/es/config-provider";

// const General = ({ getData, data }) => {
//   const [form] = Form.useForm();
//   const [formPass] = Form.useForm();
//   const [initialValues, setInitialValues] = useState({
//     reference: data?.reference,
//     date: data?.date,
//     customerName: data?.customerName,
//     location: data?.location,
//     phone: data?.phone,
//     total: data?.total,
//     coefficient: data?.coefficient,
//     modelDoor: data?.modelDoor,
//     materialDoor: data?.materialDoor,
//     handle: data?.handle,
//     drawer: data?.drawer,
//     // drawer: data?.drawer + "/" + data?.materialDrawer,
//     materialCabinet: data?.materialCabinet,
//     observation: data?.observation,
//     // observation: "fwefwf",
//     fecha: String(data?.fecha).split(" ")[0],
//     discountEncimeras: data?.discountEncimeras,
//     discountCabinets: data?.discountCabinets,
//     discountElectrodomesticos: data?.discountElectrodomesticos,
//     discountEquipamientos: data?.discountEquipamientos,
//     semanaEntrega: data?.semanaEntrega,
//     fechaEntrega: String(data?.fechaEntrega).split(" ")[0],
//   });
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [isInputDisabled, setIsInputDisabled] = useState(true);
//   const [password, setPassword] = useState("");
//   const [isClient, setIsClient] = useState(false);
//   const correctPassword = "1234";
//   const [isInputEditable, setIsInputEditable] = useState(false);

//   const onFinish = async (values) => {
//     if (data._id) {
//       const result = await updateOrder({
//         ...values,
//         _id: data._id,
//       });

//       if (result) {
//         getData(result);
//         setInitialValues(result);
//         setLocalOrder(result);
//         message.success("Se ha actualizado correctamente");
//         setTimeout(() => {
//           location.reload();
//         }, 1000);
//       }
//     }
//   };

//   const [checkC, setCheckC] = useState(existePrecio(getPrecio("C")));
//   const [total_Enci, setEnci] = useState(
//     existeTotales(getTotales("Encimeras"))
//   );
//   const [total_Equi, setEqui] = useState(
//     existeTotales(getTotales("Equipamiento"))
//   );
//   const [total_Elec, setElec] = useState(
//     existeTotales(getTotales("Electrodomesticos"))
//   );
//   const [checkF, setCheckF] = useState(existePrecio(getPrecio("F")));
//   const [checkP, setCheckP] = useState(existePrecio(getPrecio("P")));

//   useEffect(() => {
//     // Verificar si el rol del usuario es 'client'
//     const datosGuardados = localStorage.getItem("token");
//     if (datosGuardados) {
//       const datos = JSON.parse(datosGuardados);
//       if (datos.user && datos.user.role === "client") {
//         setIsClient(true);
//       } else {
//         setIsInputDisabled(false); // Habilitar input si no es cliente
//       }
//     } else {
//       setIsInputDisabled(false); // Habilitar input si no hay datos
//     }
//   }, []);

//   const showModal = () => {
//     if (isClient) {
//       setIsModalVisible(true);
//     }
//   };

//   const handleOk = () => {
//     if (password === correctPassword) {
//       setIsInputEditable(true);
//     }
//     setIsModalVisible(false);
//     form.resetFields(); // Resetear los campos del formulario del modal
//   };

//   const handleCancel = () => {
//     setIsModalVisible(false);
//     form.resetFields(); // Resetear los campos del formulario del modal
//   };

//   const handlePasswordChange = (e) => {
//     setPassword(e.target.value);
//   };

//   return (
//     <Card className="rounded-nonel bg-gray rounded-none border border-border ">
//       <Form
//         layout="vertical"
//         form={form}
//         initialValues={initialValues}
//         onFinish={onFinish}
//       >
//         <Row gutter={16}>
//           <Col xs={24} sm={24} md={24}>
//             <Divider orientation="left">
//               <p className="uppercase">
//                 <b>Acerca del Cliente</b>
//               </p>
//             </Divider>
//           </Col>
//           <Col xs={24} sm={24} md={4}>
//             <Form.Item label="Fecha Confirmación" name="fecha">
//               <Input placeholder="" type="date" />
//             </Form.Item>
//           </Col>
//           <Col xs={24} sm={24} md={4}>
//             <Form.Item label="Envio Mercancia" name="fechaEntrega">
//               <Input placeholder="" type="date" />
//             </Form.Item>
//           </Col>

//           <Col xs={24} sm={24} md={4}>
//             <Form.Item label="Semana de Entrega" name="semanaEntrega">
//               <Input placeholder="" />
//             </Form.Item>
//           </Col>
//           <Col xs={24} sm={24} md={5}>
//             <Form.Item label="Nombre Cliente" name="customerName">
//               <Input placeholder="" maxLength="100" />
//             </Form.Item>
//           </Col>
//           <Col xs={24} sm={24} md={3}>
//             <Form.Item label="Teléfono" name="phone">
//               <Input placeholder="" maxLength="15" />
//             </Form.Item>
//           </Col>

//           <Col xs={24} sm={24} md={4}>
//             <Form.Item label="Localización" name="location">
//               <Input placeholder="" maxLength="100" />
//             </Form.Item>
//           </Col>
//           <Divider orientation="left">
//             {" "}
//             <p className="uppercase">
//               <b>Acerca del Mueble</b>
//             </p>
//           </Divider>

//           <Col xs={24} sm={24} md={5}>
//             <Form.Item label="Modelo" name="modelDoor">
//               <Input placeholder="" maxLength="50" />
//             </Form.Item>
//           </Col>
//           <Col xs={24} sm={24} md={5}>
//             <Form.Item label="Acabado" name="materialDoor">
//               <Input placeholder="" maxLength="200" />
//             </Form.Item>
//           </Col>
//           <Col xs={24} sm={24} md={5}>
//             <Form.Item label="Tirador" name="handle">
//               <Input placeholder="" maxLength="200" />
//             </Form.Item>
//           </Col>

//           <Col xs={24} sm={24} md={5}>
//             <Form.Item label="Cajon" name="drawer">
//               <Input placeholder="" maxLength="200" />
//             </Form.Item>
//           </Col>
//           <Col xs={24} sm={24} md={4}>
//             <Form.Item label="Armazón" name="materialCabinet">
//               <Input placeholder="" maxLength="200" />
//             </Form.Item>
//           </Col>
//           <Col xs={24} sm={24} md={24}>
//             <Form.Item label="Observaciones" name="observation">
//               <Input.TextArea placeholder="" cols={4} />
//             </Form.Item>
//           </Col>
//           <Divider orientation="left">
//             <p className="uppercase">
//               {" "}
//               <b>Acerca de los Precios</b>
//             </p>
//           </Divider>

//           <Col xs={24} sm={24} md={4}>

//             {/* <Form.Item label="Coeficiente Tiendas" name="coefficient">
//               <Input
//                 disabled={isInputDisabled}
//                 onClick={showModal}
//                 placeholder=""
//                 maxLength="5"
//                 max={10}
//                 min={0}
//               />
//             </Form.Item> */}

//             <Form.Item label="Coeficiente Tiendas" name="coefficient">
//           <div style={{ position: 'relative' }}>
//             <Input readOnly={!isInputEditable} />
//             {!isInputEditable && (
//               <div
//                 onClick={showModal}
//                 style={{
//                   position: 'absolute',
//                   top: 0,
//                   left: 0,
//                   right: 0,
//                   bottom: 0,
//                   backgroundColor: 'rgba(255, 255, 255, 0.6)',
//                   cursor: 'pointer',
//                 }}
//               ></div>
//             )}
//           </div>
//         </Form.Item>

//           </Col>
//           <Modal
//             title="Introduce la contraseña"
//             open={isModalVisible}
//             onOk={handleOk}
//             onCancel={handleCancel}
//             okText="Guardar"
//           >
//             <Form form={form}>
//               <Form.Item label="Contraseña" name="password">
//                 <Input.Password
//                   value={password}
//                   onChange={handlePasswordChange}
//                 />
//               </Form.Item>
//             </Form>
//           </Modal>
//           <Col xs={24} sm={24} md={2}>
//             <Form.Item label="IVA" name="iva">
//               <Input placeholder="" maxLength="5" defaultValue="21%" disabled />
//             </Form.Item>
//           </Col>
//           <Divider orientation="left" className="px-10">
//             <b className="uppercase">Descuento</b>{" "}
//             <span className="italic text-slate-400">(%)</span>
//           </Divider>
//           <Row className="w-full px-10 gap-4">
//             <Col xs={12} sm={12} md={3}>
//               <Form.Item label="Encimeras" name="discountEncimeras">
//                 <Input
//                   maxLength="3"
//                   max={100}
//                   min={0}
//                   onBlur={(e) => {
//                     const newDiscount = e.target.value.trim();
//                     setInitialValues((prevValues) => ({
//                       ...prevValues,
//                       discountEncimeras: newDiscount,
//                     }));
//                   }}
//                 />
//               </Form.Item>
//             </Col>
//             <Col xs={12} sm={12} md={3}>
//               <Form.Item label="Muebles" name="discountCabinets">
//                 <Input
//                   defaultValue={0}
//                   maxLength="3"
//                   max={100}
//                   min={0}
//                   onBlur={(e) => {
//                     const newDiscount = e.target.value.trim();
//                     setInitialValues((prevValues) => ({
//                       ...prevValues,
//                       discountCabinets: newDiscount,
//                     }));
//                   }}
//                 />
//               </Form.Item>
//             </Col>
//             <Col xs={12} sm={12} md={3}>
//               <Form.Item label="Equipamientos" name="discountEquipamientos">
//                 <Input
//                   defaultValue={0}
//                   maxLength="3"
//                   max={100}
//                   min={0}
//                   onBlur={(e) => {
//                     const newDiscount = e.target.value.trim();
//                     setInitialValues((prevValues) => ({
//                       ...prevValues,
//                       discountEquipamientos: newDiscount,
//                     }));
//                   }}
//                 />
//               </Form.Item>
//             </Col>
//             <Col xs={12} sm={12} md={3}>
//               <Form.Item
//                 label="Electrodomesticos"
//                 name="discountElectrodomesticos"
//               >
//                 <Input
//                   defaultValue={0}
//                   maxLength="3"
//                   max={100}
//                   min={0}
//                   onBlur={(e) => {
//                     const newDiscount = e.target.value.trim();
//                     setInitialValues((prevValues) => ({
//                       ...prevValues,
//                       discountElectrodomesticos: newDiscount,
//                     }));
//                   }}
//                 />
//               </Form.Item>
//             </Col>
//           </Row>
//           <Col xs={24} sm={24} md={24}>
//             <Row>
//               <Divider orientation="left">
//                 <p className="uppercase">
//                   {" "}
//                   <b>Mostrar Precios</b>
//                 </p>
//               </Divider>
//               <div className="flex flex-col">
//                 <Checkbox
//                   checked={checkC}
//                   onChange={(e) =>
//                     setCheckC(
//                       (check) => (check = setPrecio("C", e.target.checked))
//                     )
//                   }
//                 >
//                   Mostrar Precios Clientes
//                 </Checkbox>
//                 <Checkbox
//                   checked={checkF}
//                   onChange={(e) =>
//                     setCheckF(
//                       (check) => (check = setPrecio("F", e.target.checked))
//                     )
//                   }
//                 >
//                   Mostrar Precios Fabrica
//                 </Checkbox>
//                 <Checkbox
//                   checked={checkP}
//                   onChange={(e) =>
//                     setCheckP(
//                       (check) => (check = setPrecio("P", e.target.checked))
//                     )
//                   }
//                 >
//                   Mostrar Precios Confirmación Pedido
//                 </Checkbox>
//               </div>
//             </Row>
//             <Row>
//               <Divider orientation="left">
//                 <p className="uppercase">
//                   {" "}
//                   <b>Mostrar Totales</b>
//                 </p>
//               </Divider>
//               <div className="flex flex-col">
//                 <Checkbox
//                   checked={total_Enci}
//                   onChange={(e) =>
//                     setEnci(
//                       (check) =>
//                         (check = setTotales("Encimeras", e.target.checked))
//                     )
//                   }
//                 >
//                   Mostrar Totales Encimeras
//                 </Checkbox>
//                 <Checkbox
//                   checked={total_Equi}
//                   onChange={(e) =>
//                     setEqui(
//                       (check) =>
//                         (check = setTotales("Equipamiento", e.target.checked))
//                     )
//                   }
//                 >
//                   Mostrar Totales Equipamiento
//                 </Checkbox>
//                 <Checkbox
//                   checked={total_Elec}
//                   onChange={(e) =>
//                     setElec(
//                       (check) =>
//                         (check = setTotales(
//                           "Electrodomesticos",
//                           e.target.checked
//                         ))
//                     )
//                   }
//                 >
//                   Mostrar Totales Electrodomesticos
//                 </Checkbox>
//               </div>
//             </Row>
//             <Space>
//               <Button
//                 htmlType="submit"
//                 type="primary"
//                 className="flex justify-center items-center"
//                 style={{
//                   height: 50,
//                   width: 150,
//                   marginTop: 30,
//                   padding: "5px 20px",
//                   background: "#1a7af8",
//                   color: "#fff",
//                 }}
//               >
//                 Guardar
//               </Button>
//             </Space>
//           </Col>
//         </Row>
//       </Form>
//     </Card>
//   );
// };
// export default General;

import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Form,
  Card,
  Row,
  Col,
  message,
  Divider,
  Space,
  Checkbox,
  Modal,
} from "antd";

import { updateOrder, setLocalOrder } from "../../handlers/order";
import {
  existePrecio,
  getPrecio,
  setPrecio,
  getTotales,
  existeTotales,
  setTotales,
} from "../../data/localStorage";

const General = ({ getData, data }) => {
  let role = "";
  role = data.profile.role;
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState({
    reference: data?.reference,
    date: data?.date,
    customerName: data?.customerName,
    location: data?.location,
    phone: data?.phone,
    total: data?.total,
    coefficient: data?.coefficient,
    modelDoor: data?.modelDoor,
    materialDoor: data?.materialDoor,
    handle: data?.handle,
    drawer: data?.drawer,
    materialCabinet: data?.materialCabinet,
    observation: data?.observation,
    fecha: String(data?.fecha).split(" ")[0],
    discountEncimeras: data?.discountEncimeras,
    discountCabinets: data?.discountCabinets,
    discountElectrodomesticos: data?.discountElectrodomesticos,
    discountEquipamientos: data?.discountEquipamientos,
    ivaEncimeras: data?.ivaEncimeras,
    ivaCabinets: data?.ivaCabinets,
    ivaElectrodomesticos: data?.ivaElectrodomesticos,
    ivaEquipamientos: data?.ivaEquipamientos,
    semanaEntrega: data?.semanaEntrega,
    fechaEntrega: String(data?.fechaEntrega).split(" ")[0],
  });
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isInputEditable, setIsInputEditable] = useState(false);
  const [password, setPassword] = useState("");
  const [isClient, setIsClient] = useState(false);
  const correctPassword = "1234";

  useEffect(() => {
    if (role) {
      if (role === "client") {
        setIsClient(true);
      } else {
        setIsInputEditable(true);
      }
    } else {
      setIsInputEditable(true);
    }
  }, [role]);

  const showModal = () => {
    if (isClient) {
      setIsOpenModal(true);
    }
  };

  const handleOk = () => {
    if (password === correctPassword) {
      setIsInputEditable(true);
      message.success("Coeficiente desbloqueado");
    } else {
      message.error("Contraseña incorrecta");
    }
    setIsOpenModal(false);
    setPassword("");
  };

  const handleCancel = () => {
    setIsOpenModal(false);
    setPassword("");
  };

  const onFinish = async (values) => {
    if (data._id) {
      const result = await updateOrder({ ...values, _id: data._id });
      console.log(result)
      if (result) {
        getData(result);
        setInitialValues(result);
        setLocalOrder(result);
        message.success("Se ha actualizado correctamente");
        setTimeout(() => {
          location.reload();
        }, 1000);
      }
    }
  };

  return (
    <Card className="rounded-none bg-gray border border-border ">
      <Form
        layout="vertical"
        form={form}
        initialValues={initialValues}
        onFinish={onFinish}
      >
        <Row gutter={16}>
          <Col xs={24} sm={24} md={24}>
            <Divider orientation="left">
              <p className="uppercase">
                <b>Acerca del Cliente</b>
              </p>
            </Divider>
          </Col>
          <Col xs={24} sm={24} md={4}>
            <Form.Item label="Fecha Confirmación" name="fecha">
              <Input placeholder="" type="date" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={4}>
            <Form.Item label="Envio Mercancia" name="fechaEntrega">
              <Input placeholder="" type="date" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={4}>
            <Form.Item label="Semana de Entrega" name="semanaEntrega">
              <Input placeholder="" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={5}>
            <Form.Item label="Nombre Cliente" name="customerName">
              <Input placeholder="" maxLength="100" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={3}>
            <Form.Item label="Teléfono" name="phone">
              <Input placeholder="" maxLength="15" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={4}>
            <Form.Item label="Localización" name="location">
              <Input placeholder="" maxLength="100" />
            </Form.Item>
          </Col>
          <Divider orientation="left">
            <p className="uppercase">
              <b>Acerca del Mueble</b>
            </p>
          </Divider>
          <Col xs={24} sm={24} md={5}>
            <Form.Item label="Modelo" name="modelDoor">
              <Input placeholder="" maxLength="50" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={5}>
            <Form.Item label="Acabado" name="materialDoor">
              <Input placeholder="" maxLength="200" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={5}>
            <Form.Item label="Tirador" name="handle">
              <Input placeholder="" maxLength="200" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={5}>
            <Form.Item label="Cajon" name="drawer">
              <Input placeholder="" maxLength="200" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={4}>
            <Form.Item label="Armazón" name="materialCabinet">
              <Input placeholder="" maxLength="200" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24}>
            <Form.Item label="Observaciones" name="observation">
              <Input.TextArea placeholder="" cols={4} />
            </Form.Item>
          </Col>
          <Divider orientation="left">
            <p className="uppercase">
              <b>Acerca de los Precios</b>
            </p>
          </Divider>
          <Col xs={24} sm={24} md={4}>
            <Form.Item label="Coeficiente Tiendas" name="coefficient">
              <div style={{ position: "relative" }}>
                <Input
                  defaultValue={
                    // role === "admin"
                    //   ? data.userId.coefficient
                    //   : data.coefficient
                    data.coefficient
                  }
                  readOnly={!isInputEditable}
                  style={!isInputEditable ? { opacity: 0.7 } : {}}
                />
                {!isInputEditable && (
                  <div
                    onClick={showModal}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      cursor: "pointer",
                    }}
                  ></div>
                )}
              </div>
            </Form.Item>
          </Col>
          <Modal
            title="Introduce la contraseña"
            open={isOpenModal}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Guardar"
            okType="default"
          >
            <Form.Item label="Contraseña">
              <Input.Password
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>
          </Modal>
          <Col xs={24} sm={24} md={2}>
            <Form.Item label="IVA" name="iva">
              <Input placeholder="" maxLength="5" defaultValue="21%" disabled />
            </Form.Item>
          </Col>
          <Divider orientation="left">
            <p className="uppercase">
              <b>Descuentos</b>
            </p>
          </Divider>
          <Col xs={24} sm={24} md={4}>
            <Form.Item label="Encimeras" name="discountEncimeras">
              <Input placeholder="" maxLength="50" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={4}>
            <Form.Item label="Muebles" name="discountCabinets">
              <Input placeholder="" maxLength="50" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={4}>
            <Form.Item
              label="Electrodomésticos"
              name="discountElectrodomesticos"
            >
              <Input placeholder="" maxLength="50" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={4}>
            <Form.Item label="Equipamientos" name="discountEquipamientos">
              <Input placeholder="" maxLength="50" />
            </Form.Item>
          </Col>
          <Divider orientation="left">
            <p className="uppercase">
              <b>IVA</b>
            </p>
          </Divider>
          <Col xs={24} sm={24} md={4}>
            <Form.Item label="Encimeras" name="ivaEncimeras">
              <Input placeholder="" maxLength="50" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={4}>
            <Form.Item label="Muebles" name="ivaCabinets">
              <Input placeholder="" maxLength="50" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={4}>
            <Form.Item label="Electrodomésticos" name="ivaElectrodomesticos">
              <Input placeholder="" maxLength="50" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={4}>
            <Form.Item label="Equipamientos" name="ivaEquipamientos">
              <Input placeholder="" maxLength="50" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={24}>
            <Row>
              <Divider orientation="left">
                <p className="uppercase">
                  <b>Mostrar Precios</b>
                </p>
              </Divider>
              <div className="flex flex-col">
                <Checkbox
                  checked={existePrecio(getPrecio("C"))}
                  onChange={(e) => setPrecio("C", e.target.checked)}
                >
                  Mostrar Precios Clientes
                </Checkbox>
                <Checkbox
                  checked={existePrecio(getPrecio("F"))}
                  onChange={(e) => setPrecio("F", e.target.checked)}
                >
                  Mostrar Precios Fabrica
                </Checkbox>
                <Checkbox
                  checked={existePrecio(getPrecio("P"))}
                  onChange={(e) => setPrecio("P", e.target.checked)}
                >
                  Mostrar Precios Confirmación Pedido
                </Checkbox>
              </div>
            </Row>
            <Row>
              <Divider orientation="left">
                <p className="uppercase">
                  <b>Mostrar Totales</b>
                </p>
              </Divider>
              <div className="flex flex-col">
                <Checkbox
                  checked={existeTotales(getTotales("Encimeras"))}
                  onChange={(e) => setTotales("Encimeras", e.target.checked)}
                >
                  Mostrar Totales Encimeras
                </Checkbox>
                <Checkbox
                  checked={existeTotales(getTotales("Equipamiento"))}
                  onChange={(e) => setTotales("Equipamiento", e.target.checked)}
                >
                  Mostrar Totales Equipamiento
                </Checkbox>
                <Checkbox
                  checked={existeTotales(getTotales("Electrodomesticos"))}
                  onChange={(e) =>
                    setTotales("Electrodomesticos", e.target.checked)
                  }
                >
                  Mostrar Totales Electrodomesticos
                </Checkbox>
              </div>
            </Row>
            <Space>
              <Button
                htmlType="submit"
                type="primary"
                className="flex justify-center items-center"
                style={{
                  height: 50,
                  width: 150,
                  marginTop: 30,
                  padding: "5px 20px",
                  background: "#1a7af8",
                  color: "#fff",
                }}
              >
                Guardar
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default General;
