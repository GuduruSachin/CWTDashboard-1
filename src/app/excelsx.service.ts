import { Injectable } from '@angular/core';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as FileSaver from 'file-saver';

const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

export interface SheetOptions {
  sheetName?: string;

  // Data rows for this sheet
  data: any[];

  // Default styling for data rows
  defaultTextColor?: string;
  defaultBackgroundColor?: string;

  // Header styling per column
  headerStyles?: {
    [key: string]: {
      bgColor?: string;   // header background
      textColor?: string; // header font color
    };
  };

  // Optional: column formatting (Excel number or Date format)
  columnFormats?: {
    [format: string]: string[]; 
  };
  rowStyles?: {
    [rowIndex: number]: {
      font?: Partial<Excel.Font>;
      fill?: Partial<Excel.Fill>;
      alignment?: Partial<Excel.Alignment>;
    };
  };
  columnStyles?: {
    [colKey: string]:
      | {
          font?: Partial<Excel.Font>;
          fill?: Partial<Excel.Fill>;
          alignment?: Partial<Excel.Alignment>;
          width?: number;
        }
      | ((value: any, rowIndex: number) => {
          font?: Partial<Excel.Font>;
          fill?: Partial<Excel.Fill>;
          alignment?: Partial<Excel.Alignment>;
        });
  };
}

@Injectable({
  providedIn: 'root',
})
export class ExcelSXService {
  constructor() {}

  /**
   * Export multiple sheets to a single Excel file
   * @param sheets Array of sheet definitions
   * @param fileName Name of the Excel file to generate
   */
  async exportAsExcelFile(sheets: SheetOptions[], fileName: string) {
    const workbook = new Excel.Workbook();

    if (!sheets || sheets.length === 0) {
      console.warn('No sheets provided for Excel export');
      return;
    }

    for (const sheet of sheets) {
        if (!sheet.data || sheet.data.length === 0) {
        console.warn(`Skipping empty sheet: ${sheet.sheetName}`);
        continue;
        }

        const worksheet = workbook.addWorksheet(sheet.sheetName || 'Sheet1');

        // Generate columns based on object keys
        worksheet.columns = Object.keys(sheet.data[0]).map((key) => ({
            header: this.toTitleCase(key),
            key,
            width: 30,
        }));

        // Prepare a mapping: columnKey -> format
        const columnFormatMapping: { [key: string]: string } = {};
        if (sheet.columnFormats) {
            Object.keys(sheet.columnFormats).forEach((format) => {
                const columns = sheet.columnFormats![format];
                columns.forEach((col) => {
                    columnFormatMapping[col] = format;
                });
            });
        }
        
        // Add rows (no coloring)
        sheet.data.forEach((row) => {
            const newRow = worksheet.addRow(row);
            
            newRow.eachCell((cell, colNumber) => {
                const columnKey = worksheet.getColumn(colNumber).key?.toString();

                // Default format = text
                cell.numFmt = '@';

                // Apply format if exists
                if (columnFormatMapping[columnKey]) {
                    cell.numFmt = columnFormatMapping[columnKey];
                }

                // Alignment & wrap text
                cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
            });
        });
        // ✅ Apply row styles
        if (sheet.rowStyles) {
            Object.entries(sheet.rowStyles).forEach(([rowIndex, style]) => {
                const row = worksheet.getRow(Number(rowIndex));
                row.eachCell((cell) => {
                    if (style.font) cell.font = style.font;
                    if (style.fill) cell.fill = style.fill;
                    if (style.alignment) cell.alignment = style.alignment;
                });
            });
        }
        // Header styling per column
        const headerRow = worksheet.getRow(1);
        headerRow.eachCell((cell, colNumber) => {
            const columnKey = worksheet.getColumn(colNumber).key?.toString();
            const style = sheet.headerStyles?.[columnKey];
            cell.font = {
                color: { argb: sheet?.defaultTextColor ? sheet?.defaultTextColor : style?.textColor || 'FFFFFFFF' },
                bold : true,
                size : 12
            };
            cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: sheet?.defaultBackgroundColor ? sheet?.defaultBackgroundColor : style?.bgColor || 'FF34495E' }, // default blue
            };
        });
        // Example pattern inside your sheet loop
        if (sheet.columnStyles) {
            Object.entries(sheet.columnStyles).forEach(([colKey, styleOrFn]) => {
                const col = worksheet.getColumn(colKey);
                if (typeof styleOrFn !== 'function' && styleOrFn.width) {
                    col.width = styleOrFn.width;
                }
                col.eachCell((cell, rowNumber) => {
                    if (rowNumber === 1) return; // Skip header row
                    if (typeof styleOrFn === 'function') {
                        const style = styleOrFn(cell.value, rowNumber);
                        if (style?.font) cell.font = style.font;
                        if (style?.fill) cell.fill = style.fill;
                        if (style?.alignment) cell.alignment = style.alignment;
                    } else {
                        if (styleOrFn.font) cell.font = styleOrFn.font;
                        if (styleOrFn.fill) cell.fill = styleOrFn.fill;
                        if (styleOrFn.alignment) cell.alignment = styleOrFn.alignment;
                    }
                });
            });
        }
    }

    // Generate file and trigger download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(blob, `${fileName}${EXCEL_EXTENSION}`);
  }

  private toTitleCase(str: string): string {
    return str
      .replace(/[_-]/g, ' ')
      .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1));
  }
}