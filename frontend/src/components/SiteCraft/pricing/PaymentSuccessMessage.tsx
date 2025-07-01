import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/SiteCraft/ui/button";

interface PaymentSuccessMessageProps {
  planName: string | undefined;
  transactionId?: string | number | undefined;
  onBack: () => void;
}

const PaymentSuccessMessage: React.FC<PaymentSuccessMessageProps> = ({ planName, transactionId, onBack }) => {
  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
      <div className="p-6 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Thank you for your subscription!</h2>
          <p className="text-gray-600">Your {planName} plan is now active.</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="text-sm text-gray-600 mb-1">Transaction ID</div>
          <div className="font-mono text-sm text-gray-900">
            {transactionId ? `#PMB${transactionId}` : `#PMB${Math.random().toString(36).substr(2, 9).toUpperCase()}`}
          </div>
        </div>
        <Button
          className="w-full bg-gradient-to-r from-[#00B4D8] to-[#0077B6] hover:from-[#0096C7] hover:to-[#005577] text-white"
          onClick={onBack}
        >
          Continue to Dashboard
        </Button>
        <p className="text-xs text-gray-500 mt-4">
          A confirmation email has been sent to your registered email address.
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccessMessage; 