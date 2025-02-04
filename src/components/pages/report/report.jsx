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
  const [tabActivo, setTabActivo] = useState(
    localStorage.getItem("activeTab") ? parseInt(localStorage.getItem("activeTab")) : 0
  );
  

  const priceC = existePrecio(getPrecio("C"));
  const priceF = existePrecio(getPrecio("F"));
  const priceP = existePrecio(getPrecio("P"));
  const total_Encimeras = existeTotales(getTotales("Encimeras"));
  const total_Equipamiento = existeTotales(getTotales("Equipamiento"));
  const total_Electrodomesticos = existeTotales(
    getTotales("Electrodomesticos")
  );

  useEffect(() => {
    setMain(document.getElementById("main"));
  }, []);

  useEffect(() => {
    if (orderId._id) {
      getOrden();
    }
  }, [orderId]);

  useEffect(() => {
    const fetchData = async () => {
      if (orderId._id && tabActivo <= 3) {
        const updatedInfo = fixOrder(data, tabActivo);
        const profile = await getProfile();
        setData({ ...updatedInfo, profile });
        getOrders({ ...updatedInfo, profile });
      }
    };
    fetchData();
  }, [tabActivo]);

  useEffect(() => {
    const tabs = document.querySelectorAll('.ant-tabs-tab');
    if (tabs.length >= 2) {
      tabs[0].style.backgroundColor = 'rgba(26, 122, 248, 0.1)';
      tabs[0].style.padding = '0 10px';
      tabs[0].style.color = 'black';
      tabs[0].style.fontWeight = 'bold';

      tabs[1].style.backgroundColor = 'rgba(26, 122, 248, 0.1)'; 
      tabs[1].style.padding = '0 10px';
      tabs[1].style.color = 'black';
      tabs[1].style.fontWeight = 'bold';
    }
  }, [tabActivo]);

  const tabs = [
    {
      "Confirmación de Pedido": (
        <div className="alturaPreview-presu">
          <PDFViewer className="h-full w-full">
            <Confirmacion_Pedido
              price={priceP}
              data={data}
              title="Confirmacion de Pedido"
            />
          </PDFViewer>
        </div>
      ),
    },
    {
      "Presupuesto": (
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
      "Presupuesto Venta Detallado": (
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
      "Presupuesto Venta Simplificado": (
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
      "Información General": (
        <div className="alturaPreview">
          <General getData={setData} data={data} />
        </div>
      ),
    },
    {
      "Complementos": (
        <div className="alturaPreview">
          <Product getData={setData} />
        </div>
      ),
    },
    {
      "Mi Perfil": (
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
  

  const getOrden = async () => {
    try {
      const result = await getOrderById({ _id: orderId._id });
      if (result) {
        const info = fixOrder(result);
        const profile = await getProfile();

        setData({ ...info, profile });
        getOrders({ ...info, profile });
        return info;
      } else {
        return null;
      }
    } catch (e) {
      console.error(e);
    }
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
              Ordén{" "}
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
            items={tabs.map((tabItem, i) => {
              return {
                label: `${Object.keys(tabItem)}`,
                key: i.toString(),
                children: Object.values(tabItem),
              };
            })}
          />
        </Card>
      </main>
    )
  );
};

export default Report;
