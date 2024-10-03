import React from "react";
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Image, Modal } from "react-native";
import { useEffect, useState } from "react";
import { Video } from "expo-av";
import { ActivityIndicator } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { useSelector } from "react-redux";
import Icon from 'react-native-vector-icons/Feather';
import Sv from '../../languages/Sv';
import Eng from '../../languages/Eng';
import Ar from '../../languages/Ar';
// import fetchData from '../../utils/fetchData';
// import { getLanguagePath } from "../../utils/languagePath";
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage"; // Commented out Firebase imports

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
    // const languagePath = getLanguagePath(language);

    const goBack = () => {
        navigation.goBack();
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // Uncomment if fetching folders is necessary in the future
            // fetchImageFolders(`MotiverandeLedarskap/${languagePath}/images/`, setImageFolderUrls, setLoading);
        });
        return unsubscribe;
    }, [navigation]);

    // Showing the preloaded data in Kommunikation
    useEffect(() => {
        const fetchStoredUrls = async () => {
            /* try {
                const storedVideoUrls = await AsyncStorage.getItem('videoUrls');
                if (storedVideoUrls) {
                    setVideoUrls(JSON.parse(storedVideoUrls));
                } else {
                    const urls = await fetchData('videos', `MotiverandeLedarskap/${languagePath}/videos/`, setLoading);
                    setVideoUrls(urls);
                }

                const storedAudioUrls = await AsyncStorage.getItem('AudioUrls');
                if (storedAudioUrls) {
                    setAudioUrls(JSON.parse(storedAudioUrls));
                } else {
                    const urls = await fetchData('audios', `MotiverandeLedarskap/${languagePath}/audios/`, setLoading);
                    setAudioUrls(urls);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching stored URLs:", error);
            } */
            // Temporarily setting loading to false for testing
            setLoading(false);
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

    // Commenting out fetchImageFolders function
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
        // Placeholder function; currently does nothing
        // Uncomment and implement if needed in the future
        /*
        const folderPath = `MotiverandeLedarskap/${languagePath}/images/${folderName}/`;
        const storage = getStorage();
        const listRef = ref(storage, folderPath);
        const res = await listAll(listRef);
        const urls = await Promise.all(
            res.items.map(async (itemRef) => {
                const url = await getDow
