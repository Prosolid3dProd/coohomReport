import React from "react";
import { Button, Space, Typography, Row, Col, Input } from "antd";
import { DownloadOutlined, FileAddOutlined } from "@ant-design/icons";
import HeaderActions from "./header/HeaderActions";

const { Title: AntTitle, Text } = Typography;

const Exportar = ({ file }) => {
  return (
    <Space>
      {file && (
        <Button
          onClick={file}
          icon={<DownloadOutlined />}
          style={{ borderColor: "green", color: "green" }}
        >
          Descargar
        </Button>
      )}
    </Space>
  );
};

const AgregarMueble = ({ funcion, buttonText = "Agregar Mueble" }) => {
  return (
    <Space>
      {funcion && (
        <Button type="primary" icon={<FileAddOutlined />} onClick={funcion}>
          {buttonText}
        </Button>
      )}
    </Space>
  );
};

const Title = ({ name }) => {
  return (
    <div>
      <AntTitle level={4} style={{ margin: 0, color: '#1a7af8' }}>{name}</AntTitle>
      <Text type="secondary">Información de {name}</Text>
    </div>
  );
};

const InputSearch = ({ getFilter }) => {
  return (
    <Input.Search
      placeholder="Buscar"
      allowClear
      style={{ maxWidth: 400 }}
      onSearch={(e) => {
        getFilter({ text: e });
      }}
    />
  );
};

const Header = ({
  name,
  addFile,
  downloadFile,
  funcion,
  buttonText,
  addRow,
  actions = true,
  getFilter,
  input = false,
  showUploadButtons = false,
  setLoading,
  setData,
  data,
}) => {
  return (
    <div style={{ padding: '12px 24px', background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
      <Row justify="space-between" align="middle" gutter={[16, 16]}>
        <Col>
          <Title name={name} />
        </Col>

        <Col flex="auto" style={{ display: 'flex', justifyContent: 'center' }}>
          {input && <InputSearch getFilter={getFilter} />}
        </Col>

        <Col>
          <Space size="middle">
            {actions && (
              <HeaderActions
                showUploadButtons={showUploadButtons}
                file={addFile}
                addRow={addRow}
                setLoading={setLoading}
                setData={setData}
                data={data}
              />
            )}
            {downloadFile && <Exportar file={downloadFile} />}
            {funcion && <AgregarMueble funcion={funcion} buttonText={buttonText} />}
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export { Header };
