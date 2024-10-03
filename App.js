import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './src/languages/store';
//import StartPage from './src/screens/StartPage';
//import HomePage from './src/screens/StartPage';
import Translations from './src/languages/Translations';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
//import Program1Page from "./src/screens/Program1Page";
//import KommunikationPage from "./src/screens/KommunikationPage";
//import LedarskapPage from "./src/screens/LedarskapPage";
import PersonligUtveckling from "./src/components/Program1/PersonligUtveckling";
import Kommunikation from "./src/components/Program2/Kommunikation";
import Ledarskap from "./src/components/Program3/Ledarskap";
import * as Font from 'expo-font';
import { Text, ActivityIndicator, View } from 'react-native';
import { StripeProvider } from '@stripe/stripe-react-native';
import InterBlack from './assets/fonts/InterText/Inter-Black.otf';
import InterLight from './assets/fonts/InterText/Inter-Light.otf';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'Inter-Black': InterBlack,
          'Inter-Light': InterLight,
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error("Error loading fonts", error);
      }
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Fonts...</Text>
      </View>
    );
  }

  return (
    <StripeProvider
      publishableKey="pk_test_51N8Vd6ErcED2yerg8nRoRT6QvmIoEX6phVfzW9RNxr5xQ1ajeQ67S1xDvFgaSHTME2hZufWuzY8r6DnlW1QLTV7p00Kf4pWEKN"
      urlScheme="kenzamind"
      merchantIdentifier="merchant.com.kenzamind"
    >
      <Provider store={store}>
        <NavigationContainer>
          <Translations>
            {(descriptions) => (
              <Stack.Navigator>
               <Stack.Screen name="StartPage" component={StartPage} options={{ headerShown: false, gestureEnabled: false }} />
                <Stack.Screen name="HomePage" options={{ headerShown: false }}>
                  {(props) => (
                    <HomePage {...props}
                      personligutveckling_subtitle={descriptions[3]}
                      kommunikation_subtitle={descriptions[4]}
                      ledarskap_subtitle={descriptions[5]}
                    />
                  )}

                 
                </Stack.Screen>
                 {/* 
                <Stack.Screen name="Program1Page" options={{ headerShown: false }}>
                  {(props) => <Program1Page {...props} personligutvecklingDescription={descriptions[0]} />}
                </Stack.Screen>

                <Stack.Screen name="LedarskapPage" options={{ headerShown: false }}>
                  {(props) => <LedarskapPage {...props} ledarskapDescription={descriptions[1]} />}
                </Stack.Screen>

                <Stack.Screen name="KommunikationPage" options={{ headerShown: false }}>
                  {(props) => <KommunikationPage {...props} kommunikationDescription={descriptions[2]} />}
                </Stack.Screen>
                */}

                <Stack.Screen name="PersonligUtveckling" component={PersonligUtveckling} options={{ headerShown: false }} />
                <Stack.Screen name="Kommunikation" component={Kommunikation} options={{ headerShown: false }} />
                <Stack.Screen name="Ledarskap" component={Ledarskap} options={{ headerShown: false }} />
              </Stack.Navigator>
            )}
          </Translations>
        </NavigationContainer>
      </Provider>
    </StripeProvider>
  );
}
