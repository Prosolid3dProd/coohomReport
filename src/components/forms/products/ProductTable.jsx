import React from "react";
import { Table, Button, Popconfirm, Space, Typography } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Text } = Typography;

export const ProductTable = ({
    dataSource,
    loading,
    onEdit,
    onDelete,
}) => {
    const columns = [
        {
            title: "Código",
            dataIndex: "referencia",
            key: "referencia",
            width: 120,
        },
        {
            title: "Descripción",
            dataIndex: "descripcion",
            key: "descripcion",
            ellipsis: true,
        },
        {
            title: "Marca",
            dataIndex: "marca",
            key: "marca",
            width: 120,
        },
        {
            title: "Tipo",
            dataIndex: "type",
            key: "type",
            width: 130,
        },
        {
            title: "Grosor",
            dataIndex: "grosor",
            key: "grosor",
            width: 80,
        },
        {
            title: "Cant.",
            dataIndex: "qty",
            key: "qty",
            width: 70,
            align: "center",
        },
        {
            title: "Desc.",
            dataIndex: "discount",
            key: "discount",
            width: 70,
            align: "center",
            render: (text) => text ? `${text}%` : "-",
        },
        {
            title: "Total",
            dataIndex: "total",
            key: "total",
            width: 100,
            align: "right",
            render: (text) => (
                <Text strong style={{ color: "#1677ff" }}>
                    {parseFloat(text).toFixed(2)}€
                </Text>
            ),
        },
        {
            title: "Acciones",
            key: "actions",
            width: 130,
            align: "center",
            fixed: "right",
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => onEdit(record)}
                    >
                        Editar
                    </Button>
                    <Popconfirm
                        title="¿Eliminar componente?"
                        description="Esta acción no se puede deshacer"
                        onConfirm={() => onDelete(record)}
                        okText="Eliminar"
                        cancelText="Cancelar"
                        okButtonProps={{ danger: true }}
                    >
                        <Button type="link" icon={<DeleteOutlined />} danger size="small">
                            Eliminar
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Table
            dataSource={dataSource}
            columns={columns}
            loading={loading}
            pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Total: ${total} componentes`,
            }}
            scroll={{ x: 1000 }}
            rowKey={(record) => record._id || record.referencia}
            size="small"
        />
    );
};

export default ProductTable;
