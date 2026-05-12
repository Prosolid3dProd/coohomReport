import { Input } from "antd";
import { Actions, Exportar, AgregarMueble } from "./PageActions";

const Title = ({ name }) => (
  <div>
    <h2 style={{ fontSize: "var(--font-sv)" }}>{name}</h2>
    <p style={{ color: "rgba(15,23,42,0.5)", letterSpacing: "0.05em" }}>Información de {name}</p>
  </div>
);

const InputSearch = ({ getFilter }) => (
  <Input.Search
    placeholder="Buscar"
    style={{ width: 500, marginRight: 16 }}
    onSearch={(e) => getFilter({ text: e })}
  />
);

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
}) => (
  <header style={{ height: 93, paddingLeft: 16, paddingTop: 16, paddingBottom: 16, borderBottom: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <Title name={name} />
    {input && <InputSearch getFilter={getFilter} />}
    <div style={{ height: "100%", display: "flex", flexDirection: "row", alignItems: "center" }}>
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
  </header>
);

export { Header };
