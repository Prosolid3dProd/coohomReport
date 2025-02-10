import {
  Button,
  Popconfirm,
  Table,
  Typography,
  Modal,
  Row,
  Col,
  Form,
  Input,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  getLocalOrder,
  getOrderById,
  updateCabinetsOrder,
} from "../../handlers/order";
import { Header } from "./index";
import {
  editarVariante,
  eliminarVariante,
} from "./logic/index";

// const createRows = (
//   cols,
//   cabs,
//   cabinets,
//   setModal,
//   setColsM,
//   setRowsM,
//   setCab,
//   setBool,
//   setModalVariante,
//   setIndexMueble
// ) => {
//   const vals = [];
//   for (let i = 0; i < cabinets.length; i++) {
//     let cab = cabinets[i];
//     cab = {
//       ...cab,
//       ["action"]: (
//         <div className="flex gap-2">
//           <Button
//             className="w-[65px] text-blue border-blue cursor-pointer transition-all ease-out duration-350 hover:text-blue/75 grid place-content-center"
//             onClick={(evento) => {
//               setIndexMueble(obtenerMuebleIndex(evento));
//               setModalVariante((modal) => (modal = true));
//             }}
//             data-index={i}
//           >
//             Agregar
//           </Button>
//           <Button
//             className="w-[65px] text-blue border-blue cursor-pointer transition-all ease-out duration-350 hover:text-blue/75"
//             onClick={() => {
//               setModal((modal) => !modal);
//               const titulos = [];
//               const datos = [];
//               const muebles = Object.entries(cab);

//               for (let i = 0; i < muebles.length; i++) {
//                 const mueble = muebles[i];
//                 const key = mueble[0];

//                 if (key === "action") continue; //No queremos los botones
//                 const val = mueble[1];

//                 if (typeof val === "object") continue; //No queremos los valores tipo object (arrays, objects, etc)

//                 titulos.push(key);
//                 datos.push(val);
//               }

//               setColsM((cols) => (cols = titulos));
//               setRowsM((rows) => (rows = datos));
//               setCab((c) => (c = { index: i, muebles: cabinets, cab: cab }));
//             }}
//           >
//             Edit
//           </Button>
//           <PopUpDelete
//             confirmar={() => {
//               eliminarMueble(i);
//               setBool((bool) => (bool = true));
//             }}
//           />
//         </div>
//       ),
//     };
//     const cabIncl = Object.keys(cab)
//       .map((key) => {
//         if (!omitirColumnas(cabs).includes(key)) {
//           return cab[key];
//         }
//         return;
//       })
//       .filter((col) => col !== undefined);
//     cabIncl.unshift(i.toString());
//     cabIncl.push(cab.variants);
//     vals.push(cabIncl);
//   }
//   const final = [];
//   for (let i = 0; i < vals.length; i++) {
//     const val = vals[i];
//     let x = {};
//     for (let j = 0; j < val.length; j++) {
//       const col = j === 0 ? "key" : cols[j - 1]?.title;
//       if (col === undefined) {
//         x = { ...x, ["variants"]: val[j] }; //Agregando 'variants'
//         continue;
//       }
//       x = { ...x, [col]: val[j] };
//     }
//     final.push(x);
//   }
//   return final;
// };

// const expandedRowRender = (e) => {
//   const [data, columnas] = tablaExpansible(e);

//   return <Table columns={columnas} dataSource={data} pagination={false} />;
// };

// const EditRow = ({ setOpen, cols, rows, mueble, setBool }) => {
//   return (
//     <Modal
//       okey={() => editarMueble(mueble, setBool, setOpen)}
//       cancelar={() => setOpen((open) => (open = false))}
//       contenido={
//         <article className="flex flex-col gap-1">
//           {cols.map((col, index) => {
//             const row = rows[index];
//             return (
//               <Label key={index} texto={col} input={<Input dfValue={row} />} />
//             );
//           })}
//         </article>
//       }
//     ></Modal>
//   );
// };

// const ModalAgregarFila = ({ setOpen, setBool }) => {
//   const cab = getCab(0);
//   const columnas = crearColumnas(cab);
//   const columnasValidas = columnas
//     .filter((columa) => Object.values(columa)[0] !== "action")
//     .map((columna) => Object.values(columna)[0]);

//   return (
//     <Modal
//       okey={() => agregarMueble(setBool, setOpen)}
//       cancelar={() => setOpen((open) => (open = false))}
//       contenido={
//         <article className="flex flex-col gap-1">
//           {columnasValidas.map((col, index) => {
//             return (
//               <Label key={index} texto={col} input={<Input plhold={col} />} />
//             );
//           })}
//         </article>
//       }
//     />
//   );
// };

/**
 *
 *
 * @param {object} { setOpen , vals, indexes }
 * @return {Component}
 */
