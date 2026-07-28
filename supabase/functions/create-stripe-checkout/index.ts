import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@14.14.0'
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')
        if (!stripeKey) {
            throw new Error('STRIPE_SECRET_KEY is not set')
        }
        
        const stripe = new Stripe(stripeKey, {
            apiVersion: '2023-10-16',
        })

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

        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 401,
            })
        }

        const { cart, checkoutRequestId, returnUrl } = await req.json()

        if (!cart || !checkoutRequestId || !returnUrl) {
            throw new Error('Missing required fields: cart, checkoutRequestId, returnUrl')
        }

        const lineItems = cart.map((item: any) => {
            return {
                price_data: {
                    currency: 'kes',
                    product_data: {
                        name: item.title,
                    },
                    unit_amount: Math.round(item.price * 100), // Stripe expects amount in smallest currency unit (cents/cents equivalent)
                },
                quantity: item.quantity,
            }
        })

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${returnUrl}?status=success&checkout_id=${checkoutRequestId}`,
            cancel_url: `${returnUrl}?status=cancelled`,
            customer_email: user.email,
            client_reference_id: checkoutRequestId,
            metadata: {
                checkout_request_id: checkoutRequestId,
                user_id: user.id
            }
        })

        return new Response(JSON.stringify({ sessionId: session.id, url: session.url }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error: unknown) {
        console.error('Stripe Checkout Error:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return new Response(JSON.stringify({ error: message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
