import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { useSelector } from "react-redux";
import * as FileSystem from "expo-file-system";
import { LinearGradient } from 'expo-linear-gradient';
import Sv from '../languages/Sv'; 
import Eng from '../languages/Eng'; 
import Ar from '../languages/Ar'; 
import stylesheet from '../stylesheet';
// import fetchData from '../utils/fetchData'; // Deactivated fetchData utility
import AsyncStorage from '@react-native-async-storage/async-storage';

// Here's all navigation from home menu

// import LogoutPage from "./LogoutPage";

const HomePage = ({ personligutveckling_subtitle, kommunikation_subtitle, ledarskap_subtitle }) => {

  const [imageUrls, setImageUrls] = useState([]);

  const navigation = useNavigation();
  const language = useSelector((state) => state.language); // Get selected language from redux store
  const translations = language === 'Sv' ? Sv : language === 'Ar' ? Ar : Eng; 

  // Showing the preloaded images in StartPage
  useEffect(() => {
    const fetchStoredUrls = async () => {
      try {
        const storedUrls = await AsyncStorage.getItem('imageUrls');
        
        if (storedUrls) {
          setImageUrls(JSON.parse(storedUrls));
        } else {
          // Commented out fetchData to deactivate it
          /*
          const urls = await fetchData('image', 'Thumbnails/');
          setImageUrls(urls);
          */
          
          // Optional: You can set imageUrls to an empty array or provide default URLs to prevent errors
          setImageUrls([]); // Setting to empty array as fetchData is deactivated
        }
      } catch (error) {
        console.error("Error fetching stored image URLs:", error);
      }
    };

    fetchStoredUrls();
  }, []);

  return (
    <LinearGradient
      colors={stylesheet.colors.GRADIENT_COLORS}
      start={stylesheet.gradient.START}
      end={stylesheet.gradient.END}
      style={styles.container}
    >
      {/* <LogoutPage/> */}
      <Text style={styles.header}>{translations.chooseProgram}</Text>
  
      <View style={styles.buttonList}>
        <Pressable onPress={() => navigation.navigate("Program1Page")} style={styles.button}>
          <View style={styles.buttonContainer}>
            {imageUrls[0] && <Image source={{ uri: imageUrls[0].fileUri || imageUrls[0].url }} style={styles.imageInButton} />}
            <View style={styles.textContainer}>
              <Text style={styles.text}>{translations.program1}</Text>
              <Text style={styles.descriptionText}>{personligutveckling_subtitle}</Text>
            </View>
          </View>
        </Pressable>
  
        <Pressable onPress={() => navigation.navigate("KommunikationPage")} style={styles.button}>
          <View style={styles.buttonContainer}>
            {imageUrls[1] && <Image source={{ uri: imageUrls[1].fileUri || imageUrls[1].url }} style={styles.imageInButton} />}
            <View style={styles.textContainer}>
              <Text style={styles.text}>{translations.program2}</Text>
              <Text style={styles.descriptionText}>{kommunikation_subtitle}</Text>
            </View>
          </View>
        </Pressable>
  
        <Pressable onPress={() => navigation.navigate("LedarskapPage")} style={styles.button}>
          <View style={styles.buttonContainer}>
            {imageUrls[2] && <Image source={{ uri: imageUrls[2].fileUri || imageUrls[2].url }} style={styles.imageInButton} />}
            <View style={styles.textContainer}>
              <Text style={styles.text}>{translations.program3}</Text>
              <Text style={styles.descriptionText}>{ledarskap_subtitle}</Text>
            </View>
          </View>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  header: {
    textAlign: 'center',
    fontSize: 23,
    paddingTop: 80,
    fontFamily: stylesheet.fonts.FONTFAMILY,
    color: stylesheet.colors.TEXT_COLOR,
  },
  buttonList: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    marginTop: '20%',
    borderRadius: 15,
    height: 100,
    width: '85%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    elevation: 5,
    backgroundColor: stylesheet.colors.BUTTON_IN_HOMEPAGE,
    fontFamily: stylesheet.fonts.REGULAR,
  },
  imageInButton: {
    width: 70, 
    height: 70,
    marginLeft: 10,
    borderRadius: 5,
  },
  textContainer: {
    flex: 1, 
    justifyContent: 'flex-start', 
    alignItems: 'flex-start', 
    width: '90%', 
    marginLeft: '4%',
    marginRight: '4%'
  },
  text: {
    fontSize: 14,
    fontFamily: stylesheet.fonts.BOLD,
    color: stylesheet.colors.TEXT_COLOR,
    letterSpacing: 0.5,
  },
  descriptionText: {
    fontSize: 13,
    fontFamily: stylesheet.fonts.FONTFAMILY,
    color: 'rgba(204, 204, 204, 0.7)',
    marginTop: 5,
  },
});

export default HomePage;
