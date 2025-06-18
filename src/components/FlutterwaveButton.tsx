import { FlutterWaveButton, closePaymentModal } from 'flutterwave-react-v3';

export default function ZtechFlutterwaveButton({ email, amount, phone, name, onSuccess }) {
  const config = {
    public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY,
    tx_ref: Date.now().toString(),
    amount,
    currency: 'KES',
    payment_options: 'mpesa,card',
    customer: {
      email,
      phone_number: phone,
      name,
    },
    customizations: {
      title: 'Ztech Electronics',
      description: 'Payment for order',
      logo: '/ztech logo.jpg',
    },
  };

  return (
    <FlutterWaveButton
      {...config}
      text="Pay with M-Pesa / Card"
      callback={onSuccess}
      onClose={closePaymentModal}
    />
  );
}
