import { useEffect, useState, useMemo } from "react";
import { useReportTotals } from "../../../hooks/useReportTotals";
import { NavLink } from "react-router-dom";
import { General, Product, Profile } from "./../../index";
import { Tabs, Card, Button, Space } from "antd";
import { PDFViewer } from "@react-pdf/renderer";
import Confirmacion_Pedido from "./confirmacion_pedido";
import { Presupuesto_Cliente } from "./index";
import LogoERP from "../../../assets/logoERP.png";
import Confirmacion_Pedido_Venta from "./confirmacion_pedido_venta";
import { getProfile } from "../../../handlers/order";
import {
  existePrecio,
  existeTotales,
  getPrecio,
  getTotales,
} from "../../../data/localStorage";
import { useOrder } from "../../../context";
import "./report.css";

const Report = () => {
  const { order, refreshOrder } = useOrder();
  const [main, setMain] = useState(null);
  const [visible, setBtnVisible] = useState(false);
  const [tabActivo, setTabActivo] = useState(0);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getProfile().then(setProfile);
  }, []);

  useEffect(() => {
    refreshOrder();
  }, [tabActivo]);

  const updatedData = useMemo(() => {
    if (!order || !order.cabinets) return order;

    const newData = JSON.parse(JSON.stringify(order));
    let coeficiente;

    if (tabActivo === 0 || tabActivo === 1) {
      coeficiente = order.userId?.coefficient || 1;
    } else if (tabActivo === 2 || tabActivo === 3) {
      coeficiente = order.coefficient || 1;
    }

    newData.cabinets = newData.cabinets.map((item) => ({
      ...item,
      total: String(item.customcode) === "3333" ? item.total : item.total * coeficiente,
    }));

    return { ...newData, profile };
  }, [order, tabActivo, profile]);

  const totales = useReportTotals(updatedData);

  useEffect(() => {
    if (main) {
      const handleScroll = () => {
        if (main.scrollTop > 100) {
          setBtnVisible(true);
        } else {
          setBtnVisible(false);
        }
      };
      main.addEventListener("scroll", handleScroll);
      return () => main.removeEventListener("scroll", handleScroll);
    }
  }, [main]);

  const { totalConDescuento, totalFinal, importeTotal, ivaCalculado } = totales.resultadoFinal || {};

  const tabs = [
    {
      key: "0",
      label: "Confirmación de Pedido",
      component: (
        <div className="alturaPreview-presu">
          <PDFViewer className="h-full w-full">
            <Confirmacion_Pedido
              price={existePrecio(getPrecio("P"))}
              data={updatedData}
              totalconDescuento={totalConDescuento}
              ivaCalculado={ivaCalculado}
              resultadoFinal={totalFinal}
              importeTotal={importeTotal}
              descuentoAplicado={totales.resultadoFinal?.descuentoAplicado}
              title="Confirmación de Pedido"
            />
          </PDFViewer>
        </div>
      ),
    },
    {
      key: "1",
      label: "Presupuesto",
      component: (
        <div className="alturaPreview-presu">
          <PDFViewer className="h-full w-full">
            <Confirmacion_Pedido
              price={existePrecio(getPrecio("P"))}
              data={updatedData}
              title="Presupuesto"
              totalconDescuento={totalConDescuento}
              ivaCalculado={ivaCalculado}
              resultadoFinal={totalFinal}
              importeTotal={importeTotal}
              descuentoAplicado={totales.resultadoFinal?.descuentoAplicado}
            />
          </PDFViewer>
        </div>
      ),
    },
    {
      key: "2",
      label: "Presupuesto Venta Detallado",
      component: (
        <div className="alturaPreview-presu">
          <PDFViewer className="h-full w-full">
            <Confirmacion_Pedido_Venta
              data={updatedData}
              price={existePrecio(getPrecio("P"))}
              title="Presupuesto Venta"
              totalconDescuento={totalConDescuento}
              ivaCalculado={ivaCalculado}
              resultadoFinal={totalFinal}
              importeTotal={importeTotal}
              descuentoAplicado={totales.resultadoFinal?.descuentoAplicado}
            />
          </PDFViewer>
        </div>
      ),
    },
    {
      key: "3",
      label: "Presupuesto Venta Simplificado",
      component: (
        <div className="alturaPreview-presu">
          <PDFViewer className="h-full w-full">
            <Presupuesto_Cliente
              totalEncimeras={existeTotales(getTotales("Encimeras"))}
              totalEquipamiento={existeTotales(getTotales("Equipamiento"))}
              totalElectrodomesticos={existeTotales(getTotales("Electrodomesticos"))}
              price={existePrecio(getPrecio("C"))}
              totalconDescuento={totalConDescuento}
              ivaCalculado={ivaCalculado}
              resultadoFinal={totalFinal}
              importeTotal={importeTotal}
              descuentoAplicado={totales.resultadoFinal?.descuentoAplicado}
              data={updatedData}
            />
          </PDFViewer>
        </div>
      ),
    },
    {
      key: "4",
      label: "Información General",
      component: (
        <div className="alturaPreview">
          <General data={updatedData} />
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
          <Profile data={updatedData} />
        </div>
      ),
    },
  ];

  return (
    order &&
    order._id && (
      <main className="flex flex-col" id="main">
        <Card className="rounded-none m-0 pt-0 border-0">
          <header
            className="border border-border bg-gray py-4"
            style={{ padding: 20 }}
          >
            <h1 className="text-sv p-2 inline">
              Ordén
              <NavLink
                to="/Dashboard/Presupuestos"
                className="italic font-bold hover:underline hover:text-blue"
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
