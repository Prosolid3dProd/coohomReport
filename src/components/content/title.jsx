import { useState } from "react";
import { Button, message, Upload, Input, Tooltip } from "antd";
import { File } from "../icons";
import { LabelAction } from "../utils";
import { ButtonAction } from "../utils/btnAction";
import { FiDownload } from "../icons";
import { breakPointMD, breakpoint, typeOfText as type } from "./logic/btnLogic";
import { UploadOutlined } from "@ant-design/icons";
import { fetchData } from "../pages/Encimeras/encimeras";
import { parseJson3D } from "../../data";
import { createOrder } from "../../handlers/order";
import { procesarArchivoXLSX } from "../content/logic/obtenerArchivoJson";

/**
 *
 *
 * @param {Function}  file
 * @param {Function}  clear
 * @return {Component}
 */
const Actions = ({
  file,
  addRow,
  showUploadButtons,
  setLoading,
  setData,
  data,
}) => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const JSONFile = (file) => {
    if (file.name.endsWith(".xlsx")) {
      const readerXlsx = new FileReader();
      procesarArchivoXLSX(readerXlsx, file);
      return;
    } else {
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const json = JSON.parse(reader.result);
            resolve(json);
            handleChangeJSON(json);
          } catch (error) {
            reject(new Error("Error parsing JSON"));
          }
        };
        reader.onerror = () => {
          reject(new Error("Error reading file"));
        };
        reader.readAsText(file);
      });
    }
  };

  const handleChangeJSON = async (info) => {
    setLoading(true);
    const newData = await parseJson3D(info);
    const existingIndex = data.findIndex(
      (item) => item.orderCode === newData.orderCode
    );
    if (existingIndex !== -1) {
      const upData = await createOrder(newData);
      setData((prevData) => {
        const updatedData = prevData.filter(
          (item) => item.orderCode !== newData.orderCode
        );
        return [upData.result, ...updatedData];
      });
      message.success(upData.result.projectName + " actualizado correctamente");
    } else {
      const order = await createOrder(newData);
      setData((prevData) => [order.result, ...prevData]);
      message.success(order.result.projectName + " agregado correctamente");
    }
    setLoading(false);
  };

  const handleChange = async (info) => {
    setLoading(true);
    if (info.file.status === "done") {
      message.success(`${info.file.name} biblioteca actualizada con exito`);
      await fetchData(setLoading, setData);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} error al actualizar la biblioteca.`);
    }
    setLoading(false);
  };

  const props1 = {
    name: "sampleFile",
    action: "https://octopus-app-dgmcr.ondigitalocean.app/cargarNuevoXlsxSola",
    method: "POST",
    headers: {
      authorization: "authorization-text",
    },
    onChange: handleChange,
  };

  const props2 = {
    name: "sampleFile",
    action:
      "https://octopus-app-dgmcr.ondigitalocean.app/eliminarComplementsXlsxSola",
    method: "POST",
    headers: {
      authorization: "authorization-text",
    },
    onChange: handleChange,
  };

  window.onresize = () =>
    setScreenWidth((width) => (width = window.innerWidth));

  return (
    <div className="flex flex-row items-center mr-4 gap-2">
      {file && (
        <Upload beforeUpload={JSONFile} showUploadList={false} multiple={false}>
          <Button
            style={{
              height: "60px",
              border: "1px solid blue",
              color: "blue",
              width: "100px",
            }}
            icon={<UploadOutlined />}
          >
            Añadir
          </Button>
        </Upload>
      )}
      {showUploadButtons && (
        <>
          <Tooltip title="Cargar un excel con esta estructura de cabecera [Referencia/Nombre/Tipo/Ancho/Altura/Profundidad/Precio]">
            <Upload showUploadList={false} multiple={false} {...props1}>
              <Button
                style={{
                  height: "60px",
                  border: "1px solid blue",
                  color: "blue",
                  width: "100px",
                }}
                icon={<UploadOutlined />}
              >
                Añadir
              </Button>
            </Upload>
          </Tooltip>
          <Tooltip title="Cargar un excel con una columna llamada 'Referencia' que tenga los codigos de los elementos que quieras eliminar.">
            <Upload showUploadList={false} multiple={false} {...props2}>
              <Button
                style={{
                  height: "60px",
                  border: "1px solid red",
                  color: "red",
                }}
                icon={<UploadOutlined />}
              >
                Eliminar
              </Button>
            </Upload>
          </Tooltip>
        </>
      )}
      {addRow && (
        <ButtonAction text={"Agregar Mueble"} color="#1a7af8" action={addRow} />
      )}
    </div>
  );
};
const Exportar = ({ file }) => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  window.onresize = () =>
    setScreenWidth((width) => (width = window.innerWidth));

  return (
    <div className="flex flex-row items-center gap-2">
      {file && (
        <>
          <LabelAction
            text={
              <>
                <input
                  className="hidden z-10"
                  onClick={file}
                />
                {type(
                  breakpoint(screenWidth, breakPointMD),
                  "Descargar",
                  <FiDownload className="text-sv" />
                )}
              </>
            }
            color={"green"}
          ></LabelAction>
        </>
      )}
    </div>
  );
};
const AgregarMueble = ({ funcion }) => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  window.onresize = () =>
    setScreenWidth((width) => (width = window.innerWidth));

  return (
    <div className="flex flex-row items-center mr-4 gap-2">
      {funcion && (
        <LabelAction
          text={
            <>
              <input
                placeholder="Introduce a file"
                //accept=".json"
                className="hidden z-10"
                onClick={funcion}
              />
              {type(
                breakpoint(screenWidth, breakPointMD),
                "Agregar Mueble",
                <File className="text-sv" />
              )}
            </>
          }
          color={"#1a7af8"}
        ></LabelAction>
      )}
    </div>
  );
};

/**
 *
 *
 * @param {string} name
 * @return {Component}
 */
const Title = ({ name }) => {
  return (
    <div>
      <h2 className="text-sv">{name}</h2>
      <p className="text-slate-900/50 tracking-wide">Información de {name}</p>
    </div>
  );
};
const InputSearch = ({ getFilter }) => {
  return (
    <Input.Search
      placeholder="Buscar"
      className="w-[450px] lg:w-[550px] mr-4 flex justify-center items-center"
      onSearch={(e) => {
        getFilter({ text: e });
      }}
    />
  );
};
/**
 *
 *
 * @param {string, Function, Function} { name, addFile, addRow }
 * @return {Component}
 */
const Header = ({
  name,
  addFile,
  downloadFile,
  funcion,
  addRow,
  actions = true,
  getFilter,
  input = false,
  showUploadButtons = false,
  setLoading,
  setData,
  data,
  // complementos = false,
}) => {
  return (
    <header className="h-[120px] md:h-[93px] pl-4 py-4 border-b border-border flex justify-between">
      <Title name={name} />
      {input && <InputSearch getFilter={getFilter} />}
      <div className="h-full flex flex-row">
        {actions && (
          <Actions
            showUploadButtons={showUploadButtons}
            file={addFile}
            addRow={addRow}
            setLoading={setLoading}
            setData={setData}
            data={data}
          />
        )}
        {downloadFile && <Exportar file={downloadFile} />}
      </div>
      {funcion && <AgregarMueble funcion={funcion} />}
      {/* {complementos && <AgregarComplemento />} */}
    </header>
  );
};

export { Header };
