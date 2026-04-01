// Assuming the backend API endpoint and necessary libraries are imported

import React from 'react';
import axios from 'axios';

const MpesaButton = () => {
    const handlePayment = async () => {
        try {
            const response = await axios.post('https://your-nodejs-backend-url/api/mpesa', {
                // Add necessary data for your Node.js backend
            });
            console.log('Payment response:', response.data);
        } catch (error) {
            console.error('Payment error:', error);
        }
    };

    return <button onClick={handlePayment}>Pay with M-Pesa</button>;
};

export default MpesaButton;