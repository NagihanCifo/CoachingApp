import { View, Dimensions, TouchableOpacity, Text, Image, StyleSheet, ScrollView, Modal, TouchableWithoutFeedback } from "react-native";
import { Video } from "expo-av";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from 'react-redux';
import { setLanguage } from '../languages/store';
import stylesheet from '../../stylesheet';
// import fetchData from '../../utils/fetchData'; // Deactivated fetchData utility
// import { getLanguagePath } from "../../utils/languagePath"; // Deactivated languagePath utility
import AsyncStorage from '@react-native-async-storage/async-storage';
// import {getStorage, ref, listAll, getDownloadURL } from "firebase/storage"; // Deactivated Firebase storage utilities

const Ledarskap = () => {
  const [videoUrls, setVideoUrls] = useState([]);
  const [AudioUrls, setAudioUrls] = useState([]);
  const [imageFolderUrls, setImageFolderUrls] = useState([]); 
  const [imageComponents, setImageComponents] = useState([]); 

  // Handle modal to show images/pdf
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // Handle languages options
  const language = useSelector((state) => state.language); 
  const translateFromFile = language === 'Sv' ? Sv : language === 'Ar' ? Ar : Eng; 
  // const languagePath = getLanguagePath(language); // Deactivated languagePath

  const dispatch = useDispatch();

  const goBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // fetchImageFolders(`MotiverandeLedarskap/${languagePath}/images/`, setImageFolderUrls, setLoading); // Deactivated fetchImageFolders
      console.log("fetchImageFolders is deactivated.");
    });
    return unsubscribe;
  }, [navigation]);

  // Showing the preloaded data in Kommunikation
  useEffect(() => {
    const fetchStoredUrls = async () => {
      try {
        const storedVideoUrls = await AsyncStorage.getItem('videoUrls');
        if (storedVideoUrls) {
          setVideoUrls(JSON.parse(storedVideoUrls));
        } else {
          /*
          const urls = await fetchData('videos', `MotiverandeLedarskap/${languagePath}/videos/`, setLoading); // Deactivated fetchData
          setVideoUrls(urls);
          */
          console.log("Fetching video URLs is deactivated.");
        }

        const storedAudioUrls = await AsyncStorage.getItem('AudioUrls');
        if (storedAudioUrls) {
          setAudioUrls(JSON.parse(storedAudioUrls));
        } else {
          /*
          const urls = await fetchData('audios', `MotiverandeLedarskap/${languagePath}/audios/`, setLoading); // Deactivated fetchData
          setAudioUrls(urls);
          */
          console.log("Fetching audio URLs is deactivated.");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stored URLs:", error);
      }
    };

    fetchStoredUrls();
  }, []);

  // Handles render of first image/pdf
  useEffect(() => {
    const loadFirstImage = async () => {
      if (imageComponents.length > 0) {
        await Image.prefetch(imageComponents[0].props.source.uri);
        setIsImageLoaded(true);
      }
    };
    loadFirstImage();
  }, [imageComponents]);

  /*
  const fetchImageFolders = async (storagePath, setFolders) => {
    try {
      const storage = getStorage();
      const listRef = ref(storage, storagePath);
      const res = await listAll(listRef);
      const folders = res.prefixes.map((folderRef) => {
        const folderName = folderRef.name.replace(/\/$/, '');
        return { folderName };
      });
      setFolders(folders);
    } catch (error) {
      console.log(error);
    }
  };
  */

  // ImagePress
  const handleImagePress = async (folderName) => {
    /*
    const folderPath = `MotiverandeLedarskap/${languagePath}/images/${folderName}/`;
    const storage = getStorage();
    const listRef = ref(storage, folderPath);
    const res = await listAll(listRef);
    const urls = await Promise.all(
      res.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        return { url };
      })
    );
    const imageComponents = (urls.map((urlObject, index) => (
      <Image key={index} source={{ uri: urlObject.url }} style={styles.image} />
    ))); 
    setImageComponents(imageComponents);
    setIsImageLoaded(true);
    setModalVisible(true);
    setSelectedImageIndex(0);
    */
    console.log("handleImagePress functionality is deactivated.");
  };

  // Stäng modalen
  const handleCloseModal = () => {
    setModalVisible(false);
    setImageComponents([]); 
  };

  // LOGS
  const handleVideoError = (error) => {
    console.log("Video error:", error);
  };

  const handleVideoLoad = () => {
    console.log("Video loaded");
  };

  const handleAudioError = (error) => {
    console.log("Audio error:", error);
  };

  const handleAudioLoad = () => {
    console.log("Audio loaded");
  };

  console.log('audios: ' + AudioUrls.length);
  console.log('video: ' + videoUrls.length);
  console.log('folders: ' + imageFolderUrls.length);

  if (loading) {
    return (
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" />
        { loading && videoUrls.length === 0 ? <Text>No videos found</Text> : <ActivityIndicator size="large" />}
      </View>
    );
  }

  return (
    <ScrollView 
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
      <View style={styles.container}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Icon name="chevron-left" size={30} />
        </TouchableOpacity>
        <Text> Motiverande Ledarskap </Text>
        {!videoUrls.length ? <Text>{translateFromFile.noVideo}</Text> : <Text></Text>}
        {!loading ?
          videoUrls.map((urlObject, index) => (
            <Video
              key={index}
              isMuted={false}
              volume={1.0}
              source={{ uri: urlObject.url }}
              style={styles.video}
              useNativeControls={true}
              resizeMode="container"
              onError={handleVideoError}
              onLoad={handleVideoLoad}
            />
          )) : <ActivityIndicator size="large" />}
        {!AudioUrls.length ? <Text>{translateFromFile.noAudio}</Text> : <Text></Text>}
        {!loading ?
          AudioUrls.map((urlObject, index) => (
            <Video
              key={index}
              isMuted={false}
              volume={1.0}
              source={{ uri: urlObject.url }}
              style={styles.audio}
              useNativeControls={true}
              resizeMode="container"
              onError={handleAudioError}
              onLoad={handleAudioLoad}
              // showPoster={true}
              // posterSource={require('../../../assets/favicon.png')}
            />
          )) : <ActivityIndicator size="large"/>}

        {!loading && imageFolderUrls.length > 0 && (
          <View style={styles.imageContainer}>
            {imageFolderUrls.map((folder, index) => (
              <TouchableOpacity key={index} style={styles.folderButton} onPress={() => handleImagePress(folder.folderName)}>
                <Text style={styles.folderText}>{folder.folderName}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Modal to show the images/pdf */}
        <Modal visible={modalVisible} transparent={true} onRequestClose={handleCloseModal}>
          {isImageLoaded && imageComponents.length > 0 && ( 
            <View style={styles.modalContainer}>
              <View style={styles.modalBackground} />
              <View style={styles.modalContent}>
                <Swiper index={selectedImageIndex} loop={false}>
                  {imageComponents.map((image, index) => (
                    <View key={index} style={styles.slide}>
                      <ScrollView
                        contentContainerStyle={styles.modalContent}
                        maximumZoomScale={10} // Maximum zoom
                        minimumZoomScale={1} // Minimum zoom
                        centerContent={true}
                      >
                        {image}
                      </ScrollView>
                    </View>
                  ))}
                </Swiper>
                {/* Close button */}
                <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>X</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    alignItems: 'center',
    marginBottom: 20,
  },
  video: {
    width: 320,
    height: 240,
    marginBottom: 20,
  },
  audio: {
    width: 320,
    height: 80,
    marginBottom: 20,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    paddingTop: 30,
    // top: 75,
    // bottom: 0,
    justifyContent: 'center',
  },
  text: {
    color: 'white'
  },
  imageContainer: {
    marginTop: 20,
  },
  folderButton: {
    width: 200,
    height: 50,
    marginBottom: 10,
    backgroundColor: stylesheet.colors.BLUE,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  folderText: {
    color: 'black',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'center',
  },
  Image: {
    width: '100%',
    height: '100%',
    resizeMode: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 45,
    right: 25,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 20,
  },
  closeButtonText: {
    fontSize: 21,
    fontWeight: 'bold',
    color: 'lightgrey',
  },
  swipeableView: {
    flex: 1,
    width: '100%',
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

export default Ledarskap;
