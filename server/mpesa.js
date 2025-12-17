
// Node.js Express backend for Daraja (M-Pesa) STK Push (ESM version)
import express from 'express';
import axios from 'axios';
import cors from 'cors';
import fs from 'fs';
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
const shortcode = process.env.MPESA_SHORTCODE;
const passkey = process.env.MPESA_PASSKEY;
const callbackUrl = process.env.MPESA_CALLBACK_URL || 'https://ztechelectronics.co.ke/mpesa-callback';

// Determine environment (sandbox or production)
const isSandbox = process.env.MPESA_ENV !== 'production';
const baseUrl = isSandbox
  ? 'https://sandbox.safaricom.co.ke'
  : 'https://api.safaricom.co.ke';

// Headers to bypass Incapsula WAF
const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection': 'keep-alive'
};

async function getAccessToken() {
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  const res = await axios.get(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: {
      Authorization: `Basic ${auth}`,
      ...headers
    },
  });
  return res.data.access_token;
}

// Initiate STK Push
app.post('/api/mpesa/stkpush', async (req, res) => {
  try {
    const { amount, phone, accountReference, transactionDesc } = req.body;

    // Validate inputs
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
    if (!phone || !/^254\d{9}$/.test(phone)) {
      return res.status(400).json({ error: 'Invalid phone number. Use format 254XXXXXXXXX' });
    }

    const accessToken = await getAccessToken();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const password = Buffer.from(shortcode + passkey + timestamp).toString('base64');

    const payload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(amount),
      PartyA: phone,
      PartyB: shortcode,
      PhoneNumber: phone,
      CallBackURL: callbackUrl,
      AccountReference: accountReference || 'ZtechShop',
      TransactionDesc: transactionDesc || 'Shop Payment',
    };

    console.log(`[STK Push] Initiating payment: ${amount} KES to ${phone}`);

    const stkRes = await axios.post(`${baseUrl}/mpesa/stkpush/v1/processrequest`, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...headers
      },
    });

    console.log(`[STK Push] Response:`, stkRes.data);
    res.json(stkRes.data);
  } catch (err) {
    const errorLog = {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data,
      stack: err.stack,
      timestamp: new Date().toISOString()
    };
    try {
      fs.writeFileSync('mpesa_error.json', JSON.stringify(errorLog, null, 2));
    } catch (e) {
      console.error('Failed to write error log:', e);
    }

    console.error('[STK Push] Error Details:');
    console.error('- Message:', err.message);
    if (err.response) {
      console.error('- Status:', err.response.status);
      console.error('- Data:', JSON.stringify(err.response.data, null, 2));
    } else {
      console.error('- Stack:', err.stack);
    }

    res.status(500).json({
      error: err.message,
      details: err.response?.data,
      errorMessage: err.response?.data?.errorMessage || 'Failed to initiate payment. Check server logs.'
    });
  }
});

// Query STK Push status
app.get('/api/mpesa/status/:checkoutRequestId', async (req, res) => {
  try {
    const { checkoutRequestId } = req.params;

    if (!checkoutRequestId) {
      return res.status(400).json({ error: 'CheckoutRequestID is required' });
    }

    const accessToken = await getAccessToken();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const password = Buffer.from(shortcode + passkey + timestamp).toString('base64');

    const payload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId,
    };

    console.log(`[Status Query] Checking status for: ${checkoutRequestId}`);

    const queryRes = await axios.post(`${baseUrl}/mpesa/stkpushquery/v1/query`, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...headers
      },
    });

    console.log(`[Status Query] Response:`, queryRes.data);
    res.json(queryRes.data);
  } catch (err) {
    const errData = err.response?.data;
    const isFirewallBlock = typeof errData === 'string' && (errData.includes('Incapsula') || errData.includes('<html'));

    if (isFirewallBlock) {
      console.warn('[Status Query] Firewall blocked request. Returning pending status to frontend.');
      return res.json({
        // No ResultCode means "pending" to the frontend hook
        status: 'pending',
        message: 'Firewall block - retrying'
      });
    }

    console.error('[Status Query] Error:', errData || err.message);
    res.status(500).json({
      error: err.message,
      details: errData
    });
  }
});

// Callback endpoint for M-Pesa
app.post('/api/mpesa/callback', async (req, res) => {
  console.log('[Callback] Received:', JSON.stringify(req.body, null, 2));

  const result = req.body.Body?.stkCallback;
  const metadata = result?.CallbackMetadata?.Item || [];
  const mpesaReceipt = metadata.find(i => i.Name === 'MpesaReceiptNumber')?.Value;
  const phone = metadata.find(i => i.Name === 'PhoneNumber')?.Value;
  const amount = metadata.find(i => i.Name === 'Amount')?.Value;
  const reference = result?.CheckoutRequestID;
  const resultCode = result?.ResultCode;
  const resultDesc = result?.ResultDesc;

  console.log(`[Callback] Result: ${resultCode} - ${resultDesc}`);
  console.log(`[Callback] Receipt: ${mpesaReceipt}, Phone: ${phone}, Amount: ${amount}`);

  if (resultCode === 0) {
    // Payment successful: update order in Supabase
    const { error } = await supabase
      .from('orders')
      .update({
        payment_status: 'paid',
        mpesa_receipt: mpesaReceipt,
        status: 'confirmed'
      })
      .eq('checkout_request_id', reference);

    if (error) {
      console.error('[Callback] Supabase update error:', error);
    } else {
      console.log(`[Callback] Order updated successfully for ${reference}`);
    }
  } else {
    // Payment failed
    const { error } = await supabase
      .from('orders')
      .update({
        payment_status: 'failed',
        status: 'payment_failed'
      })
      .eq('checkout_request_id', reference);

    if (error) {
      console.error('[Callback] Supabase update error:', error);
    }
  }

  res.json({ status: 'ok' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: isSandbox ? 'sandbox' : 'production',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`M-Pesa server running on port ${PORT}`);
  console.log(`Environment: ${isSandbox ? 'SANDBOX' : 'PRODUCTION'}`);
  console.log(`Callback URL: ${callbackUrl}`);
});

