import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const backendUrl = `http://localhost:8080/categories/export`;
        const response = await fetch(backendUrl, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Cookie': request.headers.get('cookie') || '',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            return new NextResponse(errorText, { status: response.status });
        }

        const buffer = await response.arrayBuffer();
        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': 'attachment; filename="categories_export.xlsx"',
            },
        });
    } catch (error) {
        console.error('Export error:', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
} 