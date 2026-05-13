import {
  Button,
  Input,
  Form,
  Card,
  Row,
  Col,
  Divider,
  Checkbox,
} from "antd";

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

const GeneralForm = ({
  initialValues,
  onFinish,
  ivaIncluido,
  precios,
  totales,
  onIvaIncluidoChange,
  onPrecioChange,
  onTotalesChange,
  role,
  order,
}) => {
  const [form] = Form.useForm();

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
            <FormField label="Fecha Confirmación" name="fecha" type="date" span={4} />
            <FormField label="Envio Mercancia" name="fechaEntrega" type="date" span={4} />
            <FormField label="Semana de Entrega" name="semanaEntrega" span={4} />
            <FormField label="Nombre Cliente" name="customerName" maxLength={100} span={5} />
            <FormField label="Teléfono" name="phone" maxLength={15} span={3} />
            <FormField label="Localización" name="location" maxLength={100} span={4} />

            <DividerSection title="Acerca del Mueble" />
            <FormField label="Modelo" name="modelDoor" maxLength={50} span={5} />
            <FormField label="Acabado" name="materialDoor" maxLength={200} span={5} />
            <FormField label="Tirador" name="modelHandler" maxLength={200} span={5} />
            <FormField label="Cajon" name="drawer" maxLength={200} span={5} />
            <FormField label="Armazón" name="materialCabinet" maxLength={200} span={4} />
            <FormField label="Observaciones" name="observation" type="textarea" span={24} />

            {role === "client" && (
              <>
                <DividerSection title="Acerca de los Precios" />
                <FormField
                  label="Coeficiente de Venta"
                  name="coefficient"
                  span={4}
                  customInput={
                    <Input
                      value={order?.coefficient}
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
                      value={order?.userId?.coefficient || ""}
                      style={{ opacity: 0.7, cursor: "pointer" }}
                      disabled
                    />
                  }
                />
              </>
            )}

            <DividerSection title="Descuentos" />
            <FormField label="Encimeras" name="discountEncimeras" maxLength={50} span={4} />
            <FormField label="Muebles" name="discountCabinets" maxLength={50} span={4} />
            <FormField label="Electrodomésticos" name="discountElectrodomesticos" maxLength={50} span={4} />
            <FormField label="Equipamientos" name="discountEquipamientos" maxLength={50} span={4} />

            <DividerSection title="IVA" />
            <FormField label="Encimeras" name="ivaEncimeras" maxLength={50} span={4} />
            <FormField label="Muebles" name="ivaCabinets" maxLength={50} span={4} />
            <FormField label="Electrodomésticos" name="ivaElectrodomesticos" maxLength={50} span={4} />
            <FormField label="Equipamientos" name="ivaEquipamientos" maxLength={50} span={4} />

            <Col span={24}>
              <CheckboxGroup
                title="Mostrar Precios"
                options={[
                  { label: "Clientes", key: "C", checked: precios.C, onChange: onPrecioChange },
                  { label: "Fabrica", key: "F", checked: precios.F, onChange: onPrecioChange },
                  { label: "Confirmación Pedido", key: "P", checked: precios.P, onChange: onPrecioChange },
                ]}
              />
              <CheckboxGroup
                title="Mostrar Totales"
                options={[
                  { label: "Encimeras", key: "Encimeras", checked: totales.Encimeras, onChange: onTotalesChange },
                  { label: "Equipamiento", key: "Equipamiento", checked: totales.Equipamiento, onChange: onTotalesChange },
                  { label: "Electrodomesticos", key: "Electrodomesticos", checked: totales.Electrodomesticos, onChange: onTotalesChange },
                ]}
              />
              <DividerSection title="IVA en Precios" />
              <Checkbox checked={ivaIncluido} onChange={() => onIvaIncluidoChange(!ivaIncluido)}>
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

export default GeneralForm;
