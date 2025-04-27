"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface DropdownProps {
  dropdownName?: string;
  defaultValue?: string;
  dropdownOptions: string[];
}

export function Dropdown({
  dropdownName,
  defaultValue,
  dropdownOptions,
}: DropdownProps) {
  const [selected, setSelected] = useState<string>(
    defaultValue || dropdownOptions[0]
  );
  const [openCategories, setOpen] = useState(false);

  const toggleOption = (option: string) => {
    setSelected(option);
    setOpen(false); // close dropdown after selecting
  };

  return (
    <div className="relative inline-block sm:w-[250px] w-full">
      <Button
        variant="outline"
        size="lg"
        className="text-logo-txt hover:text-logo-txt-hover hover:bg-logo-light-button-hover border-logo-border w-full"
        onClick={() => setOpen(!openCategories)}
      >
        <div className="flex items-center w-full">
          <span>
            {dropdownName}
            {dropdownName ? ":" : ""} {selected}
          </span>
          <Image
            src="/icons/dropdown-colored.svg"
            alt="Dropdown Icon"
            width={20}
            height={20}
            className="ml-auto"
          />
        </div>
      </Button>

      {openCategories && (
        <div className="absolute mt-2 w-full bg-white border border-input rounded shadow">
          {dropdownOptions.map((option) => (
            <div
              key={option}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => toggleOption(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
