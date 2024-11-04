import {
  Button,
  Card,
  DatePicker,
  Form,
  message,
  Modal,
  Select,
  TimePicker,
} from "antd";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import axios from "axios";
import moment from "moment";

const stripePromise = loadStripe(
  "pk_test_51JErgrSBK3EJsXk8m8nazAly9380A31meQy3tQBFzqCTMRGzQ5oYZ6CrUGflql5UZsebxCfVq9T6zZX6cLbyYh0q00WAKIfbQm"
);

const { REACT_APP_BASE_URL } = process.env;

export const PaymentModal = ({ visible, onCancel, profile }) => {
  //   const options = {
  //     // passing the client secret obtained from the server
  //     clientSecret:
  //       "sk_test_51JErgrSBK3EJsXk88CBYeFsIFfPW9C1XRbBc6ZKQ5V1s6LKytqS21ExeJlsffQDFYyiKcJMMMsdgDIQwaOZD1OwG0098KDimWG",
  //   };
  return (
    <Modal
      title="Payment"
      open={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnClose={true}
    >
      <Elements stripe={stripePromise}>
        <PaymentForm onCancel={onCancel} profile={profile} />
      </Elements>
    </Modal>
  );
};

const PaymentForm = ({ onCancel, profile }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
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
    const hotelData = JSON.parse(localStorage.getItem("hotel"));
    await axios.post(`${REACT_APP_BASE_URL}/sendEmail`, {
      customer_name: profile.given_name + " " + profile.family_name,
      customer_email: profile.email,
      hotel_name: hotelData.hotel_name,
      city_in_trans: hotelData.city_in_trans,
      checkin_from: hotelData.checkin.from || "N/A",
      checkin_until: hotelData.checkin.until || "N/A",
      checkout_from: hotelData.checkout.from || "N/A",
      checkout_until: hotelData.checkout.until || "N/A",
      total_amount: hotelData.composite_price_breakdown.gross_amount.value,
      currencycode: hotelData.currencycode,
      discounts_applied:
        hotelData.composite_price_breakdown.discounted_amount?.value || null,
      composite_price_breakdown: {
        gross_amount: hotelData.composite_price_breakdown.gross_amount.value,
        discounted_amount:
          hotelData.composite_price_breakdown.discounted_amount?.value || null,
        currency: hotelData.composite_price_breakdown.gross_amount.currency,
        items: hotelData.composite_price_breakdown.items.map((item) => ({
          name: item.name,
          details: item.details,
          item_amount: item.item_amount.value,
        })),
      },
      ...values,
    });
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

  const onFinish = (values) => {
    console.log("Selected Date and Time:", {
      bookedDate: moment(values.datePicker["$d"]).format("DD-MMM-YYYY"),
      bookedTime: moment()
        .set({ hour: values.timePicker["$H"], minute: values.timePicker["$m"] })
        .format("HH:mm A"), // Formats the time as "HH:mm"
    });
    handleSubmit({
      bookedDate: moment(values.datePicker["$d"]).format("DD-MMM-YYYY"),
      bookedTime: moment()
        .set({ hour: values.timePicker["$H"], minute: values.timePicker["$m"] })
        .format("HH:mm A"), // Formats the time as "HH:mm",
      noOfDays: parseInt(values.noOfDays),
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      className="space-y-4"
    >
      <Form.Item
        label="Date"
        name="datePicker"
        rules={[{ required: true, message: "Please select a date!" }]}
      >
        <DatePicker className="w-full" />
      </Form.Item>

      <Form.Item
        label="Time"
        name="timePicker"
        rules={[{ required: true, message: "Please select a time!" }]}
      >
        <TimePicker className="w-full" format="HH:mm" />
      </Form.Item>

      <Form.Item
        label="No of Days (Note: Price will be multlipy by the number of days)"
        name="noOfDays"
        rules={[{ required: true, message: "Please select days!" }]}
      >
        <Select className="w-full">
          {/* Generating options for 1 to 5 */}
          {[1, 2, 3, 4, 5].map((day) => (
            <Select.Option key={day} value={day}>
              {day}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Card className="p-2 border rounded">
        <CardElement />
      </Card>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          disabled={!stripe}
          className="w-full bg-teal-600"
        >
          {loading ? "Processing..." : "Pay Now"}
        </Button>
      </Form.Item>
    </Form>
  );
};
