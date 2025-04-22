import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LeftNavbar } from "@/components/left-navbar";
import Image from "next/image";
import { Input } from "@/components/ui/input";

export default function CategoriesPage() {
  return (
    <div className="flex min-h-screen">
      <LeftNavbar />

      {/* Main Content */}
      <main className="flex-1 p-6 ml-80 bg-gray-100">
        <h1 className="text-3xl font-bold">Categories</h1>
        {/* Header section */}
        <div className="flex justify-between items-center overflow-x-auto">
          <h2 className="text-xl font-semibold">
            Manage your product categories and organization
          </h2>
          <div className="space-x-2">
            <Link href="/dashboard/categories">
              <Button className="bg-logo-dark-button text-primary-foreground hover:bg-logo-dark-button-hover">
                <Image
                  src="/icons/plus.svg"
                  alt="Add Icon"
                  width={20}
                  height={20}
                />
                Add New Category
              </Button>
            </Link>
            <Button
              variant="outline"
              size="default"
              className="text-logo-txt hover:text-logo-txt-hover hover:bg-logo-light-button-hover border-logo-border"
            >
              <Image
                src="/icons/dropdown-colored.svg"
                alt="Dropdown Icon"
                width={20}
                height={20}
              />
              Import or Export Categories
            </Button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="flex justify-between items-stretch gap-4 mt-4">
          <div className="flex-1 p-6 border rounded-lg border-logo-border bg-white">
            <p className="text-lg font-semibold">Total Categories</p>
            <h3 className="text-xl font-bold">12</h3>
            <p className="text-lg font-semibold">+3 from last month</p>
          </div>
          <div className="flex-1 p-6 border rounded-lg border-logo-border bg-white">
            <p className="text-lg font-semibold">Most Popular</p>
            <h3 className="text-xl font-bold">Electronics</h3>
            <p className="text-lg font-semibold">64 products</p>
          </div>
          <div className="flex-1 p-6 border rounded-lg border-logo-border bg-white">
            <p className="text-lg font-semibold">Empty Categories</p>
            <h3 className="text-xl font-bold">2</h3>
            <p className="text-lg font-semibold">Action suggested</p>
          </div>
        </div>

        {/* Search and filters */}
        <div className="border-t border-logo-border mt-4">
          <div className="flex justify-between items-stretch gap-4 mt-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <img
                src="/icons/search-colored.svg"
                alt="Search"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none opacity-70"
              />
              <Input
                id="search"
                name="search"
                type="search"
                placeholder="Search categories..."
                autoComplete="search"
                className="h-10 pl-10 pr-4 bg-background border border-logo-border hover:border-logo-border/80 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200"
              />
            </div>
            <Button
              variant="outline"
              size="lg"
              className="text-logo-txt hover:text-logo-txt-hover hover:bg-logo-light-button-hover border-logo-border"
            >
              <Image
                src="/icons/dropdown-colored.svg"
                alt="Dropdown Icon"
                width={20}
                height={20}
              />
              Sort By: Newest
            </Button>
          </div>
          
          {/* Category listing table (sample) */}
          <div className="mt-6 border rounded-lg border-logo-border overflow-hidden">
            <table className="min-w-full divide-y divide-logo-border">
              <thead className="bg-logo-light-button">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-logo-txt uppercase tracking-wider"
                  >
                    Category Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-logo-txt uppercase tracking-wider"
                  >
                    Products
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-logo-txt uppercase tracking-wider"
                  >
                    Created Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-logo-txt uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-logo-txt uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-logo-border">
                {/* Sample category rows */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">
                        Electronics
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">64</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">2023-10-15</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
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
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">
                        Clothing
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">45</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">2023-09-22</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
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
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">
                        Home & Kitchen
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">32</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">2023-11-03</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
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
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">
                        Beauty
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">0</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">2023-12-01</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Empty
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
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
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
} 