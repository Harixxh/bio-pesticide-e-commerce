import { useState } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';

const useRazorpay = () => {
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const initiatePayment = async ({ amount, orderData, onSuccess, onFailure }) => {
    try {
      setLoading(true);

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway');
        return;
      }

      // Create Razorpay order
      // Ensure amount is a number with 2 decimal places
      const formattedAmount = parseFloat(amount.toFixed(2));
      
      const { data } = await api.post('/payment/create-order', {
        amount: formattedAmount,
        currency: 'INR',
        receipt: `order_${Date.now()}`
      });

      if (!data.success) {
        toast.error('Failed to initiate payment');
        return;
      }

      const { orderId, key } = data.data;

      // Razorpay payment options
      const options = {
        key,
        amount: amount * 100, // in paise
        currency: 'INR',
        name: 'PesticideShop',
        description: 'Bio-Pesticide Purchase',
        image: '/logo.png', // Your logo
        order_id: orderId,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyResponse.data.success) {
              // Payment successful - create order in database
              const orderResponse = await api.post('/orders', {
                ...orderData,
                paymentMethod: 'Razorpay',
                paymentStatus: 'Paid',
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
              });

              if (orderResponse.data.success) {
                toast.success('Payment successful!');
                if (onSuccess) onSuccess(orderResponse.data.data);
              }
            } else {
              toast.error('Payment verification failed');
              if (onFailure) onFailure();
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed');
            if (onFailure) onFailure();
          }
        },
        prefill: {
          name: orderData.shippingAddress?.fullName || '',
          email: '', // Add user email if available
          contact: orderData.shippingAddress?.phone || ''
        },
        notes: {
          address: `${orderData.shippingAddress?.street}, ${orderData.shippingAddress?.city}`
        },
        theme: {
          color: '#2d6a4f' // Your primary color
        },
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true
        },
        modal: {
          ondismiss: function() {
            toast.info('Payment cancelled');
            if (onFailure) onFailure();
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Payment initiation error:', error);
      toast.error('Failed to initiate payment');
      if (onFailure) onFailure();
    } finally {
      setLoading(false);
    }
  };

  return { initiatePayment, loading };
};

export default useRazorpay;
