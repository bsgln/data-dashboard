import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { WifiOff, RefreshCw, AlertTriangle } from "lucide-react";

interface ConnectionErrorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
  isRetrying?: boolean;
}

export function ConnectionErrorDialog({
  isOpen,
  onClose,
  onRetry,
  isRetrying = false,
}: ConnectionErrorDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <WifiOff className="w-5 h-5 text-red-600" />
            </div>
            <DialogTitle className="text-lg font-semibold text-[#1E293B]">
              Холболт тасарсан байна
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <p className="text-[#64748B] text-sm leading-relaxed">
                Интернет холболт тасарсан байна. Одоогийн мэдээлэл хадгалагдаж
                байгаа бөгөөд холболт сэргээгдэх үед шинэ мэдээлэл татагдана.
              </p>
              <p className="text-[#64748B] text-sm">
                Холболтоо шалгаад дахин оролдоно уу.
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Хаах
            </Button>
            <Button
              onClick={onRetry}
              disabled={isRetrying}
              className="flex-1 bg-[#0066FF] hover:bg-[#0052CC] text-white"
            >
              {isRetrying ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Холбогдож байна...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Дахин оролдох
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
