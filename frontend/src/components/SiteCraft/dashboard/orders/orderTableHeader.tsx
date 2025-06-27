export function OrderTableHeader() {
  return (
    <thead className="bg-logo-light-button">
      <tr>
        <th
          scope="col"
          className="px-3 md:px-6 py-3 text-left text-xs font-medium text-logo-txt uppercase tracking-wider"
        >
          Order ID
        </th>
        <th
          scope="col"
          className="px-3 md:px-6 py-3 text-left text-xs font-medium text-logo-txt uppercase tracking-wider"
        >
          Customer
        </th>
        <th
          scope="col"
          className="px-3 md:px-6 py-3 text-left text-xs font-medium text-logo-txt uppercase tracking-wider"
        >
          Issue Date
        </th>
        <th
          scope="col"
          className="px-3 md:px-6 py-3 text-left text-xs font-medium text-logo-txt uppercase tracking-wider"
        >
          Total Value
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
  );
}
