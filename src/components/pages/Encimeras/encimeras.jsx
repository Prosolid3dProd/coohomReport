import {
  Table,
  message,
  Button,
  Space,
  Popconfirm,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { QuestionCircleOutlined } from "@ant-design/icons";
import {
  deleteComplements,
  getComplements,
  getComplementsByText,
} from "../../../handlers/order";
import { Header } from "../../content";
import { exportarArchivo } from "../../content/logic/obtenerArchivoJson";

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
// const ModalEditar = ({ editar, filaCambiar }) => {
//   const columnasOrden = [
//     "code",
//     "name",
//     "type",
//     "width",
//     "height",
//     "depth",
//     "price",
//   ];

//   const editarFila = () => {
//     const inputs = Array.from(document.getElementsByTagName("input")).slice(2);
//     console.log(inputs);

//     let filaEditada = {};

//     inputs.forEach((input, i) => {
//       const columna = columnasOrden[i];
//       console.log(columna);
//       filaEditada = { ...filaEditada, [columna]: input.value };
//     });

//     console.log(filaEditada);
//     // Agregar conexión BD --> obj
//   };

//   return (
//     <Modal
//       title="Editar Complemento"
//       open={() => true}
//       onOk={editarFila}
//       destroyOnClose
//       onCancel={() => editar((editar) => (editar = false))}
//       footer={[
//         <Button
//           key="back"
//           onClick={() => editar((editar) => (editar = false))}
//           target="_self"
//         >
//           Cancel
//         </Button>,
//         <Button target="_self" key="submit" type="default" onClick={editarFila}>
//           Okey
//         </Button>,
//       ]}
//     >
//       {columnas.map((columna, i) => {
//         const filterFila = Object.entries(filaCambiar).filter((dato) =>
//           [
//             "code",
//             "name",
//             "type",
//             "depth",
//             "height",
//             "width",
//             "price",
//           ].includes(dato[0])
//         ); //filtramos las columnas que nos interesen

//         const [columnasFiltradas, valores] = [
//           [...filterFila].map((dato) => dato[0]), //key
//           [...filterFila].map((dato) => dato[1]), //values
//         ];

//         const vc = [];
//         for (const index in columnasOrden) {
//           const columna = columnasOrden[index];
//           const indexVal = columnasFiltradas.findIndex(
//             (col) => col === columna
//           );
//           vc.push(valores[indexVal]); //Values en orden
//         }

//         return (
//           <Label
//             key={columna} // Asigna la clave única (key) a cada elemento
//             texto={columna}
//             input={<Input dfValue={vc[i]} />}
//           />
//         );
//       })}
//     </Modal>
//   );
// };

// export const fetchData = async (setEditado, setData) => {
//   try {
//     setEditado(true);
//     const result = await getComplements();
//     const newData = structuredClone(result);
  
//     if (Array.isArray(result)) {
//       const filteredData = newData.filter((el) => el.name);
//       setData(filteredData);
//     }
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//   } finally {
//     setEditado(false);
//   }
// };

export const fetchData = async (setLoading, setData) => {
  try {
    setLoading(true); // Indicar que está cargando
    const result = await getComplements();

    // Validación del resultado
    if (!Array.isArray(result) || result.length === 0) {
      console.warn("No data received or data is not in array format.");
      setData([]); // Setear un array vacío en caso de error
      return;
    }

    // Clonación y filtrado seguro
    const newData = JSON.parse(JSON.stringify(result));
    const filteredData = newData.filter((el) => el.name); // Filtrar solo con nombre definido

    setData(filteredData);
  } catch (error) {
    console.error("Error fetching orders:", error);
    setData([]); // Limpiar los datos en caso de error
  } finally {
    setLoading(false); // Finalizar la carga
  }
};


const Encimeras = () => {
  const [data, setData] = useState([]);
  const [editado, setEditado] = useState(false);
  const [pageSize, setPageSize] = useState(5);
  useEffect(() => {
    fetchData(setEditado, setData);
  }, []);

  const handleResize = () => {
      const windowHeight = window.innerHeight;
      const newRowHeight = 88;
      const newPageSize = Math.floor((windowHeight - 200) / newRowHeight);
      setPageSize(newPageSize);
    };
  
    useEffect(() => {
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

  const getFilterComplements = async (params) => {
    setEditado(true);
    try {
      const result = await getComplementsByText(params);
      if (result && result.length > 0) setData(result);
      else {
        message.error("No se encontraron resultados");
        fetchData(setEditado, setData);
      }
    } catch (error) {
      console.error("Error filtering orders:", error);
    }
    setEditado(false);
  };

  const onDelete = async (item) => {
    setEditado(true);
    try {
      const result = await deleteComplements(item);
      if (result) {
        setData((prevValues) =>
          prevValues.filter((value) => value._id !== item._id)
        );
        message.success(`${item.code} eliminado correctamente`);
        setEditado(false);
      } else {
        message.error(`Error al eliminar ${item.code}`);
      }
    } catch (e) {
      console.log(e);
      message.error(`Error al eliminar ${item.code}`);
    }
  };
  
  let columns = [
    {
      title: "Referencia",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Descripcion",
      dataIndex: "name",
      key: "name",
      width: 720,
    },
    {
      title: "Tipo",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Marca",
      dataIndex: "marca",
      key: "marca",
    },
    {
      title: "Precio",
      dataIndex: "price",
      key: "price",
      render: (text) => parseFloat(text).toFixed(2),
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

  return (
    <main className="flex flex-col px-4">
      <Header
        name={"Biblioteca"}
        input={true}
        getFilter={getFilterComplements}
        downloadFile={() => exportarArchivo(data)}
        showUploadButtons={true}
        setLoading={setEditado}
        setData={setData}
      />
      <Table
        className="border border-t-0 border-border mx-3 relative"
        loading={editado}
        dataSource={data}
        pagination={{pageSize}}
        searchable
        columns={columns}
      />
    </main>
  );
};

export default Encimeras;
