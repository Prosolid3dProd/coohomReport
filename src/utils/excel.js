import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

/**
 * Exporta un array de objetos a un archivo Excel (.xlsx)
 * @param {Array} data - Datos a exportar
 * @param {String} name - Nombre del archivo (sin extensión)
 */
export const exportarArchivo = (data, name = 'datos_exportados') => {
    try {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(dataBlob, `${name}.xlsx`);
        console.log("Archivo exportado correctamente");
    } catch (error) {
        console.error("Error al exportar archivo", error);
    }
};

/**
 * Procesa un archivo XLSX.
 * @param {FileReader} reader - FileReader instance
 * @param {File} file - File object
 */
export const procesarArchivoXLSX = (reader, file) => {
    console.warn("procesarArchivoXLSX logic was missing and has been stubbed. Please implement if needed.");
    reader.onload = (e) => {
        try {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const json = XLSX.utils.sheet_to_json(worksheet);
            console.log("Parsed Excel Data:", json);
            // Here we would normally callback with the data
        } catch (err) {
            console.error("Error reading Excel", err);
        }
    };
    reader.readAsBinaryString(file);
};
