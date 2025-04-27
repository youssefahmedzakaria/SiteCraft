export function StorePolicyTableHeader() {
  return (
    <thead className="bg-logo-light-button">
      <tr>
        <th
          scope="col"
          className="px-3 md:px-6 py-3 text-left text-xs font-medium text-logo-txt uppercase tracking-wider w-1/12"
        >
          ID
        </th>
        <th
          scope="col"
          className="px-3 md:px-6 py-3 text-left text-xs font-medium text-logo-txt uppercase tracking-wider w-3/12"
        >
          Title
        </th>
        <th
          scope="col"
          className="px-3 md:px-6 py-3 text-left text-xs font-medium text-logo-txt uppercase tracking-wider hidden sm:table-cell w-3/12"
        >
          Last Updated
        </th>
        <th
          scope="col"
          className="px-3 md:px-6 py-3 text-left text-xs font-medium text-logo-txt uppercase tracking-wider w-2/12"
        >
          Status
        </th>
        <th
          scope="col"
          className="px-3 md:px-6 py-3 text-center text-xs font-medium text-logo-txt uppercase tracking-wider w-3/12"
        >
          Actions
        </th>
      </tr>
    </thead>
  );
}