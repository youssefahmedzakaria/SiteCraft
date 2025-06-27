export function ProductTableHeader({
  selectAll = false,
  onSelectAll,
  selectedProducts = []
}: {
  selectAll?: boolean;
  onSelectAll?: () => void;
  selectedProducts?: number[];
}) {
    return (
        <thead className="bg-logo-light-button">
            <tr>
            <th
                scope="col"
                className="px-3 md:px-6 py-3 text-left text-xs font-medium text-logo-txt uppercase tracking-wider"
                >
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-blue-600"
                  checked={selectAll}
                  onChange={onSelectAll}
                />
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