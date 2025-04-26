import { Button } from "@/components/ui/button";
import React, { useState } from "react";

export default function AssignProducts() {
  const [products, setProducts] = useState<string[]>([]);

  const handleAddOption = (e: React.MouseEvent) => {
    e.preventDefault();
    setProducts((prev) => [...prev, ""]);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newProducts = [...products];
    newProducts[index] = value;
    setProducts(newProducts);
  };

  const handleDeleteOption = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();

    const newProducts = products.filter((_, i) => i !== index);
    setProducts(newProducts);
  };
  return (
    <div className="text-center">
      {products.length === 0 && (
        <div className="flex flex-col items-center justify-center space-y-4">
          <p className="text-gray-500">No products assigned yet.</p>
          <Button className="bg-logo-dark-button text-primary-foreground hover:bg-logo-dark-button-hover">
            + Assign Products
          </Button>
        </div>
      )}
    </div>
  );
}
