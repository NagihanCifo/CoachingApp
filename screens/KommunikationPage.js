import { View, Dimensions, TouchableOpacity, Text, StyleSheet, Button, Alert } from "react-native";
import { Video } from "expo-av";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import Sv from '../languages/Sv';
import Eng from '../languages/Eng';
import Ar from '../languages/Ar';
// import { getLanguagePath } from "../utils/languagePath.js"; // Deactivated getLanguagePath utility
import { LinearGradient } from 'expo-linear-gradient';
import stylesheet from '../stylesheet';
// import fetchData from '../utils/fetchData'; // Deactivated fetchData utility
import HandlesApplePay from '../../payment/HandlesApplePay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PlatformPayButton, isPlatformPaySupported, ApplePay, useStripe, PlatformPay, confirmPlatformPayPayment } from '@stripe/stripe-react-native';

const KommunikationPage = ({ kommunikationDescription }) => {

  // Payment
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const API_URL = "http://192.168.8.118";
  // const { isApplePaySupported, pay } = HandlesApplePay(); // If you want to deactivate HandlesApplePay, uncomment this line

  // Other
  const videoUrl = require("../../assets/video.mp4");
  const videoRef = React.useRef(null);
  const { width, height } = Dimensions.get("window");
  const navigation = useNavigation();

  // Handle languages options
  const language = useSelector((state) => state.language); 
  const translateFromFile = language === 'Sv' ? Sv : language === 'Ar' ? Ar : Eng;
  // const languagePath = getLanguagePath(language); // Deactivated getLanguagePath usage

  // Preload videos and Audios to be shown in Kommunikation.js
  const preloadData = async () => {
    try {
      console.log("Preloading data is deactivated.");

      // Commented out fetchData calls to deactivate them
      /*
      const videoUrls = await fetchData('videos', `Kommunikation/${languagePath}/videos/`);
      await AsyncStorage.setItem('videoUrls', JSON.stringify(videoUrls));

      const AudioUrls = await fetchData('audios', `Kommunikation/${languagePath}/audios/`);
      await AsyncStorage.setItem('AudioUrls', JSON.stringify(AudioUrls));
      */

      // Optional: You can set default values or skip setting AsyncStorage if fetchData is deactivated
      // For example:
      // await AsyncStorage.setItem('videoUrls', JSON.stringify([]));
      // await AsyncStorage.setItem('AudioUrls', JSON.stringify([]));
    } catch (error) {
      console.error("Error preloading data:", error);
    }
  };

  useEffect(() => {
    preloadData();
  }, []);

  // Payment

  const fetchPaymentSheetParams = async () => {
    try {
      const response = await fetch(`${API_URL}/cart-session.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status !== 200) {
        console.error(`Server returned status code: ${response.status}`);
        console.error(`Server response: ${await response.text()}`);
        return null;
      }
      const { paymentIntent, ephemeralKey, customer } = await response.json();
      console.log("Received paymentIntent, ephemeralKey, and customer: ", { paymentIntent, ephemeralKey, customer });
      return { paymentIntent, ephemeralKey, customer };
    } catch (error) {
      console.error("An error occurred while fetching payment sheet params: ", error);
      return null;
    }
  };

  const initializePaymentSheet = async () => {
    const params = await fetchPaymentSheetParams();
    if (!params) {
      console.error("Failed to fetch payment sheet parameters");
      return;
    }
    
    const { paymentIntent, ephemeralKey, customer } = params;

    try {
      const { error } = await initPaymentSheet({
        merchantDisplayName: "Example, Inc.",
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: { name: 'Jane Doe' }
      });
      if (error) {
        console.error("An error occurred during payment sheet initialization: ", error);
        return;
      }
      setLoading(true);
    } catch (error) {
      console.error("An unexpected error occurred during payment sheet initialization: ", error);
    }
  };

  const openPaymentSheet = async () => {
    try {
      console.log("Payment sheet");

      // Debug: Log the paymentIntent ID here
      console.log("Payment Intent ID:", /* your payment intent ID */);

      const { error } = await presentPaymentSheet();

      if (error) {
        // Debug: Log the full error object here
        console.error("Error in presentPaymentSheet:", JSON.stringify(error, null, 2));

        Alert.alert(`Error code: ${error.code}`, error.message);
      } else {
        console.log("Payment sheet presented successfully");
        Alert.alert('Success', 'Your order is confirmed!');
      }
    } catch (e) {
      console.error("An exception occurred:", e);
      Alert.alert('Exception', 'An unexpected error occurred.');
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);


  /**************************    apple pay    ************************/
  const [isApplePaySupported, setIsApplePaySupported] = useState(false);

  useEffect(() => {
    (async () => {
      const supported = await isPlatformPaySupported();
      console.log('Is Apple Pay supported?', supported);
      setIsApplePaySupported(supported);
    })();
  }, []);

  // Payment sheet
  const pay = async () => {
    const clientSecret = await fetchPaymentSheetParams()
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
      // Handle error
      console.error("Error during Platform Pay:", error);
    } else {
      Alert.alert('Success', 'Check the logs for payment intent details.');
      console.log(JSON.stringify(paymentIntent, null, 2));
    }
  };
  // return {isApplePaySupported, pay} 

  return (
    <LinearGradient
      colors={stylesheet.colors.GRADIENT_COLORS}
      start={stylesheet.gradient.START}
      end={stylesheet.gradient.END}
      style={styles.container}
    >
      <View style={styles.mainContainer}>
        <View style={styles.videoContainer}>
          <Video
            ref={videoRef}
            source={videoUrl}
            style={{ width: width, height: height / 2 }}
            resizeMode="cover"
            fullscreen={false}
            paused={false}
            disableFullscreen={true}
            useNativeControls={true}
          />
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>{kommunikationDescription}</Text>
        </View>

        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Kommunikation")}
          >
            <Text style={styles.buttonText}> {translateFromFile.buy} </Text>
          </TouchableOpacity>
        </View>

        <View>
          {isApplePaySupported && (
            <PlatformPayButton
              onPress={pay}
              appearance={PlatformPay.ButtonStyle.Black}
              borderRadius={4}
              style={{
                width: '50%',
                height: 50,
                alignSelf: 'center',
                alignItems: 'center',
              }}
            />
          )}
        </View>

        <View>
          <Button
            variant="primary"
            disabled={!loading}
            title="Checkout"
            onPress={openPaymentSheet}
          />
        </View>

      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  videoContainer: {
    flex: 1, 
    height: '100%', 
    zIndex: 999
  },
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  descriptionContainer: {
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    padding: 20,
    width: '90%', 
    marginLeft: '4%',
    marginRight: '4%'
  },
  descriptionText: {
    fontSize: 17, 
    fontFamily: stylesheet.fonts.FONTFAMILY,
    color: stylesheet.colors.TEXT_COLOR,
  },
  buttonWrapper: {
    paddingBottom: 40
  },
  button: {
    backgroundColor: stylesheet.colors.BLUE,
    padding: 10,
    borderRadius: 5,
    height: 45,
    width: '70%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 17, 
    color: stylesheet.colors.TEXT_IN_BUTTON, 
    textAlign: "center", 
    fontFamily: stylesheet.fonts.FONTFAMILY  
  },
  checkoutButton: {
    marginBottom: 25,
  },
});

export default KommunikationPage;
