
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders })
    }

    try {
        const rawBody = await req.json()
        console.log('Callback received:', JSON.stringify(rawBody))

        const result = rawBody.Body?.stkCallback
        if (!result) {
            throw new Error('Invalid callback format')
        }

        const { CheckoutRequestID, ResultCode, ResultDesc } = result
        const metadata = result.CallbackMetadata?.Item || []

        // Safely find metadata values
        const mpesaReceipt = metadata.find((i: any) => i.Name === 'MpesaReceiptNumber')?.Value
        const phone = metadata.find((i: any) => i.Name === 'PhoneNumber')?.Value
        const amount = metadata.find((i: any) => i.Name === 'Amount')?.Value

        // Initialize Supabase Client (Admin context)
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        const supabase = createClient(supabaseUrl, supabaseKey)

        let updateData: any = {}

        if (ResultCode === 0) {
            // Success
            updateData = {
                payment_status: 'paid',
                mpesa_receipt: mpesaReceipt,
                status: 'confirmed', // Auto-confirm order on payment
                updated_at: new Date().toISOString()
            }
        } else {
            // Failure or Cancellation
            updateData = {
                payment_status: 'failed',
                status: 'payment_failed',
                updated_at: new Date().toISOString()
            }
        }

        console.log(`Updating order ${CheckoutRequestID} with status ${updateData.payment_status}`)

        // Update the order by CheckoutRequestID (stored when STK push was initiated)
        const { data, error } = await supabase
            .from('orders')
            .update(updateData)
            .eq('checkout_request_id', CheckoutRequestID)
            .select()

        if (error) {
            console.error('Supabase Update Error:', error)
            throw error
        }

        return new Response(JSON.stringify({ status: 'success' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error) {
        console.error('Callback Error:', error)
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
