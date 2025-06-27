export function CategoryTableHeader() {
    return (
        <thead className="bg-logo-light-button">
            <tr>
                <th
                scope="col"
                className="px-3 md:px-6 py-3 text-left text-xs font-medium text-logo-txt uppercase tracking-wider"
                >
                Category
                </th>
                <th
                scope="col"
                className="px-3 md:px-6 py-3 text-left text-xs font-medium text-logo-txt uppercase tracking-wider"
                >
                Products
                </th>
                <th
                scope="col"
                className="px-3 md:px-6 py-3 text-left text-xs font-medium text-logo-txt uppercase tracking-wider hidden sm:table-cell"
                >
                Created At
                </th>
                <th
                scope="col"
                className="px-3 md:px-6 py-3 text-left text-xs font-medium text-logo-txt uppercase tracking-wider"
                >
                Status
                </th>
                <th
                scope="col"
                className="px-3 md:px-6 py-3 text-center text-xs font-medium text-logo-txt uppercase tracking-wider"
                >
                Actions
                </th>
            </tr>
        </thead>
    )
  }