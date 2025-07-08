import { Button } from "@/components/SiteCraft/ui/button";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
} from "@/components/SiteCraft/ui/modal";
import { useTranslation } from "@/contexts/translation-context";

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
  customerEmail,
}: SuspendConfirmationDialogProps) {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        <ModalTitle>{t('common.suspendCustomer')}</ModalTitle>
        <ModalDescription>
          {t('common.suspendCustomerDescription')}
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
          {t('common.suspend')}
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
