import React, { useEffect, useState } from "react";
import { Table, message, Typography, Select, Button } from "antd";
import { getComplements, getComplementsByText } from "../../../handlers/order";
import { Header } from "../../content";

const { Option } = Select;

const Encimeras = ({ title, setEncimera }) => {
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroMarca, setFiltroMarca] = useState('');
  const [tipos, setTipos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [allTipos, setAllTipos] = useState([]);
  const [allMarcas, setAllMarcas] = useState([]);
  const [filtrosActivos, setFiltrosActivos] = useState(false);

  useEffect(() => {
    // Llamada inicial para obtener todos los complementos
    getDataComplements();
  }, []);

  useEffect(() => {
    // Extraer tipos únicos de los datos filtrados
    const tiposUnicos = [...new Set(allData.map(item => item.type))];
    setAllTipos(tiposUnicos);

    // Extraer marcas únicas de los datos filtrados
    const marcasUnicas = [...new Set(allData.map(item => item.marca))];
    setAllMarcas(marcasUnicas);
  }, [allData]);

  useEffect(() => {
    filtrarDatos();
  }, [filtroTipo, filtroMarca]);

  const filtrarDatos = () => {
    let filteredData = [...allData];
    let filtrosAplicados = false;

    if (filtroTipo) {
      filteredData = filteredData.filter(item => item.type === filtroTipo);
      filtrosAplicados = true;
    }

    if (filtroMarca) {
      filteredData = filteredData.filter(item => item.marca === filtroMarca);
      filtrosAplicados = true;
    }

    if (filtrosAplicados) {
      setFiltrosActivos(true);
    } else {
      setFiltrosActivos(false);
      filteredData = [...allData];
    }

    setData(filteredData);
  };

  const handleTipoChange = (value) => {
    setFiltroTipo(value);
  };

  const handleMarcaChange = (value) => {
    setFiltroMarca(value);
  };

  const getDataComplements = async () => {
    try {
      const res = await getComplements();
      // Filtrar elementos undefined y actualizar el estado de los datos
      const temp = res.filter(element => element.name !== undefined && element.name !== "");
      setAllData(temp);
    } catch (err) {
      console.error("Error al obtener datos:", err);
    }
  };

  const getFilterComplements = async (params) => {
    try {
      const result = await getComplementsByText(params);
      if (result && result.length > 0) {
        setAllData(result);
      } else {
        message.error("No se encontraron resultados");
        getDataComplements();
      }
    } catch (err) {
      console.error("Error al filtrar datos:", err);
      getDataComplements(); // Volver a cargar todos los datos en caso de error
    }
  };

  const resetFilters = () => {
    setFiltroTipo('');
    setFiltroMarca('');
  };

  return (
    <main className="overflow-y-scroll">
      <Header
        name={title}
        actions={false}
        input={true}
        getFilter={getFilterComplements}
      />
      <div style={{ marginBottom: 20 }}>
        <Select
          placeholder="Selecciona tipo"
          style={{ width: 200, marginRight: 10 }}
          onChange={handleTipoChange}
          allowClear
          value={filtroTipo}
        >
          {allTipos.map(tipo => (
            <Option key={tipo} value={tipo}>{tipo}</Option>
          ))}
        </Select>
        <Select
          placeholder="Selecciona marca"
          style={{ width: 200 }}
          onChange={handleMarcaChange}
          allowClear
          value={filtroMarca}
        >
          {allMarcas.map(marca => (
            <Option key={marca} value={marca}>{marca}</Option>
          ))}
        </Select>
        <Button onClick={resetFilters}>Limpiar Filtros</Button>
      </div>
      <Table
        dataSource={filtrosActivos ? data : allData}
        columns={[
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
            dataIndex: "acciones",
            key: "acciones",
            render: (text, record) => (
              <Typography.Link
                onClick={() => {
                  setEncimera(record);
                }}
              >
                Agregar
              </Typography.Link>
            ),
          },
        ]}
      />
    </main>
  );
};

export default Encimeras;
