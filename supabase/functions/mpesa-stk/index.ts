
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders })
    }

    try {
        const { amount, phone, accountReference, transactionDesc } = await req.json()

        // Environment variables
        const consumerKey = Deno.env.get('MPESA_CONSUMER_KEY')!
        const consumerSecret = Deno.env.get('MPESA_CONSUMER_SECRET')!
        const shortcode = Deno.env.get('MPESA_SHORTCODE')!
        const passkey = Deno.env.get('MPESA_PASSKEY')!
        // Construct callback URL pointing to the sibling function
        // Or use the one provided in env, default to a placeholder if not set
        const defaultCallback = req.url.replace('mpesa-stk', 'mpesa-callback')
        const callbackUrl = Deno.env.get('MPESA_CALLBACK_URL') || defaultCallback

        const isSandbox = Deno.env.get('MPESA_ENV') !== 'production'
        const baseUrl = isSandbox
            ? 'https://sandbox.safaricom.co.ke'
            : 'https://api.safaricom.co.ke'

        if (!amount || !phone) {
            throw new Error('Missing amount or phone number')
        }

        // 1. Generate Access Token
        const auth = btoa(`${consumerKey}:${consumerSecret}`)
        const tokenResp = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${auth}`
            }
        })
        const tokenData = await tokenResp.json()
        const accessToken = tokenData.access_token

        if (!accessToken) {
            throw new Error('Failed to generate M-Pesa access token')
        }

        // 2. Generate Password
        const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)
        const password = btoa(shortcode + passkey + timestamp)

        // 3. Initiate STK Push
        const payload = {
            BusinessShortCode: shortcode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: Math.round(Number(amount)),
            PartyA: phone,
            PartyB: shortcode,
            PhoneNumber: phone,
            CallBackURL: callbackUrl,
            AccountReference: accountReference || 'ZTech',
            TransactionDesc: transactionDesc || 'Payment',
        }

        console.log(`Initiating STK Push to ${phone} for ${amount}`)

        const stkResp = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })

        const stkData = await stkResp.json()
        console.log('STK Response:', stkData)

        return new Response(JSON.stringify(stkData), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error: unknown) {
        console.error('STK Push Error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return new Response(JSON.stringify({ error: message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
