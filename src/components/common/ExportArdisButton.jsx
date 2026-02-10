import React from "react";
import { Button, Space } from "antd";
import LogoERP from "../../assets/logoERP.png";

const ExportArdisButton = () => {
    const handleExport = () => {
        const orderData = JSON.parse(localStorage.getItem("order"));
        const contenidoJSON = JSON.stringify(orderData, null, 2);
        const blob = new Blob([contenidoJSON], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const enlace = document.createElement("a");
        enlace.href = url;
        enlace.download = `${orderData.storeName +
            " " +
            orderData.customerName
            }.json`;
        document.body.appendChild(enlace);
        enlace.click();
        document.body.removeChild(enlace);
        URL.revokeObjectURL(url);
    };

    return (
        <Button
            style={{ width: 150 }}
            type="default"
            onClick={handleExport}
        >
            <Space>
                <img width={20} src={LogoERP} alt="Logo ERP" /> Export Ardis
            </Space>
        </Button>
    );
};

export default ExportArdisButton;
