import { Button } from '@/components/ui/button'
import { Shipping } from '@/lib/shipping'

export function ShippingRecord({ shipping }: { shipping: Shipping }) {
    return (
    <tr>
        <td className="px-3 md:px-6 py-4 whitespace-nowrap w-1/12">
            <div className="flex items-center">
            <div className="text-sm font-medium text-gray-900">
                {shipping.id}
            </div>
            </div>
        </td>
        <td className="px-3 md:px-6 py-4 whitespace-nowrap w-3/12">
            <div className="text-sm text-gray-500">{shipping.governorate}</div>
        </td>
        <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden sm:table-cell w-2/12">
            <div className="text-sm text-gray-500">{shipping.price}</div>
        </td>
        <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden sm:table-cell w-3/12">
            <div className="text-sm text-gray-500">{shipping.estimatedDeliveryDays}</div>
        </td>
        <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center text-sm font-medium w-3/12">
            <Button
            variant="ghost"
            className="text-blue-600 hover:text-blue-900 mr-2"
            >
            Edit
            </Button>
            <Button
            variant="ghost"
            className="text-red-600 hover:text-red-900"
            >
            Delete
            </Button>
        </td>
    </tr>
    )
}