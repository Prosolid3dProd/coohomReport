import { Input } from "antd";
import { useState } from "react";
import { File } from "../icons";
import { LabelAction } from "../utils";
import { ButtonAction } from "../utils/btnAction";
import { FiDownload } from "../icons";
import { breakPointMD, breakpoint, typeOfText as type } from "./logic/btnLogic";
// import { AgregarComplemento } from "../pages/Encimeras/encimeras";

/**
 *
 *
 * @param {Function}  file
 * @param {Function}  clear
 * @return {Component}
 */
const Actions = ({ file, addRow }) => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  window.onresize = () =>
    setScreenWidth((width) => (width = window.innerWidth));

  return (
    <div className="flex flex-row items-center mr-4 gap-2">
      {file && (
        <LabelAction
          text={
            <>
              <input
                placeholder="Introduce a file"
                type="file"
                //accept=".json"
                className="hidden z-10"
                onChange={file}
              />
              {type(
                breakpoint(screenWidth, breakPointMD),
                "Importar",
                <File className="text-sv" />
              )}
            </>
          }
          color={"#1a7af8"}
        ></LabelAction>
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
    <div className="flex flex-row items-center mr-4 gap-2">
      {file && (
        <LabelAction
          text={
            <>
              <input
                placeholder="Introduce a file"
                //accept=".json"
                className="hidden z-10"
                onChange={file}
              />
              {type(
                breakpoint(screenWidth, breakPointMD),
                "Exportar",
                <FiDownload className="text-sv" />
              )}
            </>
          }
          color={"#1a7af8"}
        ></LabelAction>
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
  // complementos = false,
}) => {
  return (
    <header className="h-[120px] md:h-[93px] pl-4 py-4 border-b border-border flex justify-between">
      <Title name={name} />
      {input && <InputSearch getFilter={getFilter} />}
      <div className="h-full flex flex-row">
        {actions && <Actions file={addFile} addRow={addRow} />}
        {downloadFile && <Exportar file={downloadFile} />}
      </div>
      {funcion && <AgregarMueble funcion={funcion} />}
      {/* {complementos && <AgregarComplemento />} */}
    </header>
  );
};

export { Header };
