import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import { General, Product, Profile } from "./../../index";

import { Tabs, FloatButton, Card, Button, Space } from "antd";
import {
  getOrders,
  getLocalOrder,
  getOrderById,
  fixOrder,
  getProfile,
} from "../../../handlers/order";
import { Header, Muebles } from "../../content";

import { PDFViewer } from "@react-pdf/renderer";

import LogoERP from "../../../assets/logoERP.png";

import { Presupuesto_Cliente, Presupuesto_Fabrica } from "./index";

import {
  existePrecio,
  existeTotales,
  getPrecio,
  getTabActual,
  getTotales,
  setTabActual,
} from "../../../data/localStorage";
import { ArrowUp } from "../../icons";
import "./report.css";
import Confirmacion_Pedido from "./confirmacion_pedido";

async function buscarNodoPorCodigo(codigoBuscado) {}

const Report = () => {
  const [main, setMain] = useState(document.getElementById("main"));

  window.onload = () =>
    setMain((main) => (main = document.getElementById("main")));

  const [data, setData] = useState(null); // [{}
  const [orderId, setOrderId] = useState(getLocalOrder());

  const priceC = existePrecio(getPrecio("C"));
  const priceF = existePrecio(getPrecio("F"));
  const priceP = existePrecio(getPrecio("P"));
  const total_Encimeras = existeTotales(getTotales("Encimeras"));
  const total_Equipamiento = existeTotales(getTotales("Equipamiento"));
  const total_Electrodomesticos = existeTotales(
    getTotales("Electrodomesticos")
  );

  useEffect(() => {
    if (orderId._id) {
      getOrden();
      buscarNodoPorCodigo("3FO3XYGTXB12");
    }
  }, [orderId]);

  const tabs = [
    {
      "Confirmación de Pedido": (
        <div className="alturaPreview">
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
        <div className="alturaPreview">
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
      "Vista previa Cliente": (
        <div className="alturaPreview">
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
    // {
    //   "Tabla de Muebles": (
    //     <div className="alturaPreview">
    //       <Muebles />
    //     </div>
    //   ),
    // },
    {
      "Información General": (
        <div className="alturaPreview">
          <General getData={setData} data={data} />,
        </div>
      ),
    },
    {
      "Complementos": (
        <div className="alturaPreview">
          <Product getData={setData} />,
        </div>
      ),
    },
    {
      "Mi Perfil": (
        <div className="alturaPreview">
          <Profile getData={setData} data={data} />,
        </div>
      ),
    },
  ];

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
    if (orderId._id) {
      getOrden();
    }
  }, []);

  const [visible, setBtnVisible] = useState(false);

  useEffect(() => {
    setMain((main) => (main = document.getElementById("main")));
  }, [window.location]);

  useEffect(() => {
    window.onload = () =>
      setMain((main) => (main = document.getElementById("main")));
    main?.addEventListener("scroll", () => {
      if (main?.scrollTop > 100) {
        setBtnVisible((visible) => (visible = true));
        return;
      }
      setBtnVisible((visible) => (visible = false));
    });
  });

  const [tabActivo, setTabActivo] = useState(getTabActual());

  useEffect(() => {
    setTabActual(tabActivo);
  }, [tabActivo]);

  return (
    data &&
    data._id && (
      <main className="flex flex-col">
        <Card className="rounded-none m-0 pt-0 border-0">
          <header
            className=" border border-border bg-gray py-4"
            style={{ padding: 20 }}
          >
            <a href="#ancla" className="hidden" />
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
                  JSON.parse(localStorage.getItem("orderErp")).customerName
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
            onChange={(e) => setTabActivo((tab) => (tab = e))}
            defaultActiveKey={tabActivo || 0}
            centered
            className="overflow-scroll"
            items={tabs.map((tabItem, i) => {
              return {
                label: `${Object.keys(tabItem)}`,
                key: i,
                children: Object.values(tabItem),
              };
            })}
          />
        </Card>
        <FloatButton
          icon={<ArrowUp />}
          className={`${
            visible ? "opacity-100" : "opacity-0"
          } transition duration-300 ease-linear`}
          type="primary"
          onClick={() => (main.scrollTop = 0)}
        >
          Ancla
        </FloatButton>
      </main>
    )
  );
};

export default Report;
