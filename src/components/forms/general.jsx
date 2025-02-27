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
} from "../../data/localStorage";

const General = ({ getData, data }) => {
  let role = data?.profile?.role || "";
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState({
    ...data,
    coefficient:
      role === "client"
        ? data.userId?.coefficientVentaTienda || 1
        : data?.coefficient || data?.userId?.coefficient || 1,
    observation: data?.observation?.includes("null") ? "" : data.observation,
    fecha: String(data?.fecha).split(" ")[0],
    discountEncimeras: data?.discountEncimeras || 0,
    discountCabinets: data?.discountCabinets || 0,
    discountElectrodomesticos: data?.discountElectrodomesticos || 0,
    discountEquipamientos: data?.discountEquipamientos || 0,
    ivaCabinets: data?.ivaCabinets || 21,
  });

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isInputEditable, setIsInputEditable] = useState(role !== "client");
  const [password, setPassword] = useState("");
  const [isClient, setIsClient] = useState(role === "client");
  const [coefficientValue, setCoefficientValue] = useState(initialValues.coefficient);
  const correctPassword = "1234";

  const [precios, setPrecios] = useState({
    C: existePrecio(getPrecio("C")),
    F: existePrecio(getPrecio("F")),
    P: existePrecio(getPrecio("P")),
  });

  const [totales, setTotales] = useState({
    Encimeras: existeTotales(getTotales("Encimeras")),
    Equipamiento: existeTotales(getTotales("Equipamiento")),
    Electrodomesticos: existeTotales(getTotales("Electrodomesticos")),
  });

  useEffect(() => {
    const newCoefficient =
      role === "client"
        ? data.userId?.coefficientVentaTienda || 1
        : data?.coefficient || data?.userId?.coefficient || 1;
    setCoefficientValue(newCoefficient);
    form.setFieldsValue({ coefficient: newCoefficient });
    setInitialValues((prev) => ({
      ...prev,
      ...data,
      coefficient: newCoefficient,
    }));
  }, [data, form, role]);

  const handlePrecioChange = (key) => {
    const newPrecios = { ...precios, [key]: !precios[key] };
    setPrecios(newPrecios);
    setPrecio(key, newPrecios[key]);
  };

  const handleTotalesChange = (key) => {
    const newTotales = { ...totales, [key]: !totales[key] };
    setTotales(newTotales);
    setTotales(key, newTotales[key]);
  };

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

  const handleCoefficientChange = (e) => {
    setCoefficientValue(e.target.value);
    form.setFieldsValue({ coefficient: e.target.value });
  };

  const handleCancel = () => {
    setIsOpenModal(false);
    setPassword("");
  };

  const onFinish = async (values) => {
    if (data._id) {
      const updatedData = {
        ...data,
        ...values,
        coefficient: parseFloat(coefficientValue) || 1,
      };
      const response = await updateOrder({ ...updatedData, _id: data._id });
      if (response) {
        const result = {
          ...response.order,
          userId: response.user || data.userId,
        };
        console.log("Datos enviados a getData:", result);
        getData(result);
        setInitialValues(result);
        setLocalOrder(result);
        try {
          localStorage.setItem("order", JSON.stringify(result));
          console.log("localStorage actualizado:", JSON.parse(localStorage.getItem("order")));
        } catch (error) {
          console.error("Error al actualizar localStorage:", error);
        }
        message.success("Se ha actualizado correctamente");
      } else {
        console.error("Error en updateOrder, response:", response);
      }
    }
  };

  return (
    <Card className="rounded-none bg-gray border border-border">
      <Form
        layout="vertical"
        form={form}
        initialValues={initialValues}
        onFinish={onFinish}
      >
        <Row gutter={16}>
          <Col xs={24} sm={24} md={24}>
            <Divider orientation="left">
              <p className="uppercase"><b>Acerca del Cliente</b></p>
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
            <p className="uppercase"><b>Acerca del Mueble</b></p>
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
            <Form.Item label="Tirador" name="modelHandler">
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
            <p className="uppercase"><b>Acerca de los Precios</b></p>
          </Divider>
          <Col xs={24} sm={24} md={4}>
            <Form.Item label="Coeficiente de Venta" name="coefficient">
              <div style={{ position: "relative" }}>
                <Input
                  value={coefficientValue}
                  onChange={handleCoefficientChange}
                  readOnly={!isInputEditable}
                  style={!isInputEditable ? { opacity: 0.7 } : {}}
                  disabled={role === "admin"}
                  type="number" // Asegurar que sea numérico
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
          {role === "admin" && (
            <Col xs={24} sm={24} md={4}>
              <Form.Item label="Coeficiente Venta" name="coefficientVentaTienda">
                <Input
                  value={data?.userId?.coefficientVentaTienda}
                  readOnly={!isInputEditable}
                  style={!isInputEditable ? { opacity: 0.7 } : {}}
                  disabled={true}
                />
              </Form.Item>
            </Col>
          )}
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
          <Divider orientation="left">
            <p className="uppercase"><b>Descuentos</b></p>
          </Divider>
          <Col xs={24} sm={24} md={4}>
            <Form.Item label="Encimeras" name="discountEncimeras">
              <Input placeholder="" maxLength="50" type="number" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={4}>
            <Form.Item label="Muebles" name="discountCabinets">
              <Input placeholder="" maxLength="50" type="number" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={4}>
            <Form.Item label="Electrodomésticos" name="discountElectrodomesticos">
              <Input placeholder="" maxLength="50" type="number" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={4}>
            <Form.Item label="Equipamientos" name="discountEquipamientos">
              <Input placeholder="" maxLength="50" type="number" />
            </Form.Item>
          </Col>
          <Divider orientation="left">
            <p className="uppercase"><b>IVA</b></p>
          </Divider>
          <Col xs={24} sm={24} md={4}>
            <Form.Item label="Encimeras" name="ivaEncimeras">
              <Input placeholder="" maxLength="50" type="number" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={4}>
            <Form.Item label="Muebles" name="ivaCabinets">
              <Input placeholder="" maxLength="50" type="number" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={4}>
            <Form.Item label="Electrodomésticos" name="ivaElectrodomesticos">
              <Input placeholder="" maxLength="50" type="number" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={4}>
            <Form.Item label="Equipamientos" name="ivaEquipamientos">
              <Input placeholder="" maxLength="50" type="number" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24}>
            <Row>
              <Divider orientation="left">
                <p className="uppercase"><b>Mostrar Precios</b></p>
              </Divider>
              <div className="flex flex-col">
                <Checkbox
                  checked={precios.C}
                  onChange={() => handlePrecioChange("C")}
                >
                  Mostrar Precios Clientes
                </Checkbox>
                <Checkbox
                  checked={precios.F}
                  onChange={() => handlePrecioChange("F")}
                >
                  Mostrar Precios Fabrica
                </Checkbox>
                <Checkbox
                  checked={precios.P}
                  onChange={() => handlePrecioChange("P")}
                >
                  Mostrar Precios Confirmación Pedido
                </Checkbox>
              </div>
            </Row>
            <Row>
              <Divider orientation="left">
                <p className="uppercase"><b>Mostrar Totales</b></p>
              </Divider>
              <div className="flex flex-col">
                <Checkbox
                  checked={totales.Encimeras}
                  onChange={() => handleTotalesChange("Encimeras")}
                >
                  Mostrar Totales Encimeras
                </Checkbox>
                <Checkbox
                  checked={totales.Equipamiento}
                  onChange={() => handleTotalesChange("Equipamiento")}
                >
                  Mostrar Totales Equipamiento
                </Checkbox>
                <Checkbox
                  checked={totales.Electrodomesticos}
                  onChange={() => handleTotalesChange("Electrodomesticos")}
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