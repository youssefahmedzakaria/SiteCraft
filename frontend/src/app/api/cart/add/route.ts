import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { productId, sku, quantity } = body;

        // Validate request body
        if (!productId || !sku || !quantity || quantity <= 0) {
            return NextResponse.json(
                { error: 'Invalid request parameters' },
                { status: 400 }
            );
        }

        // Forward request to backend
        const response = await fetch('http://localhost:8080/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                productId,
                sku,
                quantity
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Backend cart error:', errorText);
            return NextResponse.json(
                { error: 'Failed to add product to cart' },
                { status: response.status }
            );
        }

        const cartProduct = await response.json();
        return NextResponse.json(cartProduct);

    } catch (error) {
        console.error('Error in cart add API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 