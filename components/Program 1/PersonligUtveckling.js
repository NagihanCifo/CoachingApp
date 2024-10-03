import React from "react";
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Image, Modal, TouchableWithoutFeedback } from "react-native";
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
// import * as FileSystem from "expo-file-system";
// import fetchData from '../../utils/fetchData';
// import { getLanguagePath } from "../../utils/languagePath";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Swiper from 'react-native-swiper';
import stylesheet from '../../stylesheet';

const PersonligUtveckling = () => {
    const [videoUrls, setVideoUrls] = useState([]);
    const [AudioUrls, setAudioUrls] = useState([]);
    const [imageFolderUrls, setImageFolderUrls] = useState([]); // Mappen där bilderna ligger i
    const [imageComponents, setImageComponents] = useState([]); // Bilderna i mappen

    // Hanterar modalen
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [loading, setLoading] = useState(true);

    const navigation = useNavigation();
    const language = useSelector((state) => state.language); // Hämta valt språk från redux store
    const translations = language === 'Sv' ? Sv : language === 'Ar' ? Ar : Eng; // Hämtar översättningen för de olika språken
    // const languagePath = getLanguagePath(language);

    const goBack = () => {
        navigation.goBack();
    };

    useEffect(() => {
        // const unsubscribe = navigation.addListener('focus', () => {
        //     fetchImageFolders(`PersonligUtveckling/${languagePath}/images/`, setImageFolderUrls, setLoading);
        // });
        // return unsubscribe;
    }, [navigation]);

    /*
    Showing the preloaded data in Kommunikation
    useEffect(() => {
        const fetchStoredUrls = async () => {
            try {
                const storedVideoUrls = await AsyncStorage.getItem('videoUrls');
                if (storedVideoUrls) {
                    setVideoUrls(JSON.parse(storedVideoUrls));
                } else {
                    const urls = await fetchData('videos', `PersonligUtveckling/${languagePath}/videos/`, setLoading);
                    setVideoUrls(urls);
                }

                const storedAudioUrls = await AsyncStorage.getItem('AudioUrls');
                if (storedAudioUrls) {
                    setAudioUrls(JSON.parse(storedAudioUrls));
                } else {
                    const urls = await fetchData('audios', `PersonligUtveckling/${languagePath}/audios/`, setLoading);
                    setAudioUrls(urls);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching stored URLs:", error);
            }
        };

        fetchStoredUrls();
    }, []);
    */

    /*
    // Hantera laddning av den första bilden vid komponentens första render
    useEffect(() => {
        const loadFirstImage = async () => {
            if (imageComponents.length > 0) {
                await Image.prefetch(imageComponents[0].props.source.uri);
                setIsImageLoaded(true);
            }
        };
        loadFirstImage();
    }, []);

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
        const folderPath = `PersonligUtveckling/${languagePath}/images/${folderName}/`;
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
        <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
            <View style={styles.container}>
                <TouchableOpacity onPress={goBack} style={styles.backButton}>
                    <Icon name="chevron-left" size={30} />
                </TouchableOpacity>
                <Text>Personlig Utveckling</Text>
                {!videoUrls.length ? <Text>{translations.noVideo}</Text> : <Text></Text>}
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
                {!AudioUrls.length ? <Text>{translations.noAudio}</Text> : <Text></Text>}
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
                    )) : <ActivityIndicator size="large" />}

                {!loading && imageFolderUrls.length > 0 && (
                    <View style={styles.imageContainer}>
                        {imageFolderUrls.map((folder, index) => (
                            <TouchableOpacity key={index} style={styles.folderButton} onPress={() => handleImagePress(folder.folderName)}>
                                <Text style={styles.folderText}>{folder.folderName}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* Modal för att visa bilderna */}
                <Modal visible={modalVisible} transparent={true} onRequestClose={handleCloseModal}>
                    {isImageLoaded && imageComponents.length > 0 && ( // Visa modalen endast om den första bilden är laddad och det finns bilder att visa
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
    });
     
     
    export default PersonligUtveckling;
     