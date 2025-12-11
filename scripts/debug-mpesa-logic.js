
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const consumerKey = process.env.MPESA_CONSUMER_KEY;
const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
const shortcode = '174379';
const passkey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
const callbackUrl = process.env.MPESA_CALLBACK_URL || 'https://ztechelectronics.co.ke/mpesa-callback';
const isSandbox = true; // FORCE SANDBOX CHECK
const baseUrl = isSandbox ? 'https://sandbox.safaricom.co.ke' : 'https://api.safaricom.co.ke';

async function run() {
    try {
        console.log('Environment:', isSandbox ? 'SANDBOX' : 'PRODUCTION');
        console.log('Shortcode:', shortcode);

        // 1. Get Token
        const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
        console.log('Getting token...');
        const tokenRes = await axios.get(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
            headers: { Authorization: `Basic ${auth}` },
        });
        const accessToken = tokenRes.data.access_token;
        console.log('Token received.');

        // 2. STK Push
        const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
        const password = Buffer.from(shortcode + passkey + timestamp).toString('base64');

        const payload = {
            BusinessShortCode: shortcode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline', // Trying PayBill first
            Amount: 1,
            PartyA: '254712345678',
            PartyB: shortcode,
            PhoneNumber: '254712345678',
            CallBackURL: callbackUrl,
            AccountReference: 'DebugRefer',
            TransactionDesc: 'DebugDesc',
        };

        console.log('Sending STK Push...');
        const res = await axios.post(`${baseUrl}/mpesa/stkpush/v1/processrequest`, payload, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        console.log('Success:', res.data);

    } catch (err) {
        console.error('FAILED:');
        if (err.response) {
            console.error('Status:', err.response.status);
            console.error('Data:', JSON.stringify(err.response.data, null, 2));
        } else {
            console.error(err.message);
        }
    }
}

run();
