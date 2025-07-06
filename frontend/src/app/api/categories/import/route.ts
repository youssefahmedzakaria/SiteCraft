import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        console.log('API route: Processing import request');
        const formData = await request.formData();
        const file = formData.get('file');

        console.log('API route: File received:', file ? 'Yes' : 'No', file instanceof Blob ? 'Is Blob' : 'Not Blob');

        if (!file || !(file instanceof Blob)) {
            console.log('API route: No valid file provided');
            return NextResponse.json(
                { success: false, message: 'No file provided' },
                { status: 400 }
            );
        }

        // Forward the request to the backend
        const backendFormData = new FormData();
        const fileName = (file as File).name || 'import.xlsx';
        backendFormData.append('file', file, fileName);

        console.log('API route: Forwarding to backend with file:', fileName);
        const backendUrl = `http://localhost:8080/categories/import`;
        console.log('API route: Backend URL:', backendUrl);

        const response = await fetch(backendUrl, {
            method: 'POST',
            body: backendFormData,
            credentials: 'include',
            headers: {
                'Cookie': request.headers.get('cookie') || '',
            },
        });

        console.log('API route: Backend response status:', response.status);
        const data = await response.json();
        console.log('API route: Backend response data:', data);

        if (!response.ok) {
            return NextResponse.json(
                { success: false, message: data.message || 'Import failed' },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('API route: Import error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
} 