const ModalVariants = ({ setOpen, vals, indexes }) => {
  const guardarVariante = (e) => {
    const { variant, cab } = indexes;
    const data = JSON.parse(localStorage.getItem("order"));
    const muebles = data.cabinets;
    const mueble = muebles[cab];
    const variantes = mueble.variants;

    let variante = {};

    const inputs = Object.values(document.querySelectorAll("input"));

    inputs
      // .filter((_inp, i) => i !== 0)
      .map((input, i) => {
        const key = Object.keys(vals[i]);
        variante = { ...variante, [key]: input.value };
      });
    variantes[variant] = variante;
    mueble.variants = variantes;
    muebles[cab] = mueble;
    data["cabinets"] = muebles;

    localStorage.setItem("order", JSON.stringify(data));

    setOpen((open) => (open = false));
  };

  return (
    <Modal
      okey={() => {
        guardarVariante(), () => setOpen((open) => (open = false));
      }}
      cancelar={() => {
        setOpen((open) => (open = false));
      }}
      contenido={
        <article className="flex flex-col gap-1">
          {vals?.map((val) => {
            const [key, value] = Object.entries(val)[0];
            return (
              <div className="flex gap-2" key={key}>
                <label className="text-slate-400 italic text-md">{key}:</label>
                <input
                  className="text-black placeholder:text-border focus:placeholder:text-blue placeholder:italic pl-2 focus:shadow-sm focus:text-blue"
                  defaultValue={value}
                />
              </div>
            );
          })}
        </article>
      }
    />
  );
};

export const ButtonModal = ({ muebleIndex, variableIndex }) => {
  const [vals, setVals] = useState([]);
  const [indexes, setIndexes] = useState({});

  return (
    <article className="flex gap-2">
      <Button
        id="btnModal"
        className=" w-[65px] text-blue border-blue cursor-pointer transition-all ease-out duration-350 hover:text-blue/75"
        onload={(e) => {
          const newValues = editarVariante(e, setIndexes);
          setVals((vals) => (vals = newValues));
        }}
        onClick={(e) => {
          const newValues = editarVariante(e, setIndexes);
          setVals((vals) => (vals = newValues));
          setOpenModal((open) => (open = !open));
        }}
      >
        Edit
      </Button>
      <Popconfirm
        title="Delete"
        description="¿Are you sure to delete this row?"
        okType="default"
        okText={<span className="w-[25px]">Si</span>}
        cancelText={
          <span danger className="w-[25px]">
            No
          </span>
        }
        onConfirm={() => {
          eliminarVariante(muebleIndex, variableIndex);
          location.reload();
        }}
      >
        <Button
          danger="true"
          className="text-red w-[65px] grid place-content-center cursor-pointer transition-all ease-out duration-350 hover:text-blue/75"
        >
          Eliminar
        </Button>
      </Popconfirm>
      {openModal && (
        <ModalVariants setOpen={setOpenModal} vals={vals} indexes={indexes} />
      )}
    </article>
  );
};

