import { useState, useEffect } from "react";
import { Button, message, Upload, Input, Tooltip } from "antd";
import { File } from "../icons";
import { LabelAction } from "../utils";
import { ButtonAction } from "../utils/btnAction";
import { FiDownload } from "../icons";
import { DeleteOutlined, DownloadOutlined, UploadOutlined } from "@ant-design/icons";
import { breakPointMD, breakpoint, typeOfText as type } from "./logic/btnLogic";
import { fetchData } from "../pages/encimeras/encimeras";
import { mergeAndUpdateOrder } from "../../handlers/order";
import { procesarArchivoXLSX } from "../content/logic/obtenerArchivoJson";
import { useUser } from "../../context";

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


  const handleChangeJSON = async (json) => {
    setLoading(true);
    try {
      const outcome = await mergeAndUpdateOrder(json, data);
      if (outcome.type === "update") {
        setData((prevData) =>
          prevData.map((item, i) => (i === outcome.index ? outcome.result : item))
        );
        message.success(outcome.result.projectName + " actualizado correctamente");
      } else {
        setData((prevData) => [outcome.result, ...prevData]);
        message.success(outcome.result.projectName + " agregado correctamente");
      }
    } catch (error) {
      console.error("Error updating data", error);
      message.error("Error al actualizar los datos");
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

  const { token } = useUser();
  const authHeader = token ? `Bearer ${token}` : "";

  const props1 = {
    name: "sampleFile",
    action: `${import.meta.env.VITE_API_URL}/cargarNuevoXlsxSola`,
    method: "POST",
    headers: {
      authorization: authHeader,
    },
    onChange: handleChange,
  };

  const props2 = {
    name: "sampleFile",
    action: `${import.meta.env.VITE_API_URL}/eliminarComplementsXlsxSola`,
    method: "POST",
    headers: {
      authorization: authHeader,
    },
    onChange: handleChange,
  };

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
          <Tooltip title="Cargar un excel con esta estructura de cabecera [Referencia/Nombre/Tipo/Marca/Precio]">
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
                icon={<DeleteOutlined />}
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

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      {file && (
        <Button
          type="default"
          className="flex items-center"
          style={{
            height: "60px",
            border: "1px solid green",
            color: "green",
            width: "102px",
          }}
          onClick={file}
          icon={<DownloadOutlined />}
        >
          {type(
            breakpoint(screenWidth, breakPointMD),
            "Descargar",
            <FiDownload className="text-xl" />
          )}
        </Button>
      )}
    </div>
  );
};
const AgregarMueble = ({ funcion }) => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
