import { Table, Typography, Divider } from "antd";

const ProductsTable = ({ dataSource, loading, onEdit, onDelete }) => {
  const columns = [
    { title: "Codigo", dataIndex: "referencia", key: "referencia" },
    { title: "Descripción", dataIndex: "descripcion", key: "descripcion" },
    { title: "Marca", dataIndex: "marca", key: "marca" },
    { title: "Tipo", dataIndex: "type", key: "type" },
    { title: "Grosor", dataIndex: "grosor", key: "grosor" },
    { title: "Cantidad", dataIndex: "qty", key: "qty" },
    { title: "Descuento", dataIndex: "discount", key: "discount" },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (text) => `${text}€`,
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_, record) => (
        <>
          <Typography.Link onClick={() => onDelete(record)}>Eliminar</Typography.Link>
          <Divider type="vertical" />
          <Typography.Link onClick={() => onEdit(record)}>Editar</Typography.Link>
        </>
      ),
    },
  ];

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      loading={loading}
      rowKey="referencia"
    />
  );
};

export default ProductsTable;
