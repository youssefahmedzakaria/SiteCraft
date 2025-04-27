import { Button } from '@/components/ui/button'
import { Shipping } from '@/lib/shipping'

export function ShippingRecord({ shipping }: { shipping: Shipping }) {
    return (
        <tr>
            <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center w-1/12">
                <div className="text-sm font-medium text-gray-900">{shipping.id}</div>
            </td>

            <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center w-3/12">
                <div className="text-sm text-gray-900">{shipping.governorate}</div>
            </td>

            <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center hidden sm:table-cell w-2/12">
                <div className="text-sm text-gray-500">EGP {shipping.price}</div>
            </td>

            <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center hidden sm:table-cell w-3/12">
                <div className="text-sm text-gray-500">{shipping.estimatedDeliveryDays}</div>
            </td>

            <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center w-3/12">
                <div className="flex items-center justify-center space-x-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-900"
                    >
                        Edit
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-900"
                    >
                        Delete
                    </Button>
                </div>
            </td>
        </tr>
    );
}