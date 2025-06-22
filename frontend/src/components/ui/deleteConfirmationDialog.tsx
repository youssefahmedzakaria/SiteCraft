/* eslint-disable react/no-unescaped-entities */
import { Button } from "@/components/ui/button";
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalFooter } from "@/components/ui/modal";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  itemName?: string;
}

export function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
  itemName
}: DeleteConfirmationDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        <ModalTitle>{title}</ModalTitle>
        <ModalDescription>
          {description}
          {itemName && <span className="font-medium block mt-1">"{itemName}"</span>}
        </ModalDescription>
      </ModalHeader>
      <ModalFooter>
        <Button
          type="button"
          variant="destructive"
          onClick={onConfirm}
          className="bg-red-600 hover:bg-red-700"
        >
          Delete
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="border-logo-border text-logo-txt hover:text-logo-txt-hover"
        >
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
} 