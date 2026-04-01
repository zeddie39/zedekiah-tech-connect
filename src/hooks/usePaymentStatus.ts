
import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PaymentStatusResult {
    status: "idle" | "polling" | "paid" | "failed" | "timeout" | "cancelled";
    resultCode?: number;
    resultDesc?: string;
    mpesaReceipt?: string;
    error?: string;
}

interface UsePaymentStatusOptions {
    checkoutRequestId: string | null;
    pollInterval?: number; // unused with realtime, kept for compat
    maxPollingTime?: number; // milliseconds
    onSuccess?: (receipt: string) => void;
    onFailure?: (error: string) => void;
}

/**
 * Custom hook to poll M-Pesa payment status via Supabase Realtime
 */
export function usePaymentStatus({
    checkoutRequestId,
    maxPollingTime = 120000, // 2 minutes
    onSuccess,
    onFailure,
}: UsePaymentStatusOptions): PaymentStatusResult & { startPolling: () => void; stopPolling: () => void } {
    const [status, setStatus] = useState<PaymentStatusResult["status"]>("idle");
    const [resultCode, setResultCode] = useState<number | undefined>();
    const [resultDesc, setResultDesc] = useState<string | undefined>();
    const [mpesaReceipt, setMpesaReceipt] = useState<string | undefined>();
    const [error, setError] = useState<string | undefined>();

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

    const stopPolling = useCallback(() => {
        if (channelRef.current) {
            supabase.removeChannel(channelRef.current);
            channelRef.current = null;
        }
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    const startPolling = useCallback(() => {
        if (!checkoutRequestId) return;

        // Reset state
        setStatus("polling");
        setError(undefined);
        setMpesaReceipt(undefined);

        // Clear previous subscription if exists
        stopPolling();

        console.log("Starting Realtime subscription for:", checkoutRequestId);

        // Subscribe to changes in the 'orders' table for this specific CheckoutRequestID
        const channel = supabase
            .channel(`payment-${checkoutRequestId}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'orders',
                    filter: `checkout_request_id=eq.${checkoutRequestId}`,
                },
                (payload) => {
                    console.log('Realtime update received:', payload);
                    const newStatus = payload.new.payment_status;
                    const receipt = payload.new.mpesa_receipt;

                    if (newStatus === 'paid') {
                        setStatus("paid");
                        setMpesaReceipt(receipt);
                        if (onSuccess) onSuccess(receipt);
                        stopPolling();
                    } else if (newStatus === 'failed') {
                        setStatus("failed");
                        setError("Payment failed");
                        if (onFailure) onFailure("Payment failed");
                        stopPolling();
                    }
                }
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log('Subscribed to payment updates');
                }
            });

        channelRef.current = channel;

        // Perform initial check in case payment already succeeded
        const checkInitialStatus = async () => {
            const { data, error } = await supabase
                .from('orders')
                .select('payment_status, mpesa_receipt')
                .eq('checkout_request_id', checkoutRequestId)
                .single();

            if (!error && data) {
                if (data.payment_status === 'paid') {
                    setStatus("paid");
                    setMpesaReceipt(data.mpesa_receipt);
                    if (onSuccess) onSuccess(data.mpesa_receipt);
                    stopPolling();
                } else if (data.payment_status === 'failed') {
                    setStatus("failed");
                    setError("Payment failed");
                    if (onFailure) onFailure("Payment failed");
                    stopPolling();
                }
            }
        };

        checkInitialStatus();

        // Set max timeout
        timeoutRef.current = setTimeout(() => {
            stopPolling();
            setStatus("timeout");
            setError("Payment verification timed out. Please check your orders.");
            if (onFailure) onFailure("Payment verification timed out");
        }, maxPollingTime);

    }, [checkoutRequestId, maxPollingTime, onSuccess, onFailure, stopPolling]);

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
