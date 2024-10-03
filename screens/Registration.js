import React, { useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import firebaseConfig from '../../firebaseConfig';

firebase.initializeApp(firebaseConfig);

const { width } = Dimensions.get('window');
navigator;

const Registration = () => {
  const navToStart = useNavigation();
  const [currentPage, setCurrentPage] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleNameChange = (text) => {
    setName(text);
  };

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  const handleNextPress = () => {
    setCurrentPage(currentPage + 1);
  };

  // RegEx kontroll av email
  const isEmailValid = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  // Skapar användarkonto & uppdaterar databasen
  const handleRegisterPress = async () => {
    try {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      const userRef = firebase.firestore().collection('users').doc(user.uid);
      userRef.set({
        name: name,
        email: email,
        password: password,
      });

      navToStart.navigate('HomePage');

    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, errorMessage);
    }
  };

  return (
    //<ScrollView horizontal={true} pagingEnabled={true} showsHorizontalScrollIndicator={false}>
    <View style={styles.container}>
      {currentPage === 0 && (
        <View style={styles.pageContainer}>
          <Text style={styles.title}>What's your name?</Text>
          <TextInput style={styles.input} placeholder="First and lastname" value={name} onChangeText={handleNameChange} />
          <TouchableOpacity style={[styles.button, (!name) ? styles.buttonDisabled : null]} onPress={handleNextPress} disabled={!name}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}
      {currentPage === 1 && (
        <View style={styles.pageContainer}>
          <Text style={styles.title}>What's your email address?</Text>
          <TextInput style={styles.input} placeholder="Email adress" value={email} onChangeText={handleEmailChange} />
          <TouchableOpacity style={[styles.button, !email || !isEmailValid(email) ? styles.buttonDisabled : null]} onPress={handleNextPress} disabled={!email || !isEmailValid(email)}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}
      {currentPage === 2 && (
        <View style={styles.pageContainer}>
          <Text style={styles.title}>Choose a password</Text>
          <TextInput style={styles.input} placeholder="Password" secureTextEntry={true} value={password} onChangeText={handlePasswordChange} />
          <TouchableOpacity style={[styles.button, !password || password.length <= 7 ? styles.buttonDisabled : null]} onPress={handleRegisterPress} disabled={!password || password.length <= 7}>
            <Text style={styles.buttonText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      )}
      {currentPage === 3 && (
        <View style={styles.pageContainer}>
          <Text style={styles.title}>Your account has been created!</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    paddingHorizontal: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    marginBottom: 20,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#0000FF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: '#ADD8E6',
  },
});

export default Registration;
