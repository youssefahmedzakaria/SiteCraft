import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export interface CategoryImportData {
    name: string;
    description: string;
}

export interface CategoryExportData {
    name: string;
    description: string;
    productCount: number;
    createdAt: string;
}

export interface ImportValidationResult {
    isValid: boolean;
    errors: string[];
    data: CategoryImportData[];
}

export const parseExcelFile = (file: File): Promise<CategoryImportData[]> => {
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

                // Remove header row and convert to CategoryImportData
                const categories: CategoryImportData[] = [];

                for (let i = 1; i < jsonData.length; i++) {
                    const row = jsonData[i] as any[];
                    if (row && row.length >= 2) {
                        const name = String(row[0] || '').trim();
                        const description = String(row[1] || '').trim();

                        if (name) { // Only add if name is not empty
                            categories.push({ name, description });
                        }
                    }
                }

                resolve(categories);
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

export const validateExcelData = (data: CategoryImportData[]): ImportValidationResult => {
    const errors: string[] = [];
    const validData: CategoryImportData[] = [];

    data.forEach((item, index) => {
        const rowNumber = index + 2; // +2 because we skip header and arrays are 0-indexed

        if (!item.name || item.name.trim() === '') {
            errors.push(`Row ${rowNumber}: Category name is required`);
            return;
        }

        if (item.name.length > 100) {
            errors.push(`Row ${rowNumber}: Category name must be less than 100 characters`);
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

export const generateExcelFile = (data: CategoryExportData[], filename: string = 'categories_export.xlsx') => {
    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();

    // Prepare data for export
    const exportData = [
        ['Name', 'Description', 'Number of Products', 'Created Date'], // Header row
        ...data.map(item => [
            item.name,
            item.description,
            item.productCount,
            item.createdAt
        ])
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(exportData);

    // Set column widths
    const columnWidths = [
        { wch: 30 }, // Name
        { wch: 50 }, // Description
        { wch: 20 }, // Number of Products
        { wch: 25 }  // Created Date
    ];
    worksheet['!cols'] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Categories');

    // Generate file and download
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, filename);
};

export const createImportTemplate = () => {
    const templateData = [
        ['Name', 'Description'],
        ['Home & Kitchen', 'Products for home and kitchen use'],
        ['Electronics', 'Electronic devices and accessories'],
        ['Clothing', 'Fashion and apparel items']
    ];

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(templateData);

    // Set column widths
    worksheet['!cols'] = [
        { wch: 30 }, // Name
        { wch: 50 }  // Description
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Categories Template');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'categories_import_template.xlsx');
}; 