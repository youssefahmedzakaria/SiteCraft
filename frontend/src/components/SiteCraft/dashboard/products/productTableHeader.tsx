import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@/components/SiteCraft/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function ProductTableHeader({
  selectAll = false,
  onSelectAll,
  selectedProducts = [],
  categories = [],
  filteredProducts = [],
  setSelectedProducts,
  selectedCategories = [],
  setSelectedCategories,
}: {
  selectAll?: boolean;
  onSelectAll?: () => void;
  selectedProducts?: number[];
  categories?: any[];
  filteredProducts?: any[];
  setSelectedProducts?: (ids: number[]) => void;
  selectedCategories?: string[];
  setSelectedCategories?: (cats: string[]) => void;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const allSelected = selectedProducts.length === filteredProducts.length && filteredProducts.length > 0;
  const someSelected = selectedProducts.length > 0 && !allSelected;

  const handleSelectAll = () => {
    setSelectedProducts && setSelectedProducts(filteredProducts.map((p: any) => p.id));
    setSelectedCategories && setSelectedCategories(categories.map((c: any) => c.name));
  };
  const handleSelectNone = () => {
    setSelectedProducts && setSelectedProducts([]);
    setSelectedCategories && setSelectedCategories([]);
  };
  const handleCategoryToggle = (categoryName: string) => {
    const categoryProducts = filteredProducts.filter(
      (p: any) => p.categories && p.categories.some((cat: any) => cat.name === categoryName)
    );
    const allInCategorySelected = categoryProducts.every((p: any) =>
      selectedProducts.includes(p.id)
    );
    let newSelectedProducts = [...selectedProducts];
    let newSelectedCategories = [...selectedCategories];

    if (allInCategorySelected) {
      // Deselect all in this category
      newSelectedProducts = newSelectedProducts.filter(
        (id) => !categoryProducts.some((p: any) => p.id === id)
      );
      newSelectedCategories = newSelectedCategories.filter((c) => c !== categoryName);
    } else {
      // Select all in this category
      categoryProducts.forEach((p: any) => {
        if (!newSelectedProducts.includes(p.id)) {
          newSelectedProducts.push(p.id);
        }
      });
      if (!newSelectedCategories.includes(categoryName)) {
        newSelectedCategories.push(categoryName);
      }
    }
    setSelectedProducts && setSelectedProducts(newSelectedProducts);
    setSelectedCategories && setSelectedCategories(newSelectedCategories);
  };

  return (
    <thead className="bg-logo-light-button">
      <tr>
        <th
          scope="col"
          className="px-3 md:px-6 py-3 text-left text-xs font-medium text-logo-txt uppercase tracking-wider"
        >
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <button
                className={`border rounded px-2 py-1 flex items-center gap-2 ${allSelected ? "bg-green-100 border-green-400" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={el => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  readOnly
                />
                <ChevronDown size={16} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleSelectAll}>
                Select All ({filteredProducts.length})
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSelectNone}>
                Select None
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Select by Category</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {categories.map((category) => (
                      <DropdownMenuItem
                        key={category.id}
                        onClick={() => handleCategoryToggle(category.name)}
                        className={`flex items-center justify-between ${
                          selectedCategories.includes(category.name) ? "bg-green-100" : ""
                        }`}
                      >
                        <span>{category.name}</span>
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.name)}
                          readOnly
                        />
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
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
          Price (Discounted Price)
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
  );
}