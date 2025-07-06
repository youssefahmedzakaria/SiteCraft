import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { success: false, message: 'No file provided' },
                { status: 400 }
            );
        }

        // Convert File to FormData for backend
        const backendFormData = new FormData();
        backendFormData.append('file', file);

        // Get cookies for session
        const cookies = request.headers.get('cookie') || '';

        const response = await fetch(`http://localhost:8080/products/import`, {
            method: 'POST',
            body: backendFormData,
            headers: {
                'Cookie': cookies,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { success: false, message: data.message || 'Import failed' },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Product import error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
} 