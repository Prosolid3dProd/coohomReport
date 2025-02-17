import { useEffect, useState } from "react";
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
  const handleTabChange = (key) => {
    setTabActivo(parseInt(key));
    localStorage.setItem("activeTab", key);
  };

  // useEffect que se ejecuta solo una vez cuando se monta el componente o cuando cambia el `orderId`
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
  }, [tabActivo]); // Solo ejecutará cuando el `orderId` cambie

  // useEffect que maneja el cambio de tabs. No realiza actualizaciones innecesarias.
  useEffect(() => {
    // Solo realiza la actualización de datos si el tabActivo cambia y no si `data` o `profile` no han cambiado
    if (tabActivo <= 3 && orderId._id && data) {
      // const updatedInfo = fixOrder(data, tabActivo);
      const fetchProfile = async () => {
        const profileData = await getProfile();
        setProfile(profileData);
      };
      fetchProfile();
    }
  }, [tabActivo, data, orderId]); // Este efecto se ejecutará solo cuando `tabActivo` cambie, no por cambios de `data` innecesarios

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
    // Determina si se debe aplicar el coeficiente (solo en los tabs 2 y 3)
    const usarCoeficiente = tabActivo === 2 || tabActivo === 3;
  
    // Obtener el coeficiente desde donde lo tengas almacenado (ejemplo: localStorage o un contexto global)
    const coeficiente = usarCoeficiente ? parseFloat(data.coefficient) : 1;

    // Calcular las sumas y totales con el coeficiente aplicado correctamente
    const sumaTotal = calcularSumaTotal(data.cabinets, coeficiente);
    const totalZocalo = calcularTotalZocalo(data.infoZocalos, coeficiente);
    const totalDescuentos = calcularTotalDescuentos(data, coeficiente);
  
    // Ahora el IVA también se basa en el total con coeficiente ya aplicado
    const totalIva = calcularTotalIva(sumaTotal, data.ivaCabinets);
  
    const resultado = calcularTotalConDescuentoEIVA(
      data.cabinets,
      data.infoZocalos,
      totalDescuentos,
      data.ivaCabinets,
      coeficiente
    );
  
    setTotales({
      sumaTotal,
      totalZocalo,
      totalDescuentos,
      totalIva,
      resultadoFinal: resultado,
    });
  }, [data, tabActivo]);

  
  const { totalConDescuento, totalFinal, importeTotal, ivaCalculado } = totales.resultadoFinal;
  console.log(totales)

  const tabs = [
    {
      key: "0",
      label: "Confirmación de Pedido",
      component: (
        <div className="alturaPreview-presu">
          <PDFViewer className="h-full w-full">
            <Confirmacion_Pedido
              price={priceP}
              data={data}
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
              data={data}
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
              data={data}
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
              data={data}
              sumaTotal={totales.sumaTotal}
              totalZocalo={totales.totalZocalo}
              totalconDescuento={totalConDescuento}
              totalIva={totales.totalIva}
              resultadoFinal={totalFinal}
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
          <General getData={setData} data={data} />
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
          <Profile getData={setData} data={data} />
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
            onChange={handleTabChange}
            activeKey={tabActivo.toString()}
            centered
            defaultActiveKey="0"
            items={tabs.map(({ key, label, component }) => {
              return {
                label,
                key,
                children: component,
              };
            })}
          />
        </Card>
      </main>
    )
  );
};

export default Report;
