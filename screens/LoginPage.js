import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Dimensions, TouchableOpacity, Text, Alert } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import firebaseConfig from '../../firebaseConfig';

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const { width } = Dimensions.get('window');

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = () => {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        console.log(userCredential.user);
        navigation.navigate("HomePage");
      })
      .catch(({ message }) => {
        if (message.includes('auth/wrong-password')) {
          Alert.alert('Invalid Password', 'The password you entered is invalid.', [{ text: 'OK' }]);
        } else if (message.includes('auth/user-not-found')) {
          Alert.alert('No user found', 'Please enter a valid email address and try again.', [{ text: 'OK' }]);
        }
      });
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <View style={styles.passwordContainer}>
        <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
        <TouchableOpacity onPress={() => navigation.navigate('PasswordResetPage')}>
          <Text style={styles.forgotPassword}> Forgot Password? </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}> LOGIN </Text>
      </TouchableOpacity>
      <View style={styles.registerContainer}>
        <Text style={styles.registerText}> Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
          <Text style={styles.registerButtonText}> Sign up here </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, width, justifyContent: 'center', alignItems: 'stretch', paddingHorizontal: 20 },
  input: { width: '100%', height: 50, paddingHorizontal: 10, fontSize: 16, borderWidth: 1, borderColor: 'gray', borderRadius: 10, marginBottom: 20 },
  button: { width: '100%', height: 50, backgroundColor: 'blue', borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  buttonText: { fontSize: 18, color: 'white', fontWeight: 'bold' },
  passwordContainer: { flexDirection: 'column', alignItems: 'center', marginTop: 20, marginBottom: 15 },
  forgotPassword: { fontSize: 15, color: 'grey', marginLeft: 200 },
  registerContainer: { position: 'absolute', width: '100%', bottom: '5%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  registerText: { fontSize: 16 },
  registerButtonText: { fontSize: 16, fontWeight: 'bold' },
});

export default LoginPage;
