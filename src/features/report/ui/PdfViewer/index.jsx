import { Spin } from "antd";
import { PDFViewer } from "@react-pdf/renderer";

const PdfViewer = ({ loading, children }) => {
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <PDFViewer style={{ width: "100%", height: "100%" }}>
      {children}
    </PDFViewer>
  );
};

export default PdfViewer;
