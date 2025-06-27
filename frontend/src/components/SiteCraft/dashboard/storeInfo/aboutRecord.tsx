"use client";

import { Button } from "@/components/SiteCraft/ui/button";
import { AboutSection } from "@/lib/store-info";
import { DeleteConfirmationDialog } from "@/components/SiteCraft/ui/deleteConfirmationDialog";
import Link from "next/link";
import { useState } from "react";

export function AboutRecord({ section }: { section: AboutSection }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    console.log(`Deleting section: ${section.title}`);
    setShowDeleteDialog(false);
  };

  return (
    <tr>
      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center w-1/12">
        <div className="text-sm font-medium text-gray-900">{section.id}</div>
      </td>

      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center w-3/12">
        <div className="text-sm text-gray-900">{section.title}</div>
      </td>

      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center hidden sm:table-cell w-3/12">
        <div className="text-sm text-gray-500">{section.type}</div>
      </td>

      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center w-2/12">
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            section.status === "Visible"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {section.status}
        </span>
      </td>

      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center w-3/12">
        <div className="flex items-center justify-center space-x-3">
          <Link href={`/dashboard/store-info/about-edit?id=${section.id}`}>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-900"
            >
              Edit
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-900"
            onClick={() => setShowDeleteDialog(true)}
          >
            Delete
          </Button>

          <DeleteConfirmationDialog
            isOpen={showDeleteDialog}
            onClose={() => setShowDeleteDialog(false)}
            onConfirm={handleDelete}
            title="Delete Product"
            description="Are you sure you want to delete this section?"
            itemName={section.title}
          />
        </div>
      </td>
    </tr>
  );
}
