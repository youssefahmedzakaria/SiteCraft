import { Button } from '@/components/ui/button'
import { Category } from '@/lib/categories'

export function CategoryRecord({ category }: { category: Category }) {
    return (
    <tr>
        <td className="px-3 md:px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
            <div className="text-sm font-medium text-gray-900">
                {category.title}
            </div>
            </div>
        </td>
        <td className="px-3 md:px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-500">{category.numOfProducts}</div>
        </td>
        <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
            <div className="text-sm text-gray-500">{category.numOfProducts}</div>
        </td>
        <td className="px-3 md:px-6 py-4 whitespace-nowrap">
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${category.status === 'Active' ? 'bg-green-100 text-green-800' :"bg-yellow-100 text-yellow-800" }`}>
            {category.status}
            </span>
        </td>
        <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
            <Button
            variant="ghost"
            className="text-blue-600 hover:text-blue-900"
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