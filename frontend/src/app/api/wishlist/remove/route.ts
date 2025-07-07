import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const wishListProductId = searchParams.get('wishListProductId');

        // Validate request parameters
        if (!wishListProductId) {
            return NextResponse.json(
                { error: 'Missing wishListProductId parameter' },
                { status: 400 }
            );
        }

        // Get cookies from the incoming request
        const cookies = request.headers.get('cookie') || '';

        // Forward request to backend
        const response = await fetch(`http://localhost:8080/api/wishlist/remove/${wishListProductId}`, {
            method: 'DELETE',
            headers: {
                'Cookie': cookies,
            },
            credentials: 'include',
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Backend wishlist remove error:', errorText);
            return NextResponse.json(
                { error: 'Failed to remove product from wishlist' },
                { status: response.status }
            );
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error in wishlist remove API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 