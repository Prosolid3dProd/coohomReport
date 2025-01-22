import React, { useEffect, useState } from "react";
import { Table, message, Typography, Select, Button } from "antd";
import { getComplements, getComplementsByText } from "../../../handlers/order";
import { Header } from "../../content";

const { Option } = Select;

const Encimeras = ({ title, setEncimera }) => {
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroMarca, setFiltroMarca] = useState("");
  const [allTipos, setAllTipos] = useState([]);
  const [allMarcas, setAllMarcas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableHeight, setTableHeight] = useState(400); // Altura inicial predeterminada.

  useEffect(() => {
    fetchComplements();
  }, []);

  useEffect(() => {
    const tiposUnicos = [
      ...new Set(allData.map((item) => item.type).filter(Boolean)),
    ];
    const marcasUnicas = [
      ...new Set(allData.map((item) => item.marca).filter(Boolean)),
    ];
    setAllTipos(tiposUnicos);
    setAllMarcas(marcasUnicas);
  }, [allData]);

  useEffect(() => {
    applyFilters();
  }, [filtroTipo, filtroMarca]);

  useEffect(() => {
    // Calcula dinámicamente la altura disponible para la tabla.
    const updateTableHeight = () => {
      const windowHeight = window.innerHeight; // Altura total de la ventana.
      const headerHeight = 450; // Estimación de altura del encabezado y filtros.
      setTableHeight(windowHeight - headerHeight); // Ajusta la altura restante.
    };

    updateTableHeight(); // Calcula inicialmente.
    window.addEventListener("resize", updateTableHeight); // Actualiza al redimensionar.
    return () => window.removeEventListener("resize", updateTableHeight);
  }, []);

  const applyFilters = () => {
    const filteredData = allData.filter((item) => {
      const matchesTipo = filtroTipo ? item.type === filtroTipo : true;
      const matchesMarca = filtroMarca ? item.marca === filtroMarca : true;
      return matchesTipo && matchesMarca;
    });
    setData(filteredData);
  };

  const fetchComplements = async () => {
    setLoading(true);
    try {
      const response = await getComplements();
      const validData = response.map((item) => ({
        ...item,
        name: item.name || "(Vacio)",
        code: item.code || "(Vacio)",
        type: item.type || "(Vacio)",
        marca: item.marca || "(Vacio)",
      }));
      setAllData(validData);
      setData(validData);
    } catch (error) {
      message.error("No se pudieron cargar los complementos.");
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFiltroTipo("");
    setFiltroMarca("");
    setData(allData);
  };

  const handleSearch = async (searchTerm) => {
    try {
      const results = await getComplementsByText(searchTerm);
      if (results && results.length) {
        setAllData(results);
        setData(results);
      } else {
        message.warning("No se encontraron resultados para la búsqueda.");
        fetchComplements();
      }
    } catch (error) {
      fetchComplements();
    }
  };

  const columns = [
    {
      title: "Código",
      dataIndex: "code",
      key: "code",
      width: 120,
    },
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
      width: 450,
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
      width: 100,
      render: (text) => `${parseFloat(text).toFixed(2)} €`,
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      render: (_, record) => (
        <Typography.Link onClick={() => setEncimera(record)}>
          Agregar
        </Typography.Link>
      ),
    },
  ];

  return (
    <main>
      <Header
        name={title}
        actions={false}
        input={true}
        getFilter={handleSearch}
      />
      <div>
        <Select
          placeholder="Selecciona tipo"
          style={{ width: 200, marginRight: 10 }}
          onChange={(value) => setFiltroTipo(value)}
          value={filtroTipo || undefined}
          allowClear
        >
          {allTipos.map((tipo) => (
            <Option key={tipo} value={tipo}>
              {tipo}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Selecciona marca"
          style={{ width: 200 }}
          onChange={(value) => setFiltroMarca(value)}
          value={filtroMarca || undefined}
          allowClear
        >
          {allMarcas.map((marca) => (
            <Option key={marca} value={marca}>
              {marca}
            </Option>
          ))}
        </Select>
        <Button onClick={resetFilters}>Limpiar Filtros</Button>
      </div>
      <Table
        dataSource={data}
        columns={columns}
        rowKey="code"
        loading={loading}
        // pagination={false} // Desactiva la paginación para mostrar solo filas visibles.
        scroll={{
          y: tableHeight, // Ajusta la altura de la tabla dinámicamente.
        }}
      />
    </main>
  );
};

export default Encimeras;
