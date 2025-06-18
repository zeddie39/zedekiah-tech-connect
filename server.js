import 'dotenv/config';
import express from 'express';
import axios from 'axios';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(cors());
app.use(express.json());

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

app.post('/verify-paystack', async (req, res) => {
  const { reference, email, amount } = req.body;
  try {
    // Verify with Paystack
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );
    const data = response.data.data;
    if (
      response.data.status &&
      data.status === 'success' &&
      data.amount === amount &&
      data.customer.email === email
    ) {
      // Save payment to Supabase
      const { error } = await supabase.from('payments').insert([
        {
          email,
          amount: amount / 100,
          reference,
          status: 'success',
          paid_at: new Date().toISOString(),
        },
      ]);
      if (error) {
        return res.status(500).json({ verified: true, saved: false, message: 'Payment verified but failed to save in Supabase', error });
      }
      res.json({ verified: true, saved: true, data });
    } else {
      res.status(400).json({ verified: false, message: 'Payment not valid' });
    }
  } catch (err) {
    res.status(500).json({ verified: false, message: 'Verification failed', error: err.message });
  }
});

app.post('/verify-flutterwave', async (req, res) => {
  const { transaction_id, email, amount } = req.body;
  try {
    // Verify with Flutterwave
    const response = await axios.get(
      `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        },
      }
    );
    const data = response.data.data;
    if (
      response.data.status === 'success' &&
      data.status === 'successful' &&
      data.amount === amount &&
      data.customer.email === email
    ) {
      // Save payment to Supabase
      const { error } = await supabase.from('payments').insert([
        {
          email,
          amount,
          reference: data.tx_ref,
          status: 'success',
          paid_at: new Date().toISOString(),
        },
      ]);
      if (error) {
        return res.status(500).json({ verified: true, saved: false, message: 'Payment verified but failed to save in Supabase', error });
      }
      res.json({ verified: true, saved: true, data });
    } else {
      res.status(400).json({ verified: false, message: 'Payment not valid' });
    }
  } catch (err) {
    res.status(500).json({ verified: false, message: 'Verification failed', error: err.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
