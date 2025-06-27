export function shippingTableHeader() {
    return (
        <thead className="bg-logo-light-button">
            <tr>
                <th
                    scope="col"
                    className="px-3 md:px-6 py-3 text-center text-xs font-medium text-logo-txt uppercase tracking-wider w-1/12"
                >
                    ID
                </th>
                <th
                    scope="col"
                    className="px-3 md:px-6 py-3 text-center text-xs font-medium text-logo-txt uppercase tracking-wider w-3/12"
                >
                    Governorate Name
                </th>
                <th
                    scope="col"
                    className="px-3 md:px-6 py-3 text-center text-xs font-medium text-logo-txt uppercase tracking-wider hidden sm:table-cell w-2/12"
                >
                    Price
                </th>
                <th
                    scope="col"
                    className="px-3 md:px-6 py-3 text-center text-xs font-medium text-logo-txt uppercase tracking-wider hidden sm:table-cell w-3/12"
                >
                    Estimated Delivery Days
                </th>
                <th
                    scope="col"
                    className="px-3 md:px-6 py-3 text-center text-xs font-medium text-logo-txt uppercase tracking-wider w-3/12"
                >
                    Actions
                </th>
            </tr>
        </thead>
    )
}