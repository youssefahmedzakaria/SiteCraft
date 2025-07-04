  "use client";

import { Button } from "@/components/SiteCraft/ui/button";
import { AboutSection } from "@/lib/store-info";
import { DeleteConfirmationDialog } from "@/components/SiteCraft/ui/deleteConfirmationDialog";
import Link from "next/link";
import { useState } from "react";

interface AboutRecordProps {
  section: AboutSection;
  onDelete: (sectionId: number) => Promise<void>;
}

export function AboutRecord({ section, onDelete }: AboutRecordProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      console.log('🗑️ Deleting about us section:', section);
      
      await onDelete(section.id!);
      console.log('✅ About us section deleted successfully');
      
    } catch (error) {
      console.error('❌ Failed to delete about us section:', error);
      alert(`Failed to delete section: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <tr>
      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center w-1/12">
        <div className="text-sm font-medium text-gray-900">{section.id}</div>
      </td>

      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center w-3/12">
        <div className="text-sm text-gray-900">{section.title}</div>
      </td>

      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center hidden sm:table-cell w-2/12">
        <div className="text-sm text-gray-500">{section.type}</div>
      </td>

      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center hidden sm:table-cell w-2/12">
        <div className="text-sm text-gray-500 max-w-xs truncate">
          {section.content}
        </div>
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

      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center w-2/12">
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
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>

          <DeleteConfirmationDialog
            isOpen={showDeleteDialog}
            onClose={() => setShowDeleteDialog(false)}
            onConfirm={handleDelete}
            title="Delete About Us Section"
            description="Are you sure you want to delete this section? This action cannot be undone."
            itemName={section.title}
          />
        </div>
      </td>
    </tr>
  );
}
