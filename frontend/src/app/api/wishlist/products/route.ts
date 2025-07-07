import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        // Get cookies from the incoming request
        const cookies = request.headers.get('cookie') || '';

        // Forward request to backend
        const response = await fetch('http://localhost:8080/api/wishlist/products', {
            method: 'GET',
            headers: {
                'Cookie': cookies,
            },
            credentials: 'include',
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Backend wishlist products error:', errorText);
            return NextResponse.json(
                { error: 'Failed to fetch wishlist products' },
                { status: response.status }
            );
        }

        const wishlistProducts = await response.json();
        return NextResponse.json(wishlistProducts);

    } catch (error) {
        console.error('Error in wishlist products API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 