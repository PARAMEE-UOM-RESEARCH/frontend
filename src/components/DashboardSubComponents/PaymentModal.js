import { message, Modal } from "antd";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";

const stripePromise = loadStripe(
  "pk_test_51JErgrSBK3EJsXk8m8nazAly9380A31meQy3tQBFzqCTMRGzQ5oYZ6CrUGflql5UZsebxCfVq9T6zZX6cLbyYh0q00WAKIfbQm"
);

export const PaymentModal = ({ visible, onCancel }) => {
  //   const options = {
  //     // passing the client secret obtained from the server
  //     clientSecret:
  //       "sk_test_51JErgrSBK3EJsXk88CBYeFsIFfPW9C1XRbBc6ZKQ5V1s6LKytqS21ExeJlsffQDFYyiKcJMMMsdgDIQwaOZD1OwG0098KDimWG",
  //   };
  return (
    <Modal title="Payment" open={visible} onCancel={onCancel} footer={null}>
      <Elements stripe={stripePromise}>
        <PaymentForm onCancel={onCancel} />
      </Elements>
    </Modal>
  );
};

const PaymentForm = ({ onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }
    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      message.error("Please enter card details");
      return;
    }

    const { error: backendError, paymentMethod } =
      await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

    if (backendError) {
      message.error("Please enter card details");
      return;
    }
    setLoading(true);
    message.success("Payment Success");
    if ([].length) {
      const { error, paymentIntent } = await stripe.confirmCardPayment({
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: "Paramee Weerarathne",
          },
        },
      });
    }

    setLoading(false);
    onCancel(true);
    localStorage.removeItem("hotel");
    if ("succeeded") {
      console.log("Payment successful");
      // Handle successful payment
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement className="p-2 border rounded" />
      <button
        type="submit"
        disabled={!stripe}
        className="w-full bg-blue-500 text-white py-2 rounded"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};
