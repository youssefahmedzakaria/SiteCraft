import { Button } from "@/components/ui/button";
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalFooter } from "@/components/ui/modal";

interface SuspendConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  customerName: string;
  customerEmail: string;
}

export function SuspendConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  customerName,
  customerEmail
}: SuspendConfirmationDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        <ModalTitle>Suspend Customer</ModalTitle>
        <ModalDescription>
          Are you sure you want to suspend this customer? They will no longer be able to place orders or access their account.
          <span className="font-medium block mt-2">{customerName}</span>
          <span className="text-sm text-gray-500">{customerEmail}</span>
        </ModalDescription>
      </ModalHeader>
      <ModalFooter>
        <Button
          type="button"
          variant="destructive"
          onClick={onConfirm}
          className="bg-red-600 hover:bg-red-700"
        >
          Suspend
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