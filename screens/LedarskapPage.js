import { View, Dimensions, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Video } from "expo-av";
import React, { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import Sv from '../languages/Sv';
import Eng from '../languages/Eng';
import Ar from '../languages/Ar';
import { LinearGradient } from 'expo-linear-gradient';
import stylesheet from '../stylesheet';
import fetchData from '../utils/fetchData';
import { getLanguagePath } from "../utils/languagePath";
import AsyncStorage from '@react-native-async-storage/async-storage';

const LedarskapPage = ({ ledarskapDescription }) => {
  const videoUrl = require("../../assets/video.mp4");
  const videoRef = useRef(null);
  const { width, height } = Dimensions.get("window");
  const navigation = useNavigation();
  const language = useSelector((state) => state.language);
  const translateFromFile = language === 'Sv' ? Sv : language === 'Ar' ? Ar : Eng; 
  const languagePath = getLanguagePath(language);

  const preloadData = async () => {
    try {
      const videoUrls = await fetchData('videos', `MotiverandeLedarskap/${languagePath}/videos/`);
      await AsyncStorage.setItem('videoUrls', JSON.stringify(videoUrls));
      const AudioUrls = await fetchData('audios', `MotiverandeLedarskap/${languagePath}/audios/`);
      await AsyncStorage.setItem('AudioUrls', JSON.stringify(AudioUrls));
    } catch (error) {
      console.error("Error preloading data:", error);
    }
  };

  useEffect(() => {
    preloadData();
  }, []);

  return (
    <LinearGradient colors={stylesheet.colors.GRADIENT_COLORS} start={stylesheet.gradient.START} end={stylesheet.gradient.END} style={styles.container}>
      <View style={styles.mainContainer}>
        <View style={styles.videoContainer}>
          <Video ref={videoRef} source={videoUrl} style={{ width, height: height / 2 }} resizeMode="cover" useNativeControls />
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>{ledarskapDescription}</Text>
        </View>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Ledarskap")}>
            <Text style={styles.buttonText}>{translateFromFile.buy}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  videoContainer: { flex: 1, height: '100%', zIndex: 999 },
  container: { flex: 1, flexDirection: 'column' },
  descriptionContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, width: '90%', marginHorizontal: '4%' },
  descriptionText: { fontSize: 17, fontFamily: stylesheet.fonts.FONTFAMILY, color: stylesheet.colors.TEXT_COLOR },
  buttonWrapper: { paddingBottom: 40 },
  button: { backgroundColor: stylesheet.colors.BLUE, padding: 10, borderRadius: 5, height: 45, width: '70%', alignSelf: 'center', alignItems: 'center' },
  buttonText: { fontSize: 17, color: stylesheet.colors.TEXT_IN_BUTTON, textAlign: "center", fontFamily: stylesheet.fonts.FONTFAMILY }
});

export default LedarskapPage;


