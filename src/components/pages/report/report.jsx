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
  const [data, setData] = useState(() => {
    const storedOrder = JSON.parse(localStorage.getItem("order"));
    console.log("Datos iniciales desde localStorage:", storedOrder);
    return storedOrder;
  });
  const [orderId, setOrderId] = useState(getLocalOrder());
  const [visible, setBtnVisible] = useState(false);
  const [tabActivo, setTabActivo] = useState(0);
  const [profile, setProfile] = useState(null);
  const priceC = existePrecio(getPrecio("C"));
  const priceP = existePrecio(getPrecio("P"));
  const total_Encimeras = existeTotales(getTotales("Encimeras"));
  const total_Equipamiento = existeTotales(getTotales("Equipamiento"));
  const total_Electrodomesticos = existeTotales(
    getTotales("Electrodomesticos")
  );
  const [totales, setTotales] = useState({
    sumaTotal: 0,
    totalZocalo: 0,
    totalDescuentos: 0,
    totalIva: 0,
    resultadoFinal: {},
  });

  const dataAjustada = useMemo(() => {
    if (!data || !data.cabinets || !data.infoZocalos) return data;

    let coeficiente;
    if (tabActivo === 0 || tabActivo === 1) {
      coeficiente = parseFloat(data.userId?.coefficient) || 1;
    } else if (tabActivo === 2 || tabActivo === 3) {
      coeficiente = parseFloat(data.coefficient) || 1;
    } else {
      coeficiente = 1;
    }

    console.log("Coeficiente usado:", coeficiente, "Tab activo:", tabActivo);

    return {
      ...data,
      cabinets: data.cabinets.map((item) => ({
        ...item,
        total: (parseFloat(item.total) || 0) * coeficiente,
      })),
      infoZocalos: data.infoZocalos.map((zocalo) => ({
        ...zocalo,
        precio: (parseFloat(zocalo.precio) || 0) * coeficiente,
      })),
      discountCabinets: parseFloat(data.discountCabinets) || 0, // No ajustar por coeficiente aquí
      coeficiente,
    };
  }, [data, tabActivo]);

  const handleTabChange = (key) => {
    setTabActivo(parseInt(key));
    localStorage.setItem("activeTab", key);
  };

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
  }, [orderId]);

  useEffect(() => {
    if (tabActivo <= 3 && orderId._id && data) {
      const fetchProfile = async () => {
        const profileData = await getProfile();
        setProfile(profileData);
      };
      fetchProfile();
    }
  }, [tabActivo, data, orderId]);

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

  useEffect(() => {
    // Solo calcular totales para tabs 0, 1, 2 y 3
    if (tabActivo > 3 || !dataAjustada || !dataAjustada.cabinets || !dataAjustada.infoZocalos) {
      setTotales({
        sumaTotal: 0,
        totalZocalo: 0,
        totalDescuentos: 0,
        totalIva: 0,
        resultadoFinal: {},
      });
      return;
    }

    const coeficiente = dataAjustada.coeficiente;

    const sumaTotalBase = calcularSumaTotal(dataAjustada.cabinets);
    const totalZocaloBase = calcularTotalZocalo(dataAjustada.infoZocalos);
    const importeTotalBase = sumaTotalBase + totalZocaloBase;

    // Interpretar discountCabinets como porcentaje del importeTotal
    const discountPercentage = (parseFloat(dataAjustada.discountCabinets) || 0) / 100;
    const totalDescuentosBase = importeTotalBase * discountPercentage;

    // Multiplicar totales por coeficiente solo en tabs 2 y 3
    const sumaTotal = (tabActivo === 2 || tabActivo === 3) ? sumaTotalBase * coeficiente : sumaTotalBase;
    const totalZocalo = (tabActivo === 2 || tabActivo === 3) ? totalZocaloBase * coeficiente : totalZocaloBase;
    const importeTotal = sumaTotal + totalZocalo;
    const totalDescuentos = (tabActivo === 2 || tabActivo === 3) ? totalDescuentosBase * coeficiente : totalDescuentosBase;

    const totalConDescuento = importeTotal - totalDescuentos;
    const totalIva = calcularTotalIva(totalConDescuento, dataAjustada.ivaCabinets || 21);
    const totalFinal = totalConDescuento + totalIva;

    setTotales({
      sumaTotal,
      totalZocalo,
      totalDescuentos,
      totalIva,
      resultadoFinal: {
        importeTotal,
        descuentoAplicado: totalDescuentos,
        totalConDescuento,
        ivaCalculado: totalIva,
        totalFinal,
      },
    });

    console.log("Totales actualizados:", {
      sumaTotalBase,
      totalZocaloBase,
      importeTotalBase,
      discountPercentage,
      totalDescuentosBase,
      sumaTotal,
      totalZocalo,
      totalDescuentos,
      importeTotal,
      totalConDescuento,
      totalIva,
      totalFinal,
      coeficiente,
      tabActivo,
    });
  }, [dataAjustada, tabActivo]);

  const { totalConDescuento, totalFinal, importeTotal, ivaCalculado } = totales.resultadoFinal || {};

  const tabs = [
    {
      key: "0",
      label: "Confirmación de Pedido",
      component: (
        <div className="alturaPreview-presu">
          <PDFViewer className="h-full w-full">
            <Confirmacion_Pedido
              price={priceP}
              data={dataAjustada}
              totalconDescuento={totalConDescuento}
              ivaCalculado={ivaCalculado}
              resultadoFinal={totalFinal}
              importeTotal={importeTotal}
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
              price={priceP}
              data={dataAjustada}
              title="Presupuesto"
              totalconDescuento={totalConDescuento}
              ivaCalculado={ivaCalculado}
              resultadoFinal={totalFinal}
              importeTotal={importeTotal}
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
              data={dataAjustada}
              price={priceP}
              title="Presupuesto Venta"
              totalconDescuento={totalConDescuento}
              ivaCalculado={ivaCalculado}
              resultadoFinal={totalFinal}
              importeTotal={importeTotal}
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
              totalEncimeras={total_Encimeras}
              totalEquipamiento={total_Equipamiento}
              totalElectrodomesticos={total_Electrodomesticos}
              price={priceC}
              data={dataAjustada}
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
          <General getData={setData} data={dataAjustada} />
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
          <Profile getData={setData} data={dataAjustada} />
        </div>
      ),
    },
  ];

  return (
    dataAjustada &&
    dataAjustada._id && (
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
                #{dataAjustada?.orderCode || "Sin especificar"}
              </NavLink>
            </h1>
            <Button
              style={{ float: "right", width: 150 }}
              type="default"
              onClick={() => {
                const contenidoJSON = JSON.stringify(dataAjustada, null, 2);
                const blob = new Blob([contenidoJSON], {
                  type: "application/json",
                });
                const url = URL.createObjectURL(blob);
                const enlace = document.createElement("a");
                enlace.href = url;
                enlace.download = `${
                  dataAjustada.storeName + " " + dataAjustada.customerName
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
            onChange={handleTabChange}
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