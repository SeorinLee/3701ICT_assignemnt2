//Splash.js
import React, { useEffect, useState } from 'react';
import { StyleSheet, ImageBackground, View, Text, Image } from 'react-native';

const Splash = ({ navigation }) => {
  const [blink, setBlink] = useState(true); 

  useEffect(() => {
    const interval = setInterval(() => {
      setBlink((prevBlink) => !prevBlink); 
    }, 700); 

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (navigation) { 
        navigation.replace('Category'); 
      }
    }, 3000); 

    return () => clearTimeout(timer);
  }, [navigation]); 

  return (
    <ImageBackground
      style={styles.background}
    >
      <View style={styles.container}>
        <Image source={require('../../assets/shopping.gif')} style={styles.gif} />
        <Text style={[styles.title, blink ? styles.blink : null]}>Fake Store</Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  container: {
    alignItems: 'center',
  },
  gif: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000', 
  },
  subtitle: {
    fontSize: 16,
    color: '#000000', 
    marginTop: 10,
  },
  blink: {
    opacity: 0, 
  },
});

export default Splash;
