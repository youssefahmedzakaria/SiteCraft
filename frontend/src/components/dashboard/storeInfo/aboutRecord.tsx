import { Button } from '@/components/ui/button'
import { AboutSection } from '@/lib/store-info'

export function AboutRecord({ section }: { section: AboutSection }) {
  return (
    <tr>
      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center w-1/12">
        <div className="text-sm font-medium text-gray-900">{section.id}</div>
      </td>

      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center w-3/12">
        <div className="text-sm text-gray-900">{section.title}</div>
      </td>

      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center hidden sm:table-cell w-3/12">
        <div className="text-sm text-gray-500">{section.type}</div>
      </td>

      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center w-2/12">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${section.status === 'Visible' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
          {section.status}
        </span>
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