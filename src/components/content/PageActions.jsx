import { useMemo, useCallback } from "react";
import { Button, message, Upload, Tooltip } from "antd";
import { FiDownload, File } from "../../shared/ui/icons";
import { ButtonAction, LabelAction } from "../../shared/ui/Button";
import { DeleteOutlined, DownloadOutlined, UploadOutlined } from "@ant-design/icons";
import { breakPointMD, breakpoint, typeOfText as type } from "./logic/btnLogic";
import { fetchData } from "../pages/encimeras/encimeras";
import { mergeAndUpdateOrder } from "../../handlers/order";
import { procesarArchivoXLSX } from "./logic/obtenerArchivoJson";
import { useUser } from "../../context";
import useWindowWidth from "../../shared/hooks/useWindowWidth";

export const Actions = ({
  file,
  addRow,
  showUploadButtons,
  setLoading,
  setData,
  data,
}) => {
  const { token } = useUser();

  const authHeader = useMemo(
    () => (token ? `Bearer ${token}` : ""),
    [token]
  );

  const handleChange = useCallback(
    async (info) => {
      if (info.file.status === "done") {
        message.success(`${info.file.name} biblioteca actualizada con exito`);
        await fetchData(setLoading, setData);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} error al actualizar la biblioteca.`);
      }
    },
    [setLoading, setData]
  );

  const uploadProps = useMemo(
    () => ({
      add: {
        name: "sampleFile",
        action: `${import.meta.env.VITE_API_URL}/cargarNuevoXlsxSola`,
        method: "POST",
        headers: { authorization: authHeader },
        onChange: handleChange,
      },
      remove: {
        name: "sampleFile",
        action: `${import.meta.env.VITE_API_URL}/eliminarComplementsXlsxSola`,
        method: "POST",
        headers: { authorization: authHeader },
        onChange: handleChange,
      },
    }),
    [authHeader, handleChange]
  );

  async function handleChangeJSON(json) {
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
    } finally {
      setLoading(false);
    }
  }

  function beforeUploadJSON(uploadedFile) {
    if (uploadedFile.name.endsWith(".xlsx")) {
      const readerXlsx = new FileReader();
      procesarArchivoXLSX(readerXlsx, uploadedFile);
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const json = JSON.parse(reader.result);
          handleChangeJSON(json);
        } catch {
          message.error("Formato de archivo inválido");
        }
      };
      reader.onerror = () => message.error("Error al leer el archivo");
      reader.readAsText(uploadedFile);
    }
    return false;
  }

  return (
    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginRight: 16, gap: 8 }}>
      {file && (
        <Upload beforeUpload={beforeUploadJSON} showUploadList={false} multiple={false}>
          <Button
            style={{ height: "60px", border: "1px solid blue", color: "blue", width: "100px" }}
            icon={<UploadOutlined />}
          >
            Añadir
          </Button>
        </Upload>
      )}
      {showUploadButtons && (
        <>
          <Tooltip title="Cargar un excel con esta estructura de cabecera [Referencia/Nombre/Tipo/Marca/Precio]">
            <Upload showUploadList={false} multiple={false} {...uploadProps.add}>
              <Button
                style={{ height: "60px", border: "1px solid blue", color: "blue", width: "100px" }}
                icon={<UploadOutlined />}
              >
                Añadir
              </Button>
            </Upload>
          </Tooltip>
          <Tooltip title="Cargar un excel con una columna llamada 'Referencia' que tenga los codigos de los elementos que quieras eliminar.">
            <Upload showUploadList={false} multiple={false} {...uploadProps.remove}>
              <Button
                style={{ height: "60px", border: "1px solid red", color: "red" }}
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

export const Exportar = ({ file }) => {
  const width = useWindowWidth();
  const isDesktop = breakpoint(width, breakPointMD);

  if (!file) return null;
  return (
    <Button
      type="default"
      style={{ height: "60px", border: "1px solid green", color: "green", width: "102px" }}
      onClick={file}
      icon={<DownloadOutlined />}
    >
      {type(isDesktop, "Descargar", <FiDownload style={{ fontSize: 20 }} />)}
    </Button>
  );
};

export const AgregarMueble = ({ funcion }) => {
  const width = useWindowWidth();
  const isDesktop = breakpoint(width, breakPointMD);

  if (!funcion) return null;
  return (
    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginRight: 16, gap: 8 }}>
      <LabelAction
        text={
          <>
            <input
              placeholder="Introduce a file"
              style={{ display: "none" }}
              onClick={funcion}
            />
            {type(isDesktop, "Agregar Mueble", <File style={{ fontSize: 24 }} />)}
          </>
        }
        color={"#1a7af8"}
      />
    </div>
  );
};