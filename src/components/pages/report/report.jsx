import { useEffect, useState, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { General, Product, Muebles } from "./../../index";
import { Tabs, Card } from "antd";
import { PDFViewer } from "@react-pdf/renderer";
import Confirmacion_Pedido from "../../pdf/confirmacion_pedido";
import Presupuesto_Cliente from "../../pdf/presupuesto_cliente";
import Confirmacion_Pedido_Venta from "../../pdf/confirmacion_pedido_venta";
import {
  getOrders,
  getOrderById,
  fixOrder,
  getProfile,
} from "../../../handlers/order";
import { useOrder } from "../../../context/OrderContext";
import { useReportCalculations } from "../../../hooks/useReportCalculations";
import ExportArdisButton from "../../common/ExportArdisButton";
import "./report.css";

const Report = () => {
  const { order, setOrder, preferences } = useOrder();
  const [tabActivo, setTabActivo] = useState(0);
  const [profile, setProfile] = useState(null);

  const { updatedData, totales, filteredCabinets } = useReportCalculations(order, tabActivo);

  useEffect(() => {
    const fetchData = async () => {
      if (order && order._id && !profile) {
        try {
          const result = await getOrderById({ _id: order._id });
          const profileData = await getProfile();
          const updatedInfo = fixOrder(result);
          setProfile(profileData);
          setOrder({ ...updatedInfo, profile: profileData });
          // getOrders call might be redundant if we just fetched by ID, usually getOrders fetches list
        } catch (error) {
          console.error("Error fetching order data:", error);
        }
      }
    };
    fetchData();
  }, [order?._id, profile, setOrder]);

  const { totalConDescuento, totalFinal, importeTotal, ivaCalculado } = totales.resultadoFinal || {};

  const commonProps = useMemo(() => ({
    totalconDescuento: totalConDescuento,
    ivaCalculado,
    resultadoFinal: totalFinal,
    importeTotal,
    descuentoAplicado: totales.resultadoFinal?.descuentoAplicado,
  }), [totalConDescuento, ivaCalculado, totalFinal, importeTotal, totales.resultadoFinal?.descuentoAplicado]);

  const PdfTab = ({ Component, title, price, ...extraProps }) => (
    <div style={{ flex: 1, display: "flex", height: "100%" }}>
      <PDFViewer style={{ height: "100%", width: "100%" }}>
        <Component
          price={price}
          data={updatedData}
          filteredCabinets={filteredCabinets}
          title={title}
          {...commonProps}
          {...extraProps}
        />
      </PDFViewer>
    </div>
  );

  const items = useMemo(() => [
    {
      key: "0",
      label: "Confirmación de Pedido",
      children: <PdfTab Component={Confirmacion_Pedido} title="Confirmación de Pedido" price={preferences.showPrices.P} />
    },
    {
      key: "1",
      label: "Presupuesto",
      children: <PdfTab Component={Confirmacion_Pedido} title="Presupuesto" price={preferences.showPrices.P} />
    },
    {
      key: "2",
      label: "Presupuesto Venta Detallado",
      children: <PdfTab Component={Confirmacion_Pedido_Venta} title="Presupuesto Venta" price={preferences.showPrices.P} />
    },
    {
      key: "3",
      label: "Presupuesto Venta Simplificado",
      children: (
        <PdfTab
          Component={Presupuesto_Cliente}
          price={preferences.showPrices.C}
          totalEncimeras={preferences.showTotals.Encimeras}
          totalEquipamiento={preferences.showTotals.Equipamiento}
          totalElectrodomesticos={preferences.showTotals.Electrodomesticos}
        />
      )
    },
    {
      key: "4",
      label: "Muebles",
      children: <div style={{ flex: 1, overflow: "auto", height: "100%" }}><Muebles /></div>
    },
    {
      key: "5",
      label: "Información General",
      children: <div style={{ flex: 1, overflow: "auto", height: "100%" }}><General /></div>
    },
    {
      key: "6",
      label: "Complementos",
      children: <div style={{ flex: 1, overflow: "auto", height: "100%" }}><Product /></div>
    },
  ], [updatedData, filteredCabinets, commonProps, preferences]);


  if (!order || !order._id) return null;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", padding: "16px", overflow: "hidden" }}>
      <div style={{ flex: "0 0 auto" }}>
        <Card
          style={{ borderRadius: 0, margin: 0, border: "none" }}
          styles={{ body: { padding: "1rem 20px" } }}
        >
          <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h1 style={{ fontSize: "24px", margin: 0 }}>
              Ordén
              <NavLink
                to="/Dashboard/Presupuestos"
                style={{
                  fontStyle: "italic",
                  fontWeight: "bold",
                  marginLeft: "0.5rem",
                  color: "#1677ff",
                  textDecoration: "none",
                }}
              >
                #{order?.orderCode || "Sin especificar"}
              </NavLink>
            </h1>
            <ExportArdisButton />
          </header>
        </Card>
      </div>

      <div style={{ flex: "1 1 auto", overflow: "hidden", marginTop: "16px" }}>
        <Card
          style={{ borderRadius: 0, boxShadow: "none", height: "100%", border: "none" }}
          styles={{ body: { padding: 0, height: "100%", display: "flex", flexDirection: "column" } }}
        >
          <Tabs
            onChange={(key) => setTabActivo(parseInt(key))}
            activeKey={tabActivo.toString()}
            centered
            defaultActiveKey="0"
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
            styles={{ content: { flex: 1, height: "100%" } }}
            items={items}
          />
        </Card>
      </div>
    </div>
  );
};

export default Report;
