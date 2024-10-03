import { View, Dimensions, TouchableOpacity, Text, Image, StyleSheet } from "react-native";
import { Video } from "expo-av";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from 'react-redux';
import { setLanguage } from '../languages/store';
import stylesheet from '../stylesheet';
// import fetchData from '../utils/fetchData'; // Commented out since we are not using it
import AsyncStorage from '@react-native-async-storage/async-storage';

const StartPage = () => {
  const videoUrl = require("../../assets/video.mp4");
  const videoRef = React.useRef(null);
  const { width, height } = Dimensions.get("window");
  const navigation = useNavigation();
  const [languageSelected, setLanguageSelected] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  // Loops video
  const handlePlaybackStatusUpdate = (status) => {
    if (status.didJustFinish) {
      videoRef.current.replayAsync();
    }
  };

  // Preloading thumbnails to be shown in HomePage
  const preloadImages = async () => {
    try {
        // const urls = await fetchData('image', 'Thumbnails/'); // Commented out since we are not using it
        // await AsyncStorage.setItem('imageUrls', JSON.stringify(urls)); // Commented out since we are not using it
        setLoading(false);
    } catch (error) {
        console.error("Error preloading images:", error, error.message);
    }
  };

  useEffect(() => {
    preloadImages(); // Preload images function call
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playAsync();
    }
  }, [videoRef]);

  const handleLanguageButtonPress = () => {
    setLanguageSelected(true);
  };

  // Handle users language choice and send it as a parameter to HomePage
  const handleChoosenLanguagePress = (language) => {
    setLanguageSelected(false);
    dispatch(setLanguage(language));
    videoRef.current.pauseAsync();
    navigation.replace('HomePage', { language: language });
  };

  // Render circle language buttons
  const renderLanguageOptions = () => {
    return (
      <View style={styles.circlesContainer}>
        <TouchableOpacity style={styles.circle} onPress={() => handleChoosenLanguagePress('Eng')}>
          <Text style={styles.circleLanguageText}>Eng</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.circle} onPress={() => handleChoosenLanguagePress('Sv')}>
          <Text style={styles.circleLanguageText}>Sv</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.circle} onPress={() => handleChoosenLanguagePress('Ar')}>
          <Text style={styles.circleLanguageText}>Ar</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Handles if buttons or text shows above language Button
  const renderTextOverButton = () => {
    if (languageSelected) {
      return (
        <View style={styles.circlesContainer}>
          <View style={styles.circle}></View>
          <View style={styles.circle}></View>
          <View style={styles.circle}></View>
        </View>
      );
    } else {
      return (
        <Text style={styles.textOverButton}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </Text>
      );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Video
        ref={videoRef}
        source={videoUrl}
        style={{ width: width, height: height }}
        resizeMode="cover"
        fullscreen={false}
        paused={false}
        disableFullscreen={true}
        useNativeControls={false}
        isMuted={true}
        isLooping={true}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
      />
      <Image
        source={require('../../assets/KenzaMind.Logo.png')}
        style={[
          styles.logo,
          {
            width: width * 0.7,
            height: height * 0.35,
          },
        ]}
      />
    
      {renderTextOverButton()}
      <TouchableOpacity style={styles.languageButton} onPress={handleLanguageButtonPress}>
        <Text style={{ color: "white", fontSize: 18, fontFamily: stylesheet.fonts.FONTFAMILY }}> Select language </Text>
      </TouchableOpacity>
      {languageSelected && renderLanguageOptions()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  circlesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 180,
    width: '100%',
  },
  circle: {
    width: 45,
    height: 45,
    borderRadius: 50,
    marginHorizontal: 10,
    backgroundColor: 'white',
    opacity: 0.50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleLanguageText: {
    color: '#000000',
    fontSize: 16,
    textAlign: 'center',
  },
  textOverButton: {
    position: "absolute",
    bottom: 180,
    zIndex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: "center",
    justifyContent: "center",
    width: '90%',
    marginLeft: '5%',
    marginRight: '5%',
    fontFamily: stylesheet.fonts.FONTFAMILY,
  }, 
  languageButton: {
    position: "absolute",
    alignSelf: 'center',
    width: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 95,
    padding: 10,
    borderRadius: 5,
    height: 50,
    backgroundColor: stylesheet.colors.BLUE,
  },
  logo: {
    position: 'absolute',
    alignSelf: 'center',
    top: '7.5%',
    transform: [{ translateY: -0.5 * (Dimensions.get('window').width * 0.5) }],
  },
});

export default StartPage;
