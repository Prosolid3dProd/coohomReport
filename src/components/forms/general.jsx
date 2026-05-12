import { useState, useMemo } from "react";
import {
  Button,
  Input,
  Form,
  Card,
  Row,
  Col,
  message,
  Divider,
  Checkbox,
} from "antd";
import { updateOrder } from "../../handlers/order";
import { useOrder } from "../../context";
import { useUser } from "../../context/UserContext";
import {
  existePrecio,
  getPrecio,
  setPrecio,
  getTotales,
  setTotales,
  existeTotales,
  setIvaIncluido,
} from "../../shared/lib/storage";

const General = ({ data, ivaIncluido = false, onIvaIncluidoChange }) => {
  const { refreshOrder } = useOrder();
  const { user } = useUser();
  const [form] = Form.useForm();
  const role = user?.role || "";

  const [precios, setPrecios] = useState({
    C: existePrecio(getPrecio("C")),
    F: existePrecio(getPrecio("F")),
    P: existePrecio(getPrecio("P")),
  });

  const [totales, setTotalesState] = useState({
    Encimeras: existeTotales(getTotales("Encimeras")),
    Equipamiento: existeTotales(getTotales("Equipamiento")),
    Electrodomesticos: existeTotales(getTotales("Electrodomesticos")),
  });

  const initialValues = useMemo(() => ({
    ...data,
    observation: data?.observation?.includes("null")
      ? ""
      : data?.observation || "",
    fecha: data?.fecha?.split(" ")[0] || "",
    fechaEntrega: data?.fechaEntrega?.split(" ")[0] || "",
    coefficient: data?.coefficient || "",
    drawer: `${data?.modelDrawer || ""}${data?.materialDrawer || ""}`,
    discountEncimeras: data?.discountEncimeras || "",
    discountCabinets: data?.discountCabinets || "",
    discountElectrodomesticos: data?.discountElectrodomesticos || "",
    discountEquipamientos: data?.discountEquipamientos || "",
    modelHandler: data?.modelHandler || "",
    semanaEntrega: data?.semanaEntrega || "",
    customerName: data?.customerName || "",
    phone: data?.phone || "",
    location: data?.location || "",
    modelDoor: data?.modelDoor || "",
    materialDoor: data?.materialDoor || "",
    materialCabinet: data?.materialCabinet || "",
    ivaEncimeras: data?.ivaEncimeras || "",
    ivaCabinets: data?.ivaCabinets || "",
    ivaElectrodomesticos: data?.ivaElectrodomesticos || "",
    ivaEquipamientos: data?.ivaEquipamientos || "",
  }), [data]);

  const handlePrecioChange = (key) => {
    setPrecios((prev) => {
      const newValue = !prev[key];
      setPrecio(key, newValue);
      return { ...prev, [key]: newValue };
    });
  };

  const handleTotalesChange = (key) => {
    setTotalesState((prev) => {
      const newValue = !prev[key];
      setTotales(key, newValue);
      return { ...prev, [key]: newValue };
    });
  };

  const handleIvaIncluidoChange = () => {
    const newValue = !ivaIncluido;
    setIvaIncluido(newValue);
    if (onIvaIncluidoChange) onIvaIncluidoChange(newValue);
  };

  const onFinish = async (values) => {
    if (!data?._id) {
      message.error("No se encontró el ID del pedido");
      return;
    }

    try {
      const updatedOrder = { ...data, ...values, _id: data._id };

      const result = await updateOrder(updatedOrder);

      if (result && result.order && result.order._id) {
        message.success("Se ha actualizado correctamente");
        refreshOrder();
      } else {
        throw new Error("La respuesta de updateOrder no contiene un order válido");
      }
    } catch (error) {
      console.error("Error en onFinish:", error);
      message.error("Error al guardar los cambios: " + error.message);
      form.resetFields();
    }
  };

  if (!data) {
    return <div>No hay datos disponibles para mostrar.</div>;
  }

  return (
    <Card style={{ borderRadius: 0, background: "var(--color-bg-layout)", border: "1px solid var(--color-border)" }}>
      <div style={{ maxHeight: "70vh", overflowY: "auto", padding: "0 16px" }}>
        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
          onFinish={onFinish}
        >
          <Row gutter={16}>
            <DividerSection title="Acerca del Cliente" />
            <FormField
              label="Fecha Confirmación"
              name="fecha"
              type="date"
              span={4}
            />
            <FormField
              label="Envio Mercancia"
              name="fechaEntrega"
              type="date"
              span={4}
            />
            <FormField
              label="Semana de Entrega"
              name="semanaEntrega"
              span={4}
            />
            <FormField
              label="Nombre Cliente"
              name="customerName"
              maxLength={100}
              span={5}
            />
            <FormField label="Teléfono" name="phone" maxLength={15} span={3} />
            <FormField
              label="Localización"
              name="location"
              maxLength={100}
              span={4}
            />

            <DividerSection title="Acerca del Mueble" />
            <FormField
              label="Modelo"
              name="modelDoor"
              maxLength={50}
              span={5}
            />
            <FormField
              label="Acabado"
              name="materialDoor"
              maxLength={200}
              span={5}
            />
            <FormField
              label="Tirador"
              name="modelHandler"
              maxLength={200}
              span={5}
            />
            <FormField label="Cajon" name="drawer" maxLength={200} span={5} />
            <FormField
              label="Armazón"
              name="materialCabinet"
              maxLength={200}
              span={4}
            />
            <FormField
              label="Observaciones"
              name="observation"
              type="textarea"
              span={24}
            />

            {role === "client" && (
              <>
                <DividerSection title="Acerca de los Precios" />
                <FormField
                  label="Coeficiente de Venta"
                  name="coefficient"
                  span={4}
                  customInput={
                    <Input
                      value={data.coefficient}
                      readOnly
                      style={{ opacity: 0.7 }}
                    />
                  }
                />
              </>
            )}

            {role === "admin" && (
              <>
                <DividerSection title="Acerca de los Precios" />
                <FormField
                  label="Coeficiente Venta Cliente"
                  span={4}
                  customInput={
                    <Input
                      value={data.userId?.coefficient || ""}
                      style={{ opacity: 0.7, cursor: "pointer" }}
                      disabled
                    />
                  }
                />
              </>
            )}

            <DividerSection title="Descuentos" />
            <FormField
              label="Encimeras"
              name="discountEncimeras"
              maxLength={50}
              span={4}
            />
            <FormField
              label="Muebles"
              name="discountCabinets"
              maxLength={50}
              span={4}
            />
            <FormField
              label="Electrodomésticos"
              name="discountElectrodomesticos"
              maxLength={50}
              span={4}
            />
            <FormField
              label="Equipamientos"
              name="discountEquipamientos"
              maxLength={50}
              span={4}
            />

            <DividerSection title="IVA" />
            <FormField
              label="Encimeras"
              name="ivaEncimeras"
              maxLength={50}
              span={4}
            />
            <FormField
              label="Muebles"
              name="ivaCabinets"
              maxLength={50}
              span={4}
            />
            <FormField
              label="Electrodomésticos"
              name="ivaElectrodomesticos"
              maxLength={50}
              span={4}
            />
            <FormField
              label="Equipamientos"
              name="ivaEquipamientos"
              maxLength={50}
              span={4}
            />

            <Col span={24}>
              <CheckboxGroup
                title="Mostrar Precios"
                options={[
                  {
                    label: "Clientes",
                    key: "C",
                    checked: precios.C,
                    onChange: handlePrecioChange,
                  },
                  {
                    label: "Fabrica",
                    key: "F",
                    checked: precios.F,
                    onChange: handlePrecioChange,
                  },
                  {
                    label: "Confirmación Pedido",
                    key: "P",
                    checked: precios.P,
                    onChange: handlePrecioChange,
                  },
                ]}
              />
              <CheckboxGroup
                title="Mostrar Totales"
                options={[
                  {
                    label: "Encimeras",
                    key: "Encimeras",
                    checked: totales.Encimeras,
                    onChange: handleTotalesChange,
                  },
                  {
                    label: "Equipamiento",
                    key: "Equipamiento",
                    checked: totales.Equipamiento,
                    onChange: handleTotalesChange,
                  },
                  {
                    label: "Electrodomesticos",
                    key: "Electrodomesticos",
                    checked: totales.Electrodomesticos,
                    onChange: handleTotalesChange,
                  },
                ]}
              />
              <DividerSection title="IVA en Precios" />
              <Checkbox checked={ivaIncluido} onChange={handleIvaIncluidoChange}>
                IVA incluido en precio de artículos
              </Checkbox>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  height: 50,
                  width: 150,
                  marginTop: 30,
                  background: "#1a7af8",
                }}
              >
                Guardar
              </Button>
            </Col>
          </Row>
        </Form>
      </div>

    </Card>
  );
};

// Componentes reutilizables
const DividerSection = ({ title }) => (
  <Col span={24}>
    <Divider orientation="left">
      <p style={{ textTransform: "uppercase" }}>
        <b>{title}</b>
      </p>
    </Divider>
  </Col>
);

const FormField = ({
  label,
  name,
  span,
  type = "text",
  maxLength,
  customInput,
}) => (
  <Col xs={24} sm={24} md={span}>
    <Form.Item label={label} name={name}>
      {customInput ||
        (type === "textarea" ? (
          <Input.TextArea cols={4} />
        ) : (
          <Input type={type} maxLength={maxLength} />
        ))}
    </Form.Item>
  </Col>
);

const CheckboxGroup = ({ title, options }) => (
  <Row>
    <DividerSection title={title} />
    <div style={{ display: "flex", flexDirection: "column" }}>
      {options.map(({ label, key, checked, onChange }) => (
        <Checkbox key={key} checked={checked} onChange={() => onChange(key)}>
          Mostrar {label}
        </Checkbox>
      ))}
    </div>
  </Row>
);

export default General;