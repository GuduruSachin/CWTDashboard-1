import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

export interface HeaderStyle {
  default?: { bgColor?: string; textColor?: string };
  overrides?: { [header: string]: { bgColor?: string; textColor?: string } };
}
@Injectable()
export class ExcelService {
  constructor() { }
  public exportAsExcelFile(json: any[], excelFileName: string, headerStyles?: HeaderStyle): void {
    if (!json || json.length === 0) return;

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    // Get headers dynamically
    const headers = Object.keys(json[0]);

    // Apply dynamic header styles if provided
    headers.forEach((header, colIndex) => {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c: colIndex });
      if (!worksheet[cellRef]) return;

      // Apply default first
      let bgColor = headerStyles?.default?.bgColor || '#D9D9D9';
      let textColor = headerStyles?.default?.textColor || '#000000';

      // If override exists, apply it
      if (headerStyles?.overrides && headerStyles.overrides[header]) {
        bgColor = headerStyles.overrides[header].bgColor || bgColor;
        textColor = headerStyles.overrides[header].textColor || textColor;
      }

      worksheet[cellRef].s = {
        fill: { type: 'pattern', pattern: 'solid', fgColor: { rgb: bgColor } },
        font: { bold: true, size : 12,  color: { rgb: textColor } },
        alignment: { horizontal: 'center', vertical: 'middle', wrapText: true }
      };
    });
    worksheet['!cols'] = headers.map(h => ({ wch: Math.max(10, h.length + 2) }));

    const workbook: XLSX.WorkBook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array', compression: true });

    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, `${fileName} ${new Date().toLocaleDateString()}${EXCEL_EXTENSION}`);
  }
  // public exportascsvfile(data: any[], excelFileName: string){
  //   const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
  //   const header = Object.keys(data[0]);
  //   let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
  //   csv.unshift(header.join(','));
  //   let csvArray = csv.join('\r\n');

  //   var blob = new Blob([csvArray], {type: 'text/csv' })
  //   FileSaver.saveAs(blob, excelFileName + ' '+ new Date().toLocaleDateString()+".csv");
  // }
  // public exportasxlsfile(data: any[], excelFileName: string){
  //     const blob = new Blob([JSON.stringify(data)], { type: 'application/vnd.ms-excel;charset=utf-8' });
  //     FileSaver.saveAs(blob, excelFileName + ' '+ new Date().toLocaleDateString()+".xls");
  // }
}