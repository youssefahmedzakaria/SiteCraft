import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/SiteCraft/ui/dialog';
import { Button } from '@/components/SiteCraft/ui/button';
import { Progress } from '@/components/SiteCraft/ui/progress';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

interface ImportProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  isImporting: boolean;
  progress: number;
  result?: {
    successCount: number;
    errorCount: number;
    errors: string[];
    totalProcessed: number;
  };
}

export const ImportProgressModal: React.FC<ImportProgressModalProps> = ({
  isOpen,
  onClose,
  isImporting,
  progress,
  result
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isImporting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Importing Categories...
              </>
            ) : (
              <>
                {result && result.errorCount === 0 ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                )}
                Import Complete
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {isImporting && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Processing categories...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {result && (
            <div className="space-y-4">
              {/* Summary */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{result.successCount}</div>
                  <div className="text-sm text-gray-600">Successfully Imported</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{result.errorCount}</div>
                  <div className="text-sm text-gray-600">Errors</div>
                </div>
              </div>

              {/* Errors */}
              {result.errors.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Errors:</h4>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {result.errors.map((error, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm text-red-600">
                        <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{error}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Success message */}
              {result.successCount > 0 && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>
                    Successfully imported {result.successCount} out of {result.totalProcessed} categories.
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isImporting}
            >
              {isImporting ? 'Please wait...' : 'Close'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 