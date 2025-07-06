import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        // Get cookies for session
        const cookies = request.headers.get('cookie') || '';

        const response = await fetch(`http://localhost:8080/order/export`, {
            method: 'GET',
            headers: {
                'Cookie': cookies,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { success: false, message: errorData.message || 'Export failed' },
                { status: response.status }
            );
        }

        // Get the Excel file as blob
        const excelBlob = await response.blob();

        // Create response with the Excel file
        const excelResponse = new NextResponse(excelBlob, {
            status: 200,
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': 'attachment; filename="orders_export.xlsx"',
            },
        });

        return excelResponse;
    } catch (error) {
        console.error('Order export error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
} 