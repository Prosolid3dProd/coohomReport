const procesarArchivoXLSX = (readerXlsx, fileUpload) => {
  readerXlsx.onload = function (e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const serialLabel = "Product serial number";
      const nameLabel = "Product name (editable)";
      const linkLabel = "预览图链接";

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const headers = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0];

      const serialIndex = headers.indexOf(serialLabel);
      const nameIndex = headers.indexOf(nameLabel);
      const linkIndex = headers.indexOf(linkLabel);

      const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const resultArray = sheetData.slice(1).map((row) => ({
        serial: serialIndex !== -1 ? row[serialIndex] : undefined,
        name: nameIndex !== -1 ? row[nameIndex] : undefined,
        link: linkIndex !== -1 ? row[linkIndex] : undefined,
      }));

      const jsonString = JSON.stringify(resultArray, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      saveAs(blob, "excelJson.json");
    } catch (error) {
      console.error(error);
    }
  };
  readerXlsx.readAsArrayBuffer(fileUpload);
};

const exportarArchivo = (data) => {
  const modifiedData = data
    .map((obj) => {
      const referencia = typeof obj.code === "string" ? obj.code : "";
      let nombre = typeof obj.name === "string" ? obj.name : "";
      nombre = nombre.replace("\n", " ");
      return {
        Referencia: referencia,
        Nombre: nombre,
        Tipo: obj.type,
        Marca: obj.marca,
        Precio: parseFloat(obj.price).toFixed(2),
        // width: obj.width,
        // height: obj.height,
        // archived: obj.archived,
        // id: obj._id,
        // fecha1: obj.createdAt,
        // fecha2: obj.updatedAt,
        // v: obj.__v,
      };
    })
    .filter((obj) => obj !== null);
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(modifiedData);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");
  const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], { type: "application/octet-stream" });
  saveAs(blob, "libreria_Sola.xlsx");
};

export { procesarArchivoXLSX, exportarArchivo };
