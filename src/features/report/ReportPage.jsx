import { useState, useMemo, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Tabs, Card, Button, Space, Form } from "antd";

import { useOrder } from "../../context";
import { useUser } from "../../context/UserContext";
import { useReportData } from "../../shared/hooks/useReportData";

// Hooks
import { useReportConfig } from "./hooks/useReportConfig";
import { useGeneralForm } from "./hooks/useGeneralForm";
import { useProductsManager } from "./hooks/useProductsManager";
import { useProfileForm } from "./hooks/useProfileForm";

// UI
import GeneralForm from "./ui/GeneralForm";
import ProductsTab from "./ui/ProductsTab";
import ProfileForm from "./ui/ProfileForm";
import PdfViewer from "./ui/PdfViewer";

// PDF Reports
import Confirmacion_Pedido from "../../widgets/pdf-reports/ConfirmacionPedido";
import Confirmacion_Pedido_Venta from "../../widgets/pdf-reports/ConfirmacionPedidoVenta";
import Presupuesto_Cliente from "../../widgets/pdf-reports/PresupuestoCliente";

import LogoERP from "../../assets/logoERP.png";
import "./ReportPage.css";

const ReportPage = () => {
  const { order } = useOrder();
  const { user } = useUser();
  const [tabActivo, setTabActivo] = useState(0);

  const config = useReportConfig();
  const general = useGeneralForm(order);
  const products = useProductsManager(order);
  const profile = useProfileForm(order);

  const { reportData, loading } = useReportData(
    order?._id,
    tabActivo,
    config.ivaIncluido
  );

  const pdfData = reportData?.processedOrder;
  const totals = reportData?.totals || {};

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const tabs = useMemo(
    () => [
      {
        key: "0",
        label: "Confirmación de Pedido",
        children: (
          <div className="alturaPreview-presu">
            <PdfViewer loading={loading}>
              <Confirmacion_Pedido
                price={config.precios.P}
                data={pdfData}
                totalconDescuento={totals.totalConDescuento}
                ivaCalculado={totals.ivaCalculado}
                resultadoFinal={totals.totalFinal}
                importeTotal={totals.importeTotal}
                descuentoAplicado={totals.descuentoAplicado}
                title="Confirmación de Pedido"
                ivaIncluido={config.ivaIncluido}
              />
            </PdfViewer>
          </div>
        ),
      },
      {
        key: "1",
        label: "Presupuesto",
        children: (
          <div className="alturaPreview-presu">
            <PdfViewer loading={loading}>
              <Confirmacion_Pedido
                price={config.precios.P}
                data={pdfData}
                title="Presupuesto"
                totalconDescuento={totals.totalConDescuento}
                ivaCalculado={totals.ivaCalculado}
                resultadoFinal={totals.totalFinal}
                importeTotal={totals.importeTotal}
                descuentoAplicado={totals.descuentoAplicado}
                ivaIncluido={config.ivaIncluido}
              />
            </PdfViewer>
          </div>
        ),
      },
      {
        key: "2",
        label: "Presupuesto Venta Detallado",
        children: (
          <div className="alturaPreview-presu">
            <PdfViewer loading={loading}>
              <Confirmacion_Pedido_Venta
                data={pdfData}
                price={config.precios.P}
                title="Presupuesto Venta"
                totalconDescuento={totals.totalConDescuento}
                ivaCalculado={totals.ivaCalculado}
                resultadoFinal={totals.totalFinal}
                importeTotal={totals.importeTotal}
                descuentoAplicado={totals.descuentoAplicado}
                ivaIncluido={config.ivaIncluido}
              />
            </PdfViewer>
          </div>
        ),
      },
      {
        key: "3",
        label: "Presupuesto Venta Simplificado",
        children: (
          <div className="alturaPreview-presu">
            <PdfViewer loading={loading}>
              <Presupuesto_Cliente
                totalEncimeras={config.totales.Encimeras}
                totalEquipamiento={config.totales.Equipamiento}
                totalElectrodomesticos={config.totales.Electrodomesticos}
                price={config.precios.C}
                totalconDescuento={totals.totalConDescuento}
                ivaCalculado={totals.ivaCalculado}
                resultadoFinal={totals.totalFinal}
                importeTotal={totals.importeTotal}
                descuentoAplicado={totals.descuentoAplicado}
                data={pdfData}
                ivaIncluido={config.ivaIncluido}
              />
            </PdfViewer>
          </div>
        ),
      },
      {
        key: "4",
        label: "Información General",
        children: (
          <div className="alturaPreview">
            <GeneralForm
              initialValues={general.initialValues}
              onFinish={general.onFinish}
              ivaIncluido={config.ivaIncluido}
              precios={config.precios}
              totales={config.totales}
              onIvaIncluidoChange={config.handleIvaIncluidoChange}
              onPrecioChange={config.handlePrecioChange}
              onTotalesChange={config.handleTotalesChange}
              role={user?.role}
              order={order}
            />
          </div>
        ),
      },
      {
        key: "5",
        label: "Complementos",
        children: (
          <div className="alturaPreview">
            <ProductsTab
              form={form}
              editForm={editForm}
              order={order}
              state={products.state}
              loading={products.loading}
              onTypeChange={products.setType}
              onSetEncimera={products.setEncimera}
              onOpenSearch={() => products.updateModals({ isModalOpen: true })}
              onCloseSearch={() => products.updateModals({ isModalOpen: false })}
              onOpenEdit={(record) => {
                editForm.setFieldsValue(record);
                products.updateModals({ isEditModalOpen: true });
              }}
              onCloseEdit={() =>
                products.updateModals({ isEditModalOpen: false })
              }
              onFinish={products.onFinish}
              onEditFinish={products.onEditFinish}
              onDelete={products.deleteProduct}
            />
          </div>
        ),
      },
      {
        key: "6",
        label: "Mi Perfil",
        children: (
          <div className="alturaPreview">
            <ProfileForm
              initialValues={profile.initialValues}
              onFinish={profile.onFinish}
              loading={profile.loading}
              role={user?.role}
            />
          </div>
        ),
      },
    ],
    [
      loading,
      pdfData,
      totals,
      config,
      general,
      products,
      profile,
      user?.role,
      order,
      form,
      editForm,
    ]
  );

  if (!order || !order._id) return null;

  return (
    <main style={{ display: "flex", flexDirection: "column" }} id="main">
      <Card
        style={{ borderRadius: 0, margin: 0, border: "none" }}
        styles={{ body: { paddingTop: 0 } }}
      >
        <header
          style={{
            border: "1px solid var(--color-border)",
            background: "var(--color-bg-layout)",
            padding: 20,
          }}
        >
          <h1
            style={{ fontSize: "var(--font-sv)", padding: 8, display: "inline" }}
          >
            Ordén{" "}
            <NavLink
              to="/Dashboard/Presupuestos"
              style={{ fontStyle: "italic", fontWeight: "bold" }}
            >
              #{order?.orderCode || "Sin especificar"}
            </NavLink>
          </h1>
          <Button
            style={{ float: "right", width: 150 }}
            type="default"
            onClick={() => {
              const contenidoJSON = JSON.stringify(order, null, 2);
              const blob = new Blob([contenidoJSON], {
                type: "application/json",
              });
              const url = URL.createObjectURL(blob);
              const enlace = document.createElement("a");
              enlace.href = url;
              enlace.download = `${order.storeName} ${order.customerName}.json`;
              document.body.appendChild(enlace);
              enlace.click();
              document.body.removeChild(enlace);
              URL.revokeObjectURL(url);
            }}
          >
            <Space>
              <img width={20} src={LogoERP} alt="logo" /> Export Ardis
            </Space>
          </Button>
        </header>
        <Tabs
          onChange={(key) => setTabActivo(parseInt(key))}
          activeKey={tabActivo.toString()}
          centered
          items={tabs}
        />
      </Card>
    </main>
  );
};

export default ReportPage;
