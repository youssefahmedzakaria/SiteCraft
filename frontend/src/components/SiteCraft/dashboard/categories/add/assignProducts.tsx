import { Button } from "@/components/SiteCraft/ui/button";
import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalFooter,
} from "@/components/SiteCraft/ui/modal";
import { SimplifiedProduct, getProducts } from "@/lib/products";
import { useProductManagement } from "@/hooks/useProductManagement";

interface AssignProductsProps {
  assignedProducts: SimplifiedProduct[];
  setAssignedProducts: (products: SimplifiedProduct[]) => void;
}

export default function AssignProducts({ assignedProducts, setAssignedProducts }: AssignProductsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<SimplifiedProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<SimplifiedProduct[]>([]);
  const [isClient, setIsClient] = useState(false);

  const { products, isLoading } = useProductManagement();

  // Handle client-side rendering to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts(products);
    } else {
      const lowercaseQuery = searchQuery.toLowerCase();
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(lowercaseQuery) ||
          (product.category?.title || '').toLowerCase().includes(lowercaseQuery) ||
          product.id.toString().includes(lowercaseQuery)
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const openModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedProducts([...assignedProducts]);
    setSearchQuery("");
    setFilteredProducts(products);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const applySelection = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAssignedProducts([...selectedProducts]);
    setIsModalOpen(false);
  };

  const toggleProductSelection = (product: SimplifiedProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (selectedProducts.some((p) => p.id === product.id)) {
      setSelectedProducts(selectedProducts.filter((p) => p.id !== product.id));
    } else {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const isSelected = (product: SimplifiedProduct) => {
    return selectedProducts.some((p) => p.id === product.id);
  };

  const handleRemoveProduct = (productId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAssignedProducts(assignedProducts.filter((p) => p.id !== productId));
  };

  const handleCheckboxChange = (
    product: SimplifiedProduct,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    e.stopPropagation();
    toggleProductSelection(product, e as unknown as React.MouseEvent);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Don't render until client-side rendering is complete
  if (!isClient) {
    return (
      <div className="text-center w-full">
        <div className="flex flex-col items-center justify-center space-y-4">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center w-full">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center space-y-4">
          <p className="text-gray-500">Loading products...</p>
        </div>
      ) : assignedProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-4">
          <p className="text-gray-500">No products assigned yet.</p>
          <Button
            className="bg-logo-dark-button text-primary-foreground hover:bg-logo-dark-button-hover"
            onClick={openModal}
          >
            + Assign Products
          </Button>
        </div>
      ) : (
        <div className="mt-4">
          <div className="flex flex-row flex-wrap justify-between items-center mb-4 gap-3">
            <h3 className="text-lg font-medium">Assigned Products</h3>
            <Button
              className="bg-logo-dark-button text-primary-foreground hover:bg-logo-dark-button-hover"
              onClick={openModal}
            >
              + Assign More Products
            </Button>
          </div>
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-logo-light-button">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-logo-txt uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-logo-txt uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-logo-txt uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-logo-txt uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-logo-txt uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assignedProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-4 py-3 text-sm text-gray-900 truncate text-left">
                      {product.id}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 truncate text-left">
                      {product.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 truncate text-left">
                      {product.category?.title || 'Uncategorized'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 truncate text-left">
                      {product.stock}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-center">
                      <button
                        onClick={(e) => handleRemoveProduct(product.id, e)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal} maxWidth="4xl">
          <div className="w-full mx-auto px-2 sm:px-4">
            <ModalHeader>
              <ModalTitle>Assign Products</ModalTitle>
              <div className="mt-4 relative w-full">
                <input
                  type="text"
                  placeholder="Search products by name, category or ID..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pl-9"
                />
                <svg
                  className="absolute left-2 top-2.5 h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </ModalHeader>
            <div className="my-4 max-h-[calc(100vh-250px)] sm:max-h-96 overflow-y-auto">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 table-fixed">
                  <thead className="bg-logo-light-button sticky top-0">
                    <tr>
                      <th className="w-12 px-2 sm:px-4 py-3 text-left text-xs font-medium text-logo-txt uppercase tracking-wider">
                        <span className="sr-only sm:not-sr-only">Select</span>
                      </th>
                      <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-logo-txt uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-logo-txt uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-logo-txt uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-logo-txt uppercase tracking-wider">
                        Stock
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <tr
                          key={product.id}
                          className={
                            isSelected(product)
                              ? "bg-blue-50"
                              : "hover:bg-gray-50"
                          }
                          onClick={(e) => toggleProductSelection(product, e)}
                          style={{ cursor: "pointer" }}
                        >
                          <td className="px-2 sm:px-4 py-3">
                            <input
                              type="checkbox"
                              checked={isSelected(product)}
                              onChange={(e) => handleCheckboxChange(product, e)}
                              onClick={(e) => e.stopPropagation()}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                          </td>
                          <td className="px-2 sm:px-4 py-3 text-sm text-gray-900 truncate">
                            {product.id}
                          </td>
                          <td className="px-2 sm:px-4 py-3 text-sm text-gray-900 truncate">
                            {product.name}
                          </td>
                          <td className="px-2 sm:px-4 py-3 text-sm text-gray-900 truncate">
                            {product.category?.title || 'Uncategorized'}
                          </td>
                          <td className="px-2 sm:px-4 py-3 text-sm text-gray-900 truncate">
                            {product.stock}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-8 text-center text-gray-500"
                        >
                          No products match your search criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {selectedProducts.length} product
              {selectedProducts.length !== 1 ? "s" : ""} selected
            </div>
            <ModalFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Button
                className="bg-logo-dark-button text-primary-foreground hover:bg-logo-dark-button-hover w-full sm:w-auto"
                onClick={applySelection}
              >
                Apply
              </Button>
              <Button
                variant="outline"
                onClick={closeModal}
                className="border-logo-border text-logo-txt hover:text-logo-txt-hover w-full sm:w-auto"
              >
                Cancel
              </Button>
            </ModalFooter>
          </div>
        </Modal>
      )}
    </div>
  );
}
