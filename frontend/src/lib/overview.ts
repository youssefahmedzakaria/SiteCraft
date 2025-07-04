// frontend/src/lib/overview.ts

// Backend-compatible interfaces
export interface BackendOrder {
    id: number
    customer: {
        name: string
    }
    price: number
    status: string
}

export interface BackendProductSales {
    productName: string
    salesCount: number
}

export interface BackendDailySales {
    date: string
    totalSales: number
}

// Frontend interfaces (keeping the same as overviewData.ts for compatibility)
export interface Order {
    id: number
    customer: string
    total: number
    status: 'Delivered' | 'Cancelled' | 'Processing' | 'Shipped' | 'Pending'
}

export interface DailySale {
    date: string  // use MM-DD
    sales: number
}

export interface TopProduct {
    product: string
    sales: number
}

// API Functions
export const getTodayOrderCount = async (): Promise<number> => {
    try {
        console.log('📞 Fetching today\'s order count...');
        const response = await fetch('http://localhost:8080/api/overview/orders/count', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const count = await response.json();
        console.log('✅ Today\'s order count fetched successfully:', count);
        return count;
    } catch (error) {
        console.error('💥 Error fetching today\'s order count:', error);
        throw error;
    }
};

export const getTodaySalesTotal = async (): Promise<number> => {
    try {
        console.log('📞 Fetching today\'s sales total...');
        const response = await fetch('http://localhost:8080/api/overview/sales/total', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const total = await response.json();
        console.log('✅ Today\'s sales total fetched successfully:', total);
        return total;
    } catch (error) {
        console.error('💥 Error fetching today\'s sales total:', error);
        throw error;
    }
};

export const getTopProducts = async (limit: number = 5): Promise<TopProduct[]> => {
    try {
        console.log('📞 Fetching top products...');
        const response = await fetch(`http://localhost:8080/api/overview/products/top?limit=${limit}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // The backend returns: [{ product: { ... }, quantitySold: number }]
        const data = await response.json();
        console.log('✅ Top products fetched successfully:', data);
        
        // Transform backend data to frontend format
        return data.map((item: any) => ({
            product: item.product?.name ?? 'Unknown',
            sales: item.quantitySold ?? 0
        }));
    } catch (error) {
        console.error('💥 Error fetching top products:', error);
        throw error;
    }
};

export const getTodayOrders = async (): Promise<Order[]> => {
    try {
        console.log('📞 Fetching today\'s orders...');
        const response = await fetch('http://localhost:8080/api/overview/orders', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: BackendOrder[] = await response.json();
        console.log('✅ Today\'s orders fetched successfully:', data);
        
        // Transform backend data to frontend format
        return data.map(order => ({
            id: order.id,
            customer: order.customer.name,
            total: order.price,
            status: order.status as Order['status']
        }));
    } catch (error) {
        console.error('💥 Error fetching today\'s orders:', error);
        throw error;
    }
};

export const getLast7DaysSales = async (): Promise<DailySale[]> => {
    try {
        console.log('📞 Fetching last 7 days sales...');
        const response = await fetch('http://localhost:8080/api/overview/sales/daily', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: BackendDailySales[] = await response.json();
        console.log('✅ Last 7 days sales fetched successfully:', data);
        
        // Transform backend data to frontend format
        return data.map(item => ({
            date: item.date,
            sales: item.totalSales
        }));
    } catch (error) {
        console.error('💥 Error fetching last 7 days sales:', error);
        throw error;
    }
}; 