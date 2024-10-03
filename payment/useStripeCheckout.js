// hooks/useStripeCheckout.js
import { useState, useEffect } from 'react';
import { useStripe } from '@stripe/stripe-react-native';
import { Alert } from 'react-native';

export const useStripeCheckout = (API_URL) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const fetchPaymentSheetParams = async () => {
    const response = await fetch(`${API_URL}/payment-sheet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Response from server:', response); // denna körs och loggas
    const { paymentIntent, ephemeralKey, customer} = await response.json();
    console.log( paymentIntent, ephemeralKey, customer); // undefined, undefined, undefined

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    const {
      paymentIntent,
      ephemeralKey,
      customer,
      publishableKey,
    } = await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Example, Inc.",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: false,
      defaultBillingDetails: {
        name: 'Jane Doe',
      }
    });
    if (!error) {
      setLoading(true);
    }
    if (error) {
      console.error("Error initializing payment sheet in initPaymentSheet:", error);
    }
  };

  const openPaymentSheet = async () => {
      const { error } = await presentPaymentSheet();

      if (error) {
        Alert.alert(`Error code: ${error.code}`, error.message);
      } else {
        Alert.alert('Success', 'Your order is confirmed!');
      }
    };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  return {
    loading,
    openPaymentSheet,
  };
};
