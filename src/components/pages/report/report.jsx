import { useEffect, useState, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { General, Product, Profile } from "./../../index";
import { Tabs, Card, Button, Space } from "antd";
import { PDFViewer } from "@react-pdf/renderer";
import Confirmacion_Pedido from "./confirmacion_pedido";
import { Presupuesto_Cliente } from "./index";
import LogoERP from "../../../assets/logoERP.png";
import Confirmacion_Pedido_Venta from "./confirmacion_pedido_venta";
import {
  getOrders,
  getLocalOrder,
  getOrderById,
  fixOrder,
  getProfile,
} from "../../../handlers/order";
import {
  existePrecio,
  existeTotales,
  getPrecio,
  getTotales,
} from "../../../data/localStorage";
import "./report.css";
import {
  calcularTotalIva,
  calcularSumaTotal,
  calcularTotalZocalo,
  calcularTotalDescuentos,
  calcularTotalConDescuentoEIVA,
} from "./operaciones";

const Report = () => {
  const [main, setMain] = useState(null);
  const [data, setData] = useState(JSON.parse(localStorage.getItem("order")));
  const [orderId, setOrderId] = useState(getLocalOrder());
  const [visible, setBtnVisible] = useState(false);
  const [tabActivo, setTabActivo] = useState(0);
  const [profile, setProfile] = useState(null);

  const updatedData = useMemo(() => {
    if (!data || !data.cabinets) return data;

    const newData = JSON.parse(JSON.stringify(data));
    let coeficiente;

    if (tabActivo === 0 || tabActivo === 1) {
      coeficiente = data.userId.coefficient || 1;
      newData.cabinets = newData.cabinets.map((item) => ({
        ...item,
        total: item.total * coeficiente,
      }));
    } else if (tabActivo === 2 || tabActivo === 3) {
      coeficiente = data.coefficient || 1;
      newData.cabinets = newData.cabinets.map((item) => ({
        ...item,
        total: item.total * coeficiente,
      }));
    }

    return newData;
  }, [data, tabActivo]);

  // Calcular totales con useMemo
  const totales = useMemo(() => {
    if (!updatedData || !updatedData.cabinets) {
      return {
        sumaTotal: 0,
        totalZocalo: 0,
        totalDescuentos: 0,
        totalIva: 0,
        resultadoFinal: { importeTotal: 0, descuentoAplicado: 0, totalConDescuento: 0, ivaCalculado: 0, totalFinal: 0 },
      };
    }

    const sumaTotal = calcularSumaTotal(updatedData.cabinets, 1);
    const totalZocalo = calcularTotalZocalo(updatedData.infoZocalos, 1);
    const importeTotalLocal = sumaTotal + totalZocalo; // Renombramos para evitar conflictos
    const totalDescuentos = calcularTotalDescuentos(updatedData, importeTotalLocal);
    const resultado = calcularTotalConDescuentoEIVA(
      updatedData.cabinets,
      updatedData.infoZocalos,
      totalDescuentos,
      updatedData.ivaCabinets,
      1
    );
    const totalIva = calcularTotalIva(resultado.totalConDescuento, updatedData.ivaCabinets);

    return {
      sumaTotal,
      totalZocalo,
      totalDescuentos,
      totalIva,
      resultadoFinal: resultado,
    };
  }, [updatedData]);

  useEffect(() => {
    const fetchData = async () => {
      if (orderId._id) {
        try {
          const result = await getOrderById({ _id: orderId._id });
          const profileData = await getProfile();
          const updatedInfo = fixOrder(result);
          setProfile(profileData);
          setData({ ...updatedInfo, profile: profileData });
          getOrders({ ...updatedInfo, profile: profileData });
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchData();
  }, [tabActivo]);

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
          <General getData={setData} data={updatedData} />
        </div>
      ),
    },
    {
      key: "5",
      label: "Complementos",
      component: (
        <div className="alturaPreview">
          <Product getData={setData} />
        </div>
      ),
    },
    {
      key: "6",
      label: "Mi Perfil",
      component: (
        <div className="alturaPreview">
          <Profile getData={setData} data={updatedData} />
        </div>
      ),
    },
  ];

  return (
    data &&
    data._id && (
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
                #{data?.orderCode || "Sin especificar"}
              </NavLink>
            </h1>
            <Button
              style={{ float: "right", width: 150 }}
              type="default"
              onClick={() => {
                const contenidoJSON = JSON.stringify(
                  JSON.parse(localStorage.getItem("order")),
                  null,
                  2
                );
                const blob = new Blob([contenidoJSON], {
                  type: "application/json",
                });
                const url = URL.createObjectURL(blob);
                const enlace = document.createElement("a");
                enlace.href = url;
                enlace.download = `${
                  JSON.parse(localStorage.getItem("order")).storeName +
                  " " +
                  JSON.parse(localStorage.getItem("order")).customerName
                }.json`;
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
