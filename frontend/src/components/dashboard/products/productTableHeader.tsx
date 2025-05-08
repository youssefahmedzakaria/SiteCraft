export function ProductTableHeader({
  selectAll,
  onSelectAll,
}: {
  selectAll?: boolean
  onSelectAll?: () => void
}) {
    return (
        <thead className="bg-logo-light-button">
            <tr>
            <th
                scope="col"
                className="px-3 md:px-6 py-3 text-left text-xs font-medium text-logo-txt uppercase tracking-wider"
                >
                </th>
                <th
                scope="col"
                className="px-3 md:px-6 py-3 text-left text-xs font-medium text-logo-txt uppercase tracking-wider"
                >
                ID
                </th>
                <th
                scope="col"
                className="px-3 md:px-6 py-3 text-left text-xs font-medium text-logo-txt uppercase tracking-wider"
                >
                Name
                </th>
                <th
                scope="col"
                className="px-3 md:px-6 py-3 text-left text-xs font-medium text-logo-txt uppercase tracking-wider hidden sm:table-cell"
                >
                Category
                </th>
                <th
                scope="col"
                className="px-3 md:px-6 py-3 text-left text-xs font-medium text-logo-txt uppercase tracking-wider hidden sm:table-cell"
                >
                Price
                </th>
                <th
                scope="col"
                className="px-3 md:px-6 py-3 text-left text-xs font-medium text-logo-txt uppercase tracking-wider hidden sm:table-cell"
                >
                Stock
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