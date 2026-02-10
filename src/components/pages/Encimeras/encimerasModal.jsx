import React, { useEffect, useState } from "react";
import { Table, Button, message } from "antd";
import { Header } from "../../content";
import { fetchData } from "./encimeras";
import { getComplementsByText } from "../../../handlers/order";

const EncimerasModal = ({ setEncimera }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData(setLoading, setData);
    }, []);

    const getFilterComplements = async (params) => {
        setLoading(true);
        try {
            const result = await getComplementsByText(params);
            if (result && result.length > 0) setData(result);
            else {
                message.error("No se encontraron resultados");
                fetchData(setLoading, setData);
            }
        } catch (error) {
            console.error("Error filtering orders:", error);
        }
        setLoading(false);
    };

    // Calculate unique filters dynamically
    const typeFilters = [...new Set(data.map((item) => item.type))].map(
        (type) => ({ text: type, value: type })
    );

    const brandFilters = [...new Set(data.map((item) => item.marca))].map(
        (marca) => ({ text: marca, value: marca })
    );

    const columns = [
        {
            title: "Referencia",
            dataIndex: "code",
            key: "code",
            width: 150,
        },
        {
            title: "Descripción",
            dataIndex: "name",
            key: "name",
            width: 400,
        },
        {
            title: "Tipo",
            dataIndex: "type",
            key: "type",
            width: 150,
            filters: typeFilters,
            onFilter: (value, record) => record.type === value,
        },
        {
            title: "Marca",
            dataIndex: "marca",
            key: "marca",
            width: 150,
            filters: brandFilters,
            onFilter: (value, record) => record.marca === value,
        },
        {
            title: "Precio",
            dataIndex: "price",
            key: "price",
            width: 120,
            render: (text) => parseFloat(text).toFixed(2),
        },
        {
            title: "Acción",
            key: "action",
            width: 100,
            render: (_, record) => (
                <Button type="primary" onClick={() => setEncimera(record)}>
                    Seleccionar
                </Button>
            ),
        },
    ];

    return (
        <div style={{ height: "70vh", display: "flex", flexDirection: "column" }}>
            <Header
                name="Catálogo de Encimeras"
                input={true}
                getFilter={getFilterComplements}
                actions={false}
            />
            <div style={{ flex: 1, marginTop: "16px", overflow: "hidden" }}>
                <Table
                    dataSource={data}
                    columns={columns}
                    rowKey="_id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                    scroll={{ y: "calc(70vh - 200px)" }}
                    sticky
                />
            </div>
        </div>
    );
};

export default EncimerasModal;
