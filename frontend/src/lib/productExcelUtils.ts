import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export interface ProductImportData {
    name: string;
    description: string;
}

export interface ProductExportData {
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryName: string;
}

export interface ImportValidationResult {
    isValid: boolean;
    errors: string[];
    data: ProductImportData[];
}

export const parseProductExcelFile = (file: File): Promise<ProductImportData[]> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                // Convert to JSON, skipping the header row
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                // Remove header row and convert to ProductImportData
                const products: ProductImportData[] = [];

                for (let i = 1; i < jsonData.length; i++) {
                    const row = jsonData[i] as any[];
                    if (row && row.length >= 2) {
                        const name = String(row[0] || '').trim();
                        const description = String(row[1] || '').trim();

                        if (name) { // Only add if name is not empty
                            products.push({ name, description });
                        }
                    }
                }

                resolve(products);
            } catch (error) {
                reject(new Error('Failed to parse Excel file: ' + error));
            }
        };

        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };

        reader.readAsArrayBuffer(file);
    });
};

export const validateProductExcelData = (data: ProductImportData[]): ImportValidationResult => {
    const errors: string[] = [];
    const validData: ProductImportData[] = [];

    data.forEach((item, index) => {
        const rowNumber = index + 2; // +2 because we skip header and arrays are 0-indexed

        if (!item.name || item.name.trim() === '') {
            errors.push(`Row ${rowNumber}: Product name is required`);
            return;
        }

        if (item.name.length > 100) {
            errors.push(`Row ${rowNumber}: Product name must be less than 100 characters`);
            return;
        }

        if (item.description && item.description.length > 500) {
            errors.push(`Row ${rowNumber}: Description must be less than 500 characters`);
            return;
        }

        validData.push({
            name: item.name.trim(),
            description: item.description.trim()
        });
    });

    return {
        isValid: errors.length === 0,
        errors,
        data: validData
    };
};

export const generateProductExcelFile = (data: ProductExportData[], filename: string = 'products_export.xlsx') => {
    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();

    // Prepare data for export
    const exportData = [
        ['Name', 'Description', 'Price', 'Stock', 'Category'], // Header row
        ...data.map(item => [
            item.name,
            item.description,
            item.price,
            item.stock,
            item.categoryName
        ])
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(exportData);

    // Set column widths
    const columnWidths = [
        { wch: 30 }, // Name
        { wch: 50 }, // Description
        { wch: 15 }, // Price
        { wch: 15 }, // Stock
        { wch: 25 }  // Category
    ];
    worksheet['!cols'] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

    // Generate file and download
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, filename);
};

export const createProductImportTemplate = () => {
    const templateData = [
        ['Name', 'Description'],
        ['Test Product 1', 'This is a test product description'],
        ['Test Product 2', 'Another test product description'],
        ['Test Product 3', 'Third test product description']
    ];

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(templateData);

    // Set column widths
    worksheet['!cols'] = [
        { wch: 30 }, // Name
        { wch: 50 }  // Description
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products Template');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'products_import_template.xlsx');
}; 