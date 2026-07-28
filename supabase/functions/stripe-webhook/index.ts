import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@14.14.0'
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
    try {
        const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')
        const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
        
        if (!stripeKey || !webhookSecret) {
            throw new Error('Stripe credentials not configured')
        }

        const stripe = new Stripe(stripeKey, {
            apiVersion: '2023-10-16',
        })

        const signature = req.headers.get('stripe-signature')
        if (!signature) {
            return new Response('No signature', { status: 400 })
        }

        const body = await req.text()
        let event

        try {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
        } catch (err: any) {
            console.error(`Webhook signature verification failed.`, err.message)
            return new Response(`Webhook Error: ${err.message}`, { status: 400 })
        }

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session
            const checkoutRequestId = session.metadata?.checkout_request_id
            
            if (checkoutRequestId) {
                const supabase = createClient(
                    Deno.env.get('SUPABASE_URL')!,
                    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
                )

                // Update all orders that match this checkout_request_id
                const { error } = await supabase
                    .from('orders')
                    .update({
                        payment_status: 'paid',
                        status: 'confirmed',
                        updated_at: new Date().toISOString()
                    })
                    .eq('checkout_request_id', checkoutRequestId)

                if (error) {
                    console.error('Failed to update orders in database:', error)
                    throw error
                }
                console.log(`Successfully processed checkout ${checkoutRequestId}`)
            }
        }

        return new Response(JSON.stringify({ received: true }), { status: 200 })

    } catch (error: any) {
        console.error('Webhook processing failed:', error.message)
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400 }
        )
    }
})
