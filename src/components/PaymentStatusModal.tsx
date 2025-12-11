import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle, Clock, Phone } from "lucide-react";
import { usePaymentStatus } from "@/hooks/usePaymentStatus";

interface PaymentStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    checkoutRequestId: string | null;
    amount: number;
    onSuccess?: (receipt: string) => void;
    onFailure?: (error: string) => void;
}

export default function PaymentStatusModal({
    isOpen,
    onClose,
    checkoutRequestId,
    amount,
    onSuccess,
    onFailure,
}: PaymentStatusModalProps) {
    const { status, mpesaReceipt, error, startPolling, stopPolling } = usePaymentStatus({
        checkoutRequestId,
        onSuccess: (receipt) => {
            if (onSuccess) onSuccess(receipt);
        },
        onFailure: (err) => {
            if (onFailure) onFailure(err);
        },
    });

    // Start polling when modal opens with a valid checkoutRequestId
    useEffect(() => {
        if (isOpen && checkoutRequestId) {
            startPolling();
        }
        return () => {
            stopPolling();
        };
    }, [isOpen, checkoutRequestId, startPolling, stopPolling]);

    const handleClose = () => {
        stopPolling();
        onClose();
    };

    const getStatusContent = () => {
        switch (status) {
            case "polling":
                return (
                    <div className="flex flex-col items-center gap-4 py-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
                            <Phone className="w-16 h-16 text-green-600 relative z-10" />
                        </div>
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        <div className="text-center">
                            <p className="font-semibold text-lg">Check Your Phone</p>
                            <p className="text-muted-foreground">
                                Enter your M-Pesa PIN to complete the payment of{" "}
                                <span className="font-bold text-primary">Ksh {amount.toLocaleString()}</span>
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>Waiting for confirmation...</span>
                        </div>
                    </div>
                );

            case "paid":
                return (
                    <div className="flex flex-col items-center gap-4 py-6">
                        <div className="bg-green-100 rounded-full p-4">
                            <CheckCircle2 className="w-16 h-16 text-green-600" />
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-xl text-green-600">Payment Successful!</p>
                            <p className="text-muted-foreground mt-2">
                                Amount: <span className="font-bold">Ksh {amount.toLocaleString()}</span>
                            </p>
                            {mpesaReceipt && (
                                <div className="mt-4 p-3 bg-muted rounded-lg">
                                    <p className="text-sm text-muted-foreground">M-Pesa Receipt</p>
                                    <p className="font-mono font-bold text-lg">{mpesaReceipt}</p>
                                </div>
                            )}
                        </div>
                        <Button onClick={handleClose} className="mt-4 bg-green-600 hover:bg-green-700">
                            Continue
                        </Button>
                    </div>
                );

            case "failed":
            case "cancelled":
            case "timeout":
                return (
                    <div className="flex flex-col items-center gap-4 py-6">
                        <div className="bg-red-100 rounded-full p-4">
                            <XCircle className="w-16 h-16 text-red-600" />
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-xl text-red-600">
                                {status === "cancelled" ? "Payment Cancelled" :
                                    status === "timeout" ? "Payment Timed Out" : "Payment Failed"}
                            </p>
                            <p className="text-muted-foreground mt-2">{error}</p>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <Button variant="outline" onClick={handleClose}>
                                Close
                            </Button>
                            <Button onClick={() => startPolling()}>
                                Try Again
                            </Button>
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="flex flex-col items-center gap-4 py-6">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        <p className="text-muted-foreground">Initializing payment...</p>
                    </div>
                );
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center">M-Pesa Payment</DialogTitle>
                    <DialogDescription className="text-center">
                        {status === "polling" && "Complete the payment on your phone"}
                    </DialogDescription>
                </DialogHeader>
                {getStatusContent()}
            </DialogContent>
        </Dialog>
    );
}
