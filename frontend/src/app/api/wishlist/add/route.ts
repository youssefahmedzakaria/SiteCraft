import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { productId, sku } = body;

        // Validate request body
        if (!productId || !sku) {
            return NextResponse.json(
                { error: 'Invalid request parameters' },
                { status: 400 }
            );
        }

        // Get cookies from the incoming request
        const cookies = request.headers.get('cookie') || '';

        // Forward request to backend
        const response = await fetch('http://localhost:8080/api/wishlist/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies,
            },
            credentials: 'include',
            body: JSON.stringify({
                productId,
                sku
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Backend wishlist error:', errorText);
            return NextResponse.json(
                { error: 'Failed to add product to wishlist' },
                { status: response.status }
            );
        }

        const wishlistProduct = await response.json();
        return NextResponse.json(wishlistProduct);

    } catch (error) {
        console.error('Error in wishlist add API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 