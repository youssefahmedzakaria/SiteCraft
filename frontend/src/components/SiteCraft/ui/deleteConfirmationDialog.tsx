/* eslint-disable react/no-unescaped-entities */
import { Button } from "@/components/SiteCraft/ui/button";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
} from "@/components/SiteCraft/ui/modal";
import { useTranslation } from "@/contexts/translation-context";

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
  title,
  description,
  itemName,
}: DeleteConfirmationDialogProps) {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        <ModalTitle>{title || t('common.confirmDeletion')}</ModalTitle>
        <ModalDescription>
          {description || t('common.confirmDeletionDescription')}
          {itemName && (
            <span className="font-medium block mt-1">"{itemName}"</span>
          )}
        </ModalDescription>
      </ModalHeader>
      <ModalFooter>
        <Button
          type="button"
          variant="destructive"
          onClick={onConfirm}
          className="bg-red-600 hover:bg-red-700"
        >
          {t('common.delete')}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="border-logo-border text-logo-txt hover:text-logo-txt-hover"
        >
          {t('common.cancel')}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
