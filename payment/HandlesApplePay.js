{/*import { PlatformPayButton, isPlatformPaySupported } from '@stripe/stripe-react-native';
import React, { useEffect, useState } from "react";
import { View, Dimensions, TouchableOpacity, Text, StyleSheet, Button, Alert} from "react-native";


function HandlesApplePay() {
   const [isApplePaySupported, setIsApplePaySupported] = useState(false);

  useEffect(() => {
    (async () => {
      const supported = await isPlatformPaySupported();
      console.log('Is Apple Pay supported?', supported);
      setIsApplePaySupported(supported);
    })();
  }, []);

  // payment sheet
  const pay = async () => {
    const clientSecret = await fetchPaymentIntentClientSecret()
    const { error } = await confirmPlatformPayPayment(
      clientSecret,
      {
        applePay: {
          cartItems: [
            {
              label: 'Example item name',
              amount: '14.00',
              paymentType: PlatformPay.PaymentType.Immediate,
            },
            {
              label: 'Total',
              amount: '12.75',
              paymentType: PlatformPay.PaymentType.Immediate,
            },
          ],
          merchantCountryCode: 'US',
          currencyCode: 'USD',
          requiredShippingAddressFields: [
            PlatformPay.ContactField.PostalAddress,
          ],
          requiredBillingContactFields: [PlatformPay.ContactField.PhoneNumber],
        },
      }
    );
    if (error) {
      // handle error
    } else {
      Alert.alert('Success', 'Check the logs for payment intent details.');
      console.log(JSON.stringify(paymentIntent, null, 2));
    }
  };
  return {isApplePaySupported, pay}

}
export default [HandlesApplePay, pay];
*/}