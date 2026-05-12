import { useEffect, useState } from "react";
import { useReportData } from "../../../shared/hooks/useReportData";
import { NavLink } from "react-router-dom";
import { General, Product, Profile } from "./../../index";
import { Tabs, Card, Button, Space, Spin } from "antd";
import { PDFViewer } from "@react-pdf/renderer";
import Confirmacion_Pedido from "../../../widgets/pdf-reports/ConfirmacionPedido";
import Confirmacion_Pedido_Venta from "../../../widgets/pdf-reports/ConfirmacionPedidoVenta";
import Presupuesto_Cliente from "../../../widgets/pdf-reports/PresupuestoCliente";
import LogoERP from "../../../assets/logoERP.png";
import {
  existePrecio,
  existeTotales,
  existeIvaIncluido,
  getPrecio,
  getTotales,
  getIvaIncluido,
} from "../../../shared/lib/storage";
import { useOrder } from "../../../context";
import "./report.css";

const Report = () => {
  const { order } = useOrder();
  const [main, setMain] = useState(null);
  const [visible, setBtnVisible] = useState(false);
  const [tabActivo, setTabActivo] = useState(0);
  const [ivaIncluido, setIvaIncluido] = useState(() => existeIvaIncluido(getIvaIncluido()));

  const { reportData, loading } = useReportData(order?._id, tabActivo, ivaIncluido);
  const pdfData = reportData?.processedOrder;
  const { importeTotal, descuentoAplicado, totalConDescuento, ivaCalculado, totalFinal } =
    reportData?.totals || {};

  useEffect(() => {
    if (main) {
      const handleScroll = () => setBtnVisible(main.scrollTop > 100);
      main.addEventListener("scroll", handleScroll);
      return () => main.removeEventListener("scroll", handleScroll);
    }
  }, [main]);

  const pdfViewer = (children) =>
    loading ? (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <Spin size="large" />
      </div>
    ) : pdfData ? (
      children
    ) : null;

  const tabs = [
    {
      key: "0",
      label: "Confirmación de Pedido",
      component: (
        <div className="alturaPreview-presu">
          {pdfViewer(
            <PDFViewer style={{ width: "100%", height: "100%" }}>
              <Confirmacion_Pedido
                price={existePrecio(getPrecio("P"))}
                data={pdfData}
                totalconDescuento={totalConDescuento}
                ivaCalculado={ivaCalculado}
                resultadoFinal={totalFinal}
                importeTotal={importeTotal}
                descuentoAplicado={descuentoAplicado}
                title="Confirmación de Pedido"
                ivaIncluido={ivaIncluido}
              />
            </PDFViewer>
          )}
        </div>
      ),
    },
    {
      key: "1",
      label: "Presupuesto",
      component: (
        <div className="alturaPreview-presu">
          {pdfViewer(
            <PDFViewer style={{ width: "100%", height: "100%" }}>
              <Confirmacion_Pedido
                price={existePrecio(getPrecio("P"))}
                data={pdfData}
                title="Presupuesto"
                totalconDescuento={totalConDescuento}
                ivaCalculado={ivaCalculado}
                resultadoFinal={totalFinal}
                importeTotal={importeTotal}
                descuentoAplicado={descuentoAplicado}
                ivaIncluido={ivaIncluido}
              />
            </PDFViewer>
          )}
        </div>
      ),
    },
    {
      key: "2",
      label: "Presupuesto Venta Detallado",
      component: (
        <div className="alturaPreview-presu">
          {pdfViewer(
            <PDFViewer style={{ width: "100%", height: "100%" }}>
              <Confirmacion_Pedido_Venta
                data={pdfData}
                price={existePrecio(getPrecio("P"))}
                title="Presupuesto Venta"
                totalconDescuento={totalConDescuento}
                ivaCalculado={ivaCalculado}
                resultadoFinal={totalFinal}
                importeTotal={importeTotal}
                descuentoAplicado={descuentoAplicado}
                ivaIncluido={ivaIncluido}
              />
            </PDFViewer>
          )}
        </div>
      ),
    },
    {
      key: "3",
      label: "Presupuesto Venta Simplificado",
      component: (
        <div className="alturaPreview-presu">
          {pdfViewer(
            <PDFViewer style={{ width: "100%", height: "100%" }}>
              <Presupuesto_Cliente
                totalEncimeras={existeTotales(getTotales("Encimeras"))}
                totalEquipamiento={existeTotales(getTotales("Equipamiento"))}
                totalElectrodomesticos={existeTotales(getTotales("Electrodomesticos"))}
                price={existePrecio(getPrecio("C"))}
                totalconDescuento={totalConDescuento}
                ivaCalculado={ivaCalculado}
                resultadoFinal={totalFinal}
                importeTotal={importeTotal}
                descuentoAplicado={descuentoAplicado}
                data={pdfData}
                ivaIncluido={ivaIncluido}
              />
            </PDFViewer>
          )}
        </div>
      ),
    },
    {
      key: "4",
      label: "Información General",
      component: (
        <div className="alturaPreview">
          <General
            data={order}
            ivaIncluido={ivaIncluido}
            onIvaIncluidoChange={setIvaIncluido}
          />
        </div>
      ),
    },
    {
      key: "5",
      label: "Complementos",
      component: (
        <div className="alturaPreview">
          <Product />
        </div>
      ),
    },
    {
      key: "6",
      label: "Mi Perfil",
      component: (
        <div className="alturaPreview">
          <Profile data={order} />
        </div>
      ),
    },
  ];

  return (
    order &&
    order._id && (
      <main style={{ display: "flex", flexDirection: "column" }} id="main">
        <Card style={{ borderRadius: 0, margin: 0, border: "none" }} styles={{ body: { paddingTop: 0 } }}>
          <header style={{ border: "1px solid var(--color-border)", background: "var(--color-bg-layout)", padding: 20 }}>
            <h1 style={{ fontSize: "var(--font-sv)", padding: 8, display: "inline" }}>
              Ordén
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
                const blob = new Blob([contenidoJSON], { type: "application/json" });
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
                <img width={20} src={LogoERP} /> Export Ardis
              </Space>
            </Button>
          </header>
          <Tabs
            onChange={(key) => setTabActivo(parseInt(key))}
            activeKey={tabActivo.toString()}
            centered
            defaultActiveKey="0"
            items={tabs.map(({ key, label, component }) => ({
              label,
              key,
              children: component,
            }))}
          />
        </Card>
      </main>
    )
  );
};

export default Report;
