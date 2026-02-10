import React from "react";
import { Table, Popconfirm, Typography } from "antd";

export const CabinetTable = ({ dataSource, loading, onEdit, onDelete }) => {
    return (
        <Table
            className="border border-t-0 border-border"
            loading={loading}
            dataSource={dataSource}
            pagination={false}
            rowKey={"id"}
            scroll={{ y: 'calc(100vh - 390px)' }}
        >
            <Table.Column
                title="Acción"
                dataIndex="action"
                align="center"
                key="action"
                width={150}
                render={(item, rows) => (
                    <>
                        <Typography.Link
                            onClick={() => onEdit(rows)}
                        >
                            Editar
                        </Typography.Link>
                        &nbsp;&nbsp; | &nbsp;&nbsp;
                        <Popconfirm
                            okType="default"
                            okText="Si"
                            cancelText="No"
                            title="¿Estás seguro de eliminar este mueble?"
                            onConfirm={() => onDelete(rows)}
                        >
                            <Typography.Link>Eliminar</Typography.Link>
                        </Popconfirm>
                    </>
                )}
            />

            <Table.Column
                title="Referencia"
                dataIndex="reference"
                key="reference"
                width={120}
                render={(item, rows) => <>{rows.reference}</>}
            />
            <Table.Column
                title="Nombre"
                dataIndex="name"
                key="name"
                width={400}
                render={(item, rows) => <>{rows.name}</>}
            />

            <Table.Column
                title="Precio"
                align="right"
                dataIndex="price"
                key="price"
                render={(item, rows) => <>{rows.total || 0}&nbsp;€</>}
            />
        </Table>
    );
};

export default CabinetTable;
