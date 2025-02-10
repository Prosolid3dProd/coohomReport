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
  const total_Electrodomesticos = existeTotales(getTotales("Electrodomesticos"));

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
  }, [orderId]); // Solo ejecutará cuando el `orderId` cambie

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
              price={priceP}
              data={data}
              title="Presupuesto Venta"
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
  

  const handleTabChange = (key) => {
    setTabActivo(parseInt(key));
    localStorage.setItem("activeTab", key);
  };

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
                  JSON.parse(localStorage.getItem("orderErp")),
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
                  JSON.parse(localStorage.getItem("orderErp")).storeName + " " + JSON.parse(localStorage.getItem("orderErp")).customerName
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