const Muebles = () => {
  const [bool, setBool] = useState(false);
  const [orden, setOrden] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [form] = Form.useForm();

  const getDataOrden = async () => {
    const datax = await getOrderById({ _id: getLocalOrder()?._id });
    localStorage.setItem("order", JSON.stringify(datax));
    setOrden(datax);
  };

  const [data, setData] = useState(null);
  const [editado, setEditado] = useState(false);
  const [selected, setSelected] = useState({});

  useEffect(() => {
    if (!editado) setEditado((edit) => (edit = true));

    setTimeout(() => setEditado((edit) => (edit = false)), 2000);
  }, [onload]);

  useEffect(() => {
    if (!bool) return;

    setEditado((editado) => (editado = true));

    setTimeout(() => {
      setEditado((editado) => (editado = false));
      setData((data) => (data = getLocalOrder()?.cabinets || getLocalOrder()));
    }, 800);

    setBool((bool) => (bool = false));
  }, [bool]);

  useEffect(() => {
    getDataOrden();
  }, [data]);

  useEffect(() => {
    if (selected) {
      form.setFieldsValue({
        name: selected.name,
        reference: selected.reference,
        priceCabinet: selected.priceCabinet,
        priceVariants: selected.priceVariants,
        priceDrawers: selected.priceDrawers,
        total: selected.total,
        id: selected.id,
      });
    }
  }, [selected]);

  const handleFinished = async (e) => {
    if (selected.mode === "edit") {
      const fields = form.getFieldsValue();
      const cabinetFields = orden.cabinets.filter(
        (cabinet) => cabinet.id !== selected.id
      );
      const allFields = [...cabinetFields, fields];

      const result = await updateCabinetsOrder({
        _id: getLocalOrder()?._id,
        cabinets: allFields,
      });

      if (result) {
        message.success("Mueble actualizado correctamente");
        window.location.reload();
      }
    }

    if (selected.mode === "new") {
      const fields = form.getFieldsValue();
      const cabinetFields = orden.cabinets;
      const allFields = [...cabinetFields, fields];
      const result = await updateCabinetsOrder({
        _id: getLocalOrder()?._id,
        cabinets: allFields,
      });

      if (result) {
        message.success("Mueble actualizado correctamente");
        window.location.reload();
      }
    }
  };

  const handleArchived = async (row) => {
    const cabinetFields = orden.cabinets.filter(
      (cabinet) => cabinet.id !== row.id
    );

    const result = await updateCabinetsOrder({
      _id: getLocalOrder()?._id,
      cabinets: cabinetFields,
    });

    if (result) {
      message.success("Mueble actualizado correctamente");
      window.location.reload();
    }
  };

  return (
    <section>
      <Header
        name={"Muebles"}
        funcion={() => {
          setSelected({ mode: "new" });
          setOpenModal(true);
        }}
      />

      {/* <Row gutter={[16, 16]}>
        <Col span={20}></Col>
        <Col span={4}>
          <Button
            style={{ background: "#000", color: "#fff", width: "100%" }}
            onClick={() => {
              setSelected({ mode: "new" });
              setOpenModal(true);
            }}
          >
            Agregar Mueble
          </Button>
        </Col>
      </Row> */}

      {orden && orden.cabinets && (
        <Table
          className="border border-t-0 border-border"
          loading={editado}
          dataSource={orden.cabinets}
          // expandable={{
          //   expandedRowRender
          // }}
          pagination={false}
          rowKey={"id"}
          scroll={{ y: 'calc(100vh - 390px)' }}
        >
          <Table.Column
            title="Acción"
            dataIndex="action"
            align="center"
            key="action"
            width={150}
            render={(item, rows) => (
              <>
                <Typography.Link
                  onClick={() => {
                    setSelected({ ...rows, mode: "edit" });
                    setOpenModal(true);
                  }}
                >
                  Editar
                </Typography.Link>
                &nbsp;&nbsp; | &nbsp;&nbsp;
                <Popconfirm
                  okType="default"
                  okText="Si"
                  cancelText="No"
                  title="¿Estás seguro de eliminar este mueble?"
                  onConfirm={() => {
                    setSelected({ ...rows, mode: "edit" });
                    handleArchived(rows);
                  }}
                >
                  <Typography.Link>Eliminar</Typography.Link>
                </Popconfirm>
              </>
            )}
          />

          <Table.Column
            title="Referencia"
            dataIndex="reference"
            key="reference"
            width={120}
            render={(item, rows) => <>{rows.reference}</>}
          />
          <Table.Column
            title="Nombre"
            dataIndex="name"
            key="name"
            width={400}
            render={(item, rows) => <>{rows.name}</>}
          />

          <Table.Column
            title="Precio"
            align="right"
            dataIndex="price"
            key="price"
            render={(item, rows) => <>{rows.total || 0}&nbsp;€</>}
          />
        </Table>
      )}

      <Form
        layout="vertical"
        form={form}
        initialValues={{
          name: selected.name,
          reference: selected.reference,
          priceCabinet: selected.priceCabinet,
          priceVariants: selected.priceVariants,
          priceDrawers: selected.priceDrawers,
          total: selected.total,
          id: selected.id,
        }}
        onValuesChange={(e) => {
          // setFormValues(e);
        }}
        onFinish={handleFinished}
        style={{
          maxWidth: 600,
        }}
      >
        <Modal
          title="Editar Mueble"
          open={openModal}
          onOk={() => {}}
          destroyOnClose
          onCancel={() => setOpenModal(false)}
          footer={false}
        >
          <br />
          <Row gutter={[16, 16]}>
            <Col span={8}>ID</Col>
            <Col span={16}>
              <Form.Item name="id">
                <Input disabled={selected.mode === "new" ? false : true} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={8}>Nombre</Col>
            <Col span={16}>
              <Form.Item name="name">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={8}>Referencía</Col>
            <Col span={16}>
              <Form.Item name="reference">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={8}>Precio del Mueble</Col>
            <Col span={16}>
              <Form.Item name="priceCabinet">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={8}>Precio de la variante</Col>
            <Col span={16}>
              <Form.Item name="priceVariants">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={8}>Precio de los Cajones</Col>
            <Col span={16}>
              <Form.Item name="priceDrawers">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={8}>Precio total</Col>
            <Col span={16}>
              <Form.Item name="total">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={16}></Col>
            <Col span={8}>
              <Button
                style={{ background: "#000", color: "#fff", width: "100%" }}
                onClick={handleFinished}
              >
                Guardar
              </Button>
            </Col>
          </Row>
        </Modal>
      </Form>
    </section>
  );
};

export default Muebles;
