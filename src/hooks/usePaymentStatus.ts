import { useState, useEffect, useCallback, useRef } from "react";

interface PaymentStatusResult {
    status: "idle" | "polling" | "paid" | "failed" | "timeout" | "cancelled";
    resultCode?: number;
    resultDesc?: string;
    mpesaReceipt?: string;
    error?: string;
}

interface UsePaymentStatusOptions {
    checkoutRequestId: string | null;
    pollInterval?: number; // milliseconds
    maxPollingTime?: number; // milliseconds
    onSuccess?: (receipt: string) => void;
    onFailure?: (error: string) => void;
}

/**
 * Custom hook to poll M-Pesa payment status after STK push
 * Polls the backend every `pollInterval` ms until payment is confirmed or timeout
 */
export function usePaymentStatus({
    checkoutRequestId,
    pollInterval = 6000, // 6 seconds
    maxPollingTime = 120000, // 2 minutes
    onSuccess,
    onFailure,
}: UsePaymentStatusOptions): PaymentStatusResult & { startPolling: () => void; stopPolling: () => void } {
    const [status, setStatus] = useState<PaymentStatusResult["status"]>("idle");
    const [resultCode, setResultCode] = useState<number | undefined>();
    const [resultDesc, setResultDesc] = useState<string | undefined>();
    const [mpesaReceipt, setMpesaReceipt] = useState<string | undefined>();
    const [error, setError] = useState<string | undefined>();

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number | null>(null);

    const stopPolling = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    const checkStatus = useCallback(async () => {
        if (!checkoutRequestId) return;

        try {
            const response = await fetch(`http://localhost:5002/api/mpesa/status/${checkoutRequestId}`);
            const data = await response.json();

            // Safaricom returns ResultCode in the response
            // ResultCode 0 = Success
            // ResultCode 1032 = Request cancelled by user
            // ResultCode 1037 = Timeout (no response from user)

            if (data.ResultCode !== undefined) {
                setResultCode(data.ResultCode);
                setResultDesc(data.ResultDesc);

                if (data.ResultCode === 0) {
                    // Payment successful
                    setStatus("paid");
                    setMpesaReceipt(data.MpesaReceiptNumber || "");
                    stopPolling();
                    if (onSuccess) onSuccess(data.MpesaReceiptNumber || "");
                } else if (data.ResultCode === 1032 || data.ResultCode === 1) {
                    // User cancelled
                    setStatus("cancelled");
                    setError("Payment was cancelled");
                    stopPolling();
                    if (onFailure) onFailure("Payment was cancelled by user");
                } else if (data.ResultCode === 1037) {
                    // Timeout from user side
                    setStatus("timeout");
                    setError("Payment request timed out");
                    stopPolling();
                    if (onFailure) onFailure("Payment request timed out");
                } else if (data.ResultCode !== undefined && data.ResultCode !== 0) {
                    // Other failure
                    setStatus("failed");
                    setError(data.ResultDesc || "Payment failed");
                    stopPolling();
                    if (onFailure) onFailure(data.ResultDesc || "Payment failed");
                }
            }
            // If no ResultCode, payment is still pending - continue polling

        } catch (err) {
            // Network error - continue polling, don't stop yet
            console.error("Error checking payment status:", err);
        }
    }, [checkoutRequestId, stopPolling, onSuccess, onFailure]);

    const startPolling = useCallback(() => {
        if (!checkoutRequestId) return;

        setStatus("polling");
        setError(undefined);
        setMpesaReceipt(undefined);
        startTimeRef.current = Date.now();

        // Start polling
        intervalRef.current = setInterval(checkStatus, pollInterval);

        // Set max timeout
        timeoutRef.current = setTimeout(() => {
            stopPolling();
            setStatus("timeout");
            setError("Payment verification timed out. Please check your orders.");
            if (onFailure) onFailure("Payment verification timed out");
        }, maxPollingTime);

        // Do first check immediately
        checkStatus();
    }, [checkoutRequestId, pollInterval, maxPollingTime, checkStatus, stopPolling, onFailure]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopPolling();
        };
    }, [stopPolling]);

    return {
        status,
        resultCode,
        resultDesc,
        mpesaReceipt,
        error,
        startPolling,
        stopPolling,
    };
}
