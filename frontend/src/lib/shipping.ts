export interface Shipping {
    id: string
    governorate: string
    price: string
    estimatedDeliveryDays: string
}

export const shippings: Shipping[] = [
    {
        id: '1',
        governorate: 'Cairo',
        price: "50",
        estimatedDeliveryDays: '1-2 Days',
    },
    {
        id: '2',
        governorate: 'Alexandria',
        price: "100",
        estimatedDeliveryDays: '3-4 Days',
    },
    {
        id: '3',
        governorate: 'Aswan',
        price: "150",
        estimatedDeliveryDays: '5-6 Days',
    },
]