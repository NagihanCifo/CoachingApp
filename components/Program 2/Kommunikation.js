import React from "react";
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Image, Modal, TouchableWithoutFeedback, Dimensions } from "react-native";
import { useEffect, useState } from "react";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { Video } from "expo-av";
import { ActivityIndicator } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { useSelector } from "react-redux";
import Icon from 'react-native-vector-icons/Feather';
import Sv from '../../languages/Sv';
import Eng from '../../languages/Eng';
import Ar from '../../languages/Ar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Swiper from 'react-native-swiper';
import stylesheet from '../../stylesheet';
import firebaseConfig from "../../../firebaseConfig";

// Getting device dimensions for styling
const { width, height } = Dimensions.get('window');

const Kommunikation = () => {
  const [videoUrls, setVideoUrls] = useState([]);
  const [AudioUrls, setAudioUrls] = useState([]);
  const [imageFolderUrls, setImageFolderUrls] = useState([]); 
  const [imageComponents, setImageComponents] = useState([]);

  // Modal and image handling
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();
  const language = useSelector((state) => state.language); 
  const translations = language === 'Sv' ? Sv : language === 'Ar' ? Ar : Eng; 
  const languagePath = getLanguagePath(language);

  const goBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    // Fetch image folders when component mounts
    // Uncomment the line below if you need to fetch image folders from Firebase
    // fetchImageFolders(`Kommunikation/${languagePath}/images/`, setImageFolderUrls, setLoading);
    return () => {
      // Cleanup if necessary
    };
  }, [navigation, languagePath]);

  // Image press handler
  const handleImagePress = async (folderName) => {
    const folderPath = `Kommunikation/${languagePath}/images/${folderName}/`;
    const storage = getStorage();
    const listRef = ref(storage, folderPath);
    const res = await listAll(listRef);
    const urls = await Promise.all(
      res.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        return { url };
      })
    );
    const imageComponents = urls.map((urlObject, index) => (
      <Image key={index} source={{ uri: urlObject.url }} style={styles.image} />
    ));
    setImageComponents(imageComponents);
    setIsImageLoaded(true);
    setModalVisible(true);
    setSelectedImageIndex(0);
  };

  // Close modal handler
  const handleCloseModal = () => {
    setModalVisible(false);
    setImageComponents([]); 
  };

  // Logging errors
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

  // Loading indicator and content display
  if (loading) {
    return (
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" />
        {loading && videoUrls.length === 0 ? <Text>No videos found</Text> : <ActivityIndicator size="large" />}
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
      <View style={styles.container}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Icon name="chevron-left" size={30} />
        </TouchableOpacity>
        <Text>Kommunikation</Text>
        {!videoUrls.length ? <Text>{translations.noVideo}</Text> : null}
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
          )) : <ActivityIndicator size="large" />
        }
        {!AudioUrls.length ? <Text>{translations.noAudio}</Text> : null}
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
            />
          )) : <ActivityIndicator size="large"/>
        }

        {!loading && imageFolderUrls.length > 0 && (
          <View style={styles.imageContainer}>
            {imageFolderUrls.map((folder, index) => (
              <TouchableOpacity key={index} style={styles.folderButton} onPress={() => handleImagePress(folder.folderName)}>
                <Text style={styles.folderText}>{folder.folderName}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Modal for displaying images */}
        <Modal visible={modalVisible} transparent={true} onRequestClose={handleCloseModal}>
          {isImageLoaded && imageComponents.length > 0 && (
            <View style={styles.modalContainer}>
              <TouchableWithoutFeedback onPress={handleCloseModal}>
                <View style={styles.modalBackground} />
              </TouchableWithoutFeedback>
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

// Style definitions
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
    justifyContent: 'center',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: width,
    height: height,
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
});

export default Kommunikation;
