import React from "react";
import { Button, Upload, Tooltip, Space, message } from "antd";
import { FileAddOutlined, DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import { parseJson3D } from "../../../data";
import { createOrder } from "../../../handlers/order";
import { procesarArchivoXLSX } from "../../../utils/excel";
import { fetchData } from "../../../components/pages/Encimeras/encimeras";

export const HeaderActions = ({
    file,
    addRow,
    showUploadButtons,
    setLoading,
    setData,
    data,
}) => {
    const JSONFile = (file) => {
        if (file.name.endsWith(".xlsx")) {
            const readerXlsx = new FileReader();
            procesarArchivoXLSX(readerXlsx, file);
            return false; // Prevent upload
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
            return false; // Prevent upload
        }
    };

    const handleChangeJSON = async (json) => {
        setLoading(true);
        try {
            const newData = await parseJson3D(json);

            const existingIndex = data.findIndex(
                (item) => item.orderCode === newData.orderCode
            );

            if (existingIndex !== -1) {
                const upData = await createOrder(newData);
                setData((prevData) => {
                    const updatedData = prevData.map((item, index) =>
                        index === existingIndex ? upData.result : item
                    );
                    return updatedData;
                });
                message.success(
                    upData.result.projectName + " actualizado correctamente"
                );
            } else {
                const order = await createOrder(newData);
                setData((prevData) => [order.result, ...prevData]);
                message.success(order.result.projectName + " agregado correctamente");
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

    const props1 = {
        name: "sampleFile",
        action: "https://api.simulhome.com/coohomReport/cargarNuevoXlsxSola",
        method: "POST",
        headers: {
            authorization: "authorization-text",
        },
        onChange: handleChange,
    };

    const props2 = {
        name: "sampleFile",
        action: "https://api.simulhome.com/coohomReport/eliminarComplementsXlsxSola",
        method: "POST",
        headers: {
            authorization: "authorization-text",
        },
        onChange: handleChange,
    };

    return (
        <Space>
            {file && (
                <Upload beforeUpload={JSONFile} showUploadList={false} multiple={false}>
                    <Button
                        type="primary"
                        ghost
                        icon={<UploadOutlined />}
                        style={{ borderColor: "blue", color: "blue" }}
                    >
                        Añadir
                    </Button>
                </Upload>
            )}
            {showUploadButtons && (
                <Space>
                    <Tooltip title="Cargar un excel con esta estructura de cabecera [Referencia/Nombre/Tipo/Marca/Precio]">
                        <Upload showUploadList={false} multiple={false} {...props1}>
                            <Button
                                type="primary"
                                ghost
                                icon={<UploadOutlined />}
                                style={{ borderColor: "blue", color: "blue" }}
                            >
                                Añadir
                            </Button>
                        </Upload>
                    </Tooltip>
                    <Tooltip title="Cargar un excel con una columna llamada 'Referencia' que tenga los codigos de los elementos que quieras eliminar.">
                        <Upload showUploadList={false} multiple={false} {...props2}>
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                            >
                                Eliminar
                            </Button>
                        </Upload>
                    </Tooltip>
                </Space>
            )}
            {addRow && (
                <Button type="primary" onClick={addRow} icon={<FileAddOutlined />}>
                    Agregar Mueble
                </Button>
            )}
        </Space>
    );
};

export default HeaderActions;
