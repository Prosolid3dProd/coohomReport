import {
  Table,
  message,
  Modal,
  Button,
  Space,
  Popconfirm,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { QuestionCircleOutlined } from "@ant-design/icons";
import {
  archivedOrder,
  getComplements,
  getComplementsByText,
} from "../../../handlers/order";
import { Header, Input } from "../../content";
import { Label, Input as InputModal } from "../../content";
import {
  exportarArchivo,
  importarArchivo,
} from "../../content/logic/obtenerArchivoJson";

// export const AgregarComplemento = () => {

//   const [showModal, setModal] = useState(false)

//   const recogerDatos = () => {
//     const inputs = document.getElementsByTagName('input')
//     const inputsValidos = Object.values(inputs).slice(2)//Quitamos 2 primeros elementos ( no son del modal )
//     let nuevoComponente = {}
//     columnas.map((columna, i) => nuevoComponente = { ...nuevoComponente, [columna]: inputsValidos[i].value })
//     //Agregar conexión BD
//     setModal(open => open = false)
//   }

//   return (
//     <>
//       <Button type="default" className="h-[67px] border text-blue border-blue " onClick={importarArchivo()}>
//         Agregar Complemento
//       </Button>
//       <Modal title="Basic Modal" open={showModal} onOk={() => ''}
//         onCancel={() => setModal(open => open = false)}
//         footer={[
//           <Button key="back" onClick={() => setModal(open => open = false)} target="_self">
//             Cancel
//           </Button>,
//           <Button key="submit" type="default" onClick={recogerDatos}>
//             Okey
//           </Button>,
//         ]}
//       >
//         <section className="flex flex-col gap-2">
//           {
//             columnas.map(col => {
//               return (
//                 <Label
//                   texto={col}
//                   input={
//                     <InputModal plhold={col} />
//                   }
//                 />
//               )
//             })
//           }
//         </section>
//       </Modal>
//     </>
//   )
// }

/**
 *
 *
 * @param {Function} editar --> editar = abrir/cerrar modal
 * @param {object} filaCambiar --> elemento tabla Complementos editar
 * @return {Component}
 */
const ModalEditar = ({ editar, filaCambiar }) => {
  const columnasOrden = [
    "code",
    "name",
    "type",
    "width",
    "height",
    "depth",
    "price",
  ];

  const editarFila = () => {
    const inputs = Array.from(document.getElementsByTagName("input")).slice(2);
    console.log(inputs);

    let filaEditada = {};

    inputs.forEach((input, i) => {
      const columna = columnasOrden[i];
      console.log(columna);
      filaEditada = { ...filaEditada, [columna]: input.value };
    });

    console.log(filaEditada);
    // Agregar conexión BD --> obj
  };

  return (
    <Modal
      title="Editar Complemento"
      open={() => true}
      onOk={editarFila}
      destroyOnClose
      onCancel={() => editar((editar) => (editar = false))}
      footer={[
        <Button
          key="back"
          onClick={() => editar((editar) => (editar = false))}
          target="_self"
        >
          Cancel
        </Button>,
        <Button target="_self" key="submit" type="default" onClick={editarFila}>
          Okey
        </Button>,
      ]}
    >
      {columnas.map((columna, i) => {
        const filterFila = Object.entries(filaCambiar).filter((dato) =>
          [
            "code",
            "name",
            "type",
            "depth",
            "height",
            "width",
            "price",
          ].includes(dato[0])
        ); //filtramos las columnas que nos interesen

        const [columnasFiltradas, valores] = [
          [...filterFila].map((dato) => dato[0]), //key
          [...filterFila].map((dato) => dato[1]), //values
        ];

        const vc = [];
        for (const index in columnasOrden) {
          const columna = columnasOrden[index];
          const indexVal = columnasFiltradas.findIndex(
            (col) => col === columna
          );
          vc.push(valores[indexVal]); //Values en orden
        }

        return (
          <Label
            key={columna} // Asigna la clave única (key) a cada elemento
            texto={columna}
            input={<Input dfValue={vc[i]} />}
          />
        );
      })}
    </Modal>
  );
};

const Encimeras = () => {
  const [data, setData] = useState([]);
  const [editado, setEditado] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  // const getDataComplements = async () => {
  //   await getComplements()
  //     .then((res) => {
  //       let temp = [];

  //       res.forEach((element) => {
  //         if (
  //           String(element.name) !== "undefined" &&
  //           element.name !== "" &&
  //           element.name !== undefined
  //         ) {
  //           element = {
  //             ...element,
  //             ["action"]: (
  //               <Button
  //                 className="text-red border-red cursor-pointer transition-all ease-out duration-350 hover:text-red/75"
  //                 onClick={() => {
  //                   setDatosModal((fila) => (fila = element));
  //                   setModalEditar((open) => (open = true));
  //                 }}
  //               >
  //                 Eliminar
  //               </Button>
  //             ),
  //           };
  //           temp.push(element);
  //         }
  //       });

  //       setData(temp);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  const fetchData = async () => {
    try {
      setEditado(true);
      const result = await getComplements();
      const newData = structuredClone(result);
      const filteredData = newData.filter((el) => el.name);
      setData(filteredData);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setEditado(false);
    }
  };

  const getFilterComplements = async (params) => {
    try {
      const result = await getComplementsByText(params);
      if (result && result.length > 0) setData(result);
      else {
        message.error("No se encontraron resultados");
        fetchData();
      }
    } catch (error) {
      console.error("Error filtering orders:", error);
    }
  };

  const onDelete = async (item) => {
    setEditado(true);
    try {
      const result = await archivedOrder(item);
      if (result) {
        setInitialValues((prevValues) =>
          prevValues.filter((value) => value._id !== item._id)
        );
        message.success(`${item.orderCode} eliminado correctamente`);
        setEditado(false);
      } else {
        message.error(`Error al eliminar ${item.orderCode}`);
      }
    } catch (e) {
      console.log(e);
      message.error(`Error al eliminar ${item.orderCode}`);
    }
  };

  // let columns = [
  //   {
  //     title: "Codigo",
  //     dataIndex: "Referencia",
  //     key: "Referencia",
  //   },
  //   {
  //     title: "Nombre",
  //     dataIndex: "Nombre",
  //     key: "Nombre",
  //   },
  //   {
  //     title: "Tipo",
  //     dataIndex: "Tipo",
  //     key: "Tipo",
  //   },
  //   {
  //     title: "Ancho",
  //     dataIndex: "Ancho",
  //     key: "Ancho",
  //   },
  //   {
  //     title: "Alto",
  //     dataIndex: "Altura",
  //     key: "Altura",
  //   },
  //   {
  //     title: "Profundidad",
  //     dataIndex: "Profundidad",
  //     key: "Profundidad",
  //   },
  //   {
  //     title: "Precio",
  //     dataIndex: "Precio",
  //     key: "Precio",
  //   },
  //   {
  //     title: "Acciones",
  //     key: "actions",
  //     fixed: "right",
  //     width: 110,
  //     render: (text, record) => (
  //       <Space>
  //         <Popconfirm
  //           title="¿Estás seguro de que deseas eliminar este reporte?"
  //           icon={<QuestionCircleOutlined style={{ color: "red" }} />}
  //           onConfirm={() => onDelete(record)}
  //           onCancel={() => {}}
  //           okType="default"
  //           okText="Si"
  //           cancelText="No"
  //         >
  //           <Typography.Link>
  //             <Button danger>Eliminar</Button>
  //           </Typography.Link>
  //         </Popconfirm>
  //       </Space>
  //     ),
  //   },
  // ];

  let columns = [
    {
      title: "Codigo",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Tipo",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Ancho",
      dataIndex: "width",
      key: "width",
    },
    {
      title: "Alto",
      dataIndex: "height",
      key: "height",
    },
    {
      title: "Profundidad",
      dataIndex: "depth",
      key: "depth",
    },
    {
      title: "Precio",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Acciones",
      key: "actions",
      fixed: "right",
      width: 110,
      render: (text, record) => (
        <Space>
          <Popconfirm
            title="¿Estás seguro de que deseas eliminar este reporte?"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            onConfirm={() => onDelete(record)}
            onCancel={() => {}}
            okType="default"
            okText="Si"
            cancelText="No"
          >
            <Typography.Link>
              <Button danger>Eliminar</Button>
            </Typography.Link>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const importData = async (evento) => {
    try {
      const resultArray = await importarArchivo(evento);
      if (resultArray && resultArray.length > 0) {
        setData(resultArray);
      } else {
        message.warning("No se encontraron datos en el archivo importado.");
      }
    } catch (error) {
      console.error("Error importing data:", error);
      message.error("Error al importar datos. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <main className="flex flex-col overflow-y-scroll px-4">
      <Header
        name={"Biblioteca"}
        input={true}
        getFilter={getFilterComplements}
        downloadFile={() => exportarArchivo(data)}
        addFile={importData}
      />
      <Table
        className="border border-t-0 border-border mx-3 relative overflow-x-hidden"
        loading={editado}
        dataSource={data}
        scroll={{ x: true }}
        searchable
        columns={columns}
      />
    </main>
  );
};

export default Encimeras;
