import { PaystackButton } from 'react-paystack';

export default function ZtechPaystackButton({ email, amount, onSuccess }) {
  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
  return (
    <PaystackButton
      email={email}
      amount={amount}
      publicKey={publicKey}
      currency="NGN"
      text="Pay Now"
      onSuccess={onSuccess}
      onClose={() => {}}
    />
  );
}
