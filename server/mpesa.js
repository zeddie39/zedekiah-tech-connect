
// Node.js Express backend for Daraja (M-Pesa) STK Push (ESM version)
import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const app = express();
app.use(express.json());
app.use(cors());

// Set these in your .env file
const consumerKey = process.env.MPESA_CONSUMER_KEY;
const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
const shortcode = process.env.MPESA_SHORTCODE; // e.g. 174379
const passkey = process.env.MPESA_PASSKEY;
const callbackUrl = process.env.MPESA_CALLBACK_URL || 'https://yourdomain.com/mpesa-callback';

// Get access token
async function getAccessToken() {
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  const res = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
    headers: { Authorization: `Basic ${auth}` },
  });
  return res.data.access_token;
}

// Initiate STK Push
app.post('/api/mpesa/stkpush', async (req, res) => {
  try {
    const { amount, phone, accountReference, transactionDesc } = req.body;
    const accessToken = await getAccessToken();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const password = Buffer.from(shortcode + passkey + timestamp).toString('base64');

    const payload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phone,
      PartyB: shortcode,
      PhoneNumber: phone,
      CallBackURL: callbackUrl,
      AccountReference: accountReference || 'ZtechShop',
      TransactionDesc: transactionDesc || 'Shop Payment',
    };

    const stkRes = await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', payload, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    res.json(stkRes.data);
  } catch (err) {
    res.status(500).json({ error: err.message, details: err.response?.data });
  }
});

// Callback endpoint for M-Pesa
app.post('/api/mpesa/callback', async (req, res) => {
  console.log('M-Pesa Callback:', JSON.stringify(req.body, null, 2));
  // Example: update order in Supabase if payment is successful
  const result = req.body.Body?.stkCallback;
  const metadata = result?.CallbackMetadata?.Item || [];
  const mpesaReceipt = metadata.find(i => i.Name === 'MpesaReceiptNumber')?.Value;
  const phone = metadata.find(i => i.Name === 'PhoneNumber')?.Value;
  const amount = metadata.find(i => i.Name === 'Amount')?.Value;
  const reference = result?.CheckoutRequestID;

  if (result?.ResultCode === 0) {
    // Payment successful: update order in Supabase (customize as needed)
    await supabase
      .from('orders')
      .update({ payment_status: 'paid', mpesa_receipt: mpesaReceipt })
      .eq('checkout_request_id', reference);
  }

  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`M-Pesa server running on port ${PORT}`));
