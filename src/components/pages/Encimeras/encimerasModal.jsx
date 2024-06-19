import React, { useEffect, useState } from "react";
import { Table, message, Typography } from "antd";

import { getComplements, getComplementsByText } from "../../../handlers/order";
import { Header } from "../../content";

const Encimeras = ({ title, setEncimera }) => {
  const [data, setData] = useState([]);

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

  return (
    <main className="overflow-y-scroll">
      <Header
        name={title}
        actions={false}
        input={true}
        getFilter={getFilterComplements}
      />
      <Table
        loading={editado}
        dataSource={data}
        searchable
        // style={{ width: "100%", height: "100%" }}
        // pagination={{ pageSize: 10 }}
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
