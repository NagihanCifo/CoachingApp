import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const LogoutPage = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    firebase.auth().signOut()
      .then(() => {
        console.log('Logout successful!');
        navigation.navigate('LoginPage');
      })
      .catch(console.error);
  };

  return (
    <View style={styles.container}>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

export default LogoutPage;
