import { Table, message, Modal, Button } from "antd";
import React, { useEffect, useState } from "react";

import { getComplements, getComplementsByText } from "../../../handlers/order";
import { Header, Input } from "../../content";
import { Label, Input as InputModal } from "../../content";
import { exportarArchivo, importarArchivo } from "../../content/logic/obtenerArchivoJson";

const columnas = ['Código', 'Nombre', 'Tipo', 'Ancho', 'Alto', 'Profundidad', 'Precio']

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
  const columnasOrden = ['code', 'name', 'type', 'width', 'height', 'depth', 'price']

  const editarFila = () => {
    const inputs = Array.from(document.getElementsByTagName('input')).slice(2); 
    console.log(inputs);
  
    let filaEditada = {};
  
    inputs.forEach((input, i) => {
      const columna = columnasOrden[i];
      console.log(columna)
      filaEditada = { ...filaEditada, [columna]: input.value };
    });

    console.log(filaEditada);
    // Agregar conexión BD --> obj
  }

  return (
    <Modal
      title='Editar Complemento'
      open={() => true}
      onOk={editarFila}
      destroyOnClose
      onCancel={() => editar(editar => editar = false)}
      footer={[
        <Button key="back" onClick={() => editar(editar => editar = false)} target="_self">
          Cancel
        </Button>,
        <Button target="_self" key="submit" type="default" onClick={editarFila}>
          Okey
        </Button>,
      ]}
    >
      {
  columnas.map((columna, i) => {

    const filterFila = Object.entries(filaCambiar).filter(dato => ['code', 'name', 'type', 'depth', 'height', 'width', 'price'].includes(dato[0]))//filtramos las columnas que nos interesen

    const [columnasFiltradas, valores] = [
      [...filterFila].map((dato) => dato[0]),//key
      [...filterFila].map((dato) => dato[1])//values
    ]

    const vc = []
    for (const index in columnasOrden) {
      const columna = columnasOrden[index]
      const indexVal = columnasFiltradas.findIndex(col => col === columna)
      vc.push(valores[indexVal])//Values en orden
    }

    return (
      <Label
        key={columna} // Asigna la clave única (key) a cada elemento
        texto={columna}
        input={
          <Input dfValue={vc[i]} />
        }
      />
    );
  })
}
    </Modal>
  )
}
const Encimeras = () => {
  const [data, setData] = useState([]);
  const [modalEditarOpen, setModalEditar] = useState(false)
  const [datosModal, setDatosModal] = useState({})
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
      title: "Action",
      dataIndex: "action",
      key: "action",
    },
  ];

  const getDataComplements = async () => {
    await getComplements()
      .then((res) => {
        let temp = [];

        res.forEach((element) => {
          if (
            String(element.name) !== "undefined" &&
            element.name !== "" &&
            element.name !== undefined
          ) {
            element = {
              ...element, ['action']: <Button
                className="w-[65px] text-blue border-blue cursor-pointer transition-all ease-out duration-350 hover:text-blue/75"
                onClick={() => {
                  setDatosModal(fila => fila = element)
                  setModalEditar(open => open = true)
                }}
              >
                Edit
              </Button>
            }
            temp.push(element);
          }
        });

        setData(temp);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getFilterComplements = async (params) => {
    const result = await getComplementsByText(params);
    console.log(result)
    if (result && result.length > 0) setData(result);
    else {
      message.error("No se encontraron resultados");
      getDataComplements();
    }
  };

  useEffect(() => {
    getDataComplements();
  }, []);

  const [editado, setEditado] = useState(false);
  const [bool, setbool] = useState(false);

  useEffect(() => {
    if (!bool) {
      setEditado(editado => editado = true)
      setTimeout(() => {
        setEditado(editado => editado = false)
      }, 500)
    }
  }, [bool])


  return (
    <main className="flex flex-col overflow-y-scroll px-4">
      <Header name={'Biblioteca'} input={true} getFilter={getFilterComplements} downloadFile={(e) => exportarArchivo(e)} addFile={(e) => importarArchivo(e)} />
      <Table
        className="border border-t-0 border-border mx-3 relative overflow-x-hidden"
        loading={editado}
        dataSource={data}
        scroll={{ x:true }}
        searchable
        columns={columns}
      />
      {modalEditarOpen && <ModalEditar editar={setModalEditar} filaCambiar={datosModal} />}
    </main>
  );
};

export default Encimeras;
