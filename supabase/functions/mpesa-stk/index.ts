
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders })
    }

    try {
        // Verify JWT authentication
        const authHeader = req.headers.get('Authorization')
        if (!authHeader?.startsWith('Bearer ')) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 401,
            })
        }

        const supabase = createClient(
            Deno.env.get('SUPABASE_URL')!,
            Deno.env.get('SUPABASE_ANON_KEY')!,
            { global: { headers: { Authorization: authHeader } } }
        )

        // Verify the user is authenticated
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
            console.error('Auth verification failed:', userError?.message || 'No user found')
            return new Response(JSON.stringify({ error: 'Unauthorized', details: userError?.message }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 401,
            })
        }

        const { amount, phone, accountReference, transactionDesc } = await req.json()

        // Environment variables
        const consumerKey = Deno.env.get('MPESA_CONSUMER_KEY')!
        const consumerSecret = Deno.env.get('MPESA_CONSUMER_SECRET')!
        const shortcode = Deno.env.get('MPESA_SHORTCODE')!
        const passkey = Deno.env.get('MPESA_PASSKEY')!
        const callbackSecret = Deno.env.get('MPESA_CALLBACK_SECRET') || ''
        const defaultCallback = req.url.replace('mpesa-stk', `mpesa-callback?secret=${callbackSecret}`)
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
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json'
            }
        })

        const tokenText = await tokenResp.text()
        console.log(`Token response status: ${tokenResp.status}, body: ${tokenText.substring(0, 200)}`)

        if (!tokenResp.ok) {
            throw new Error(`M-Pesa auth failed (${tokenResp.status}): ${tokenText.substring(0, 200)}`)
        }

        let tokenData
        try {
            tokenData = JSON.parse(tokenText)
        } catch {
            throw new Error(`M-Pesa auth returned invalid JSON: ${tokenText.substring(0, 200)}`)
        }

        const accessToken = tokenData.access_token
        if (!accessToken) {
            throw new Error(`No access_token in response: ${tokenText.substring(0, 200)}`)
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
