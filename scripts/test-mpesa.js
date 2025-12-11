
import axios from 'axios';

async function testMpesa() {
    try {
        const res = await axios.post('http://localhost:5002/api/mpesa/stkpush', {
            amount: 1,
            phone: '254712345678',
            accountReference: 'Test',
            transactionDesc: 'Test'
        });
        console.log('Success:', res.data);
    } catch (err) {
        console.error('Error:', err.response ? err.response.data : err.message);
    }
}

testMpesa();
