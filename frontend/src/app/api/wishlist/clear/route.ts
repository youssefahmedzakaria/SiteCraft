import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
    try {
        // Get cookies from the incoming request
        const cookies = request.headers.get('cookie') || '';

        // Forward request to backend
        const response = await fetch('http://localhost:8080/api/wishlist/clear', {
            method: 'DELETE',
            headers: {
                'Cookie': cookies,
            },
            credentials: 'include',
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Backend wishlist clear error:', errorText);
            return NextResponse.json(
                { error: 'Failed to clear wishlist' },
                { status: response.status }
            );
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error in wishlist clear API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 