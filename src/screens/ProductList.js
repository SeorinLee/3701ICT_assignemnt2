//ProductList.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

const ProductListScreen = ({ route, navigation }) => {
  const { category } = route.params;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState(Date.now().toString()); 

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setKey(Date.now().toString()); 
  }, [products]); 

  const fetchProducts = async () => {
    try {
      const response = await fetch(`https://fakestoreapi.com/products/category/${category}`);
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.price}>Price: ${item.price}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <FlatList
            data={products}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
            key={key} 
            numColumns={1} 
          />
        )}
      </View>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
  <View style={styles.backButtonContent}>
    <Ionicons name="backspace-outline" size={25} color="white" />
    <Text style={styles.backButtonText}>Category</Text>
  </View>
</TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#EEE3CB',
    paddingBottom: 80,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#EEE3CB',
    borderColor: '#697178',
    borderWidth: 2,
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  list: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D7C0AE',
  },
  item: {
    width: '98%', 
    marginVertical: 4,
    padding: 10,
    backgroundColor: '#B7C4CF',
    borderRadius: 10,
    alignSelf: 'center', 
    flexDirection: 'row', 
    borderColor: '#697178', 
    borderWidth: 2, 
    borderRadius: 10,
  },
  image: {
    width: 130,
    height: 130,
    resizeMode: 'contain', 
    borderRadius: 10,
    borderColor: '#697178', 
    borderWidth: 2, 
    borderRadius: 10,
    backgroundColor: 'white',
  },
  textContainer: {
    flex: 1, 
    marginLeft: 5, 
    backgroundColor: '#98a8b5',
    borderRadius: 10,
    paddingTop: 5,
    paddingLeft: 5,
    paddingRight: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3e484f',
  },
  price: {
    paddingTop: 20,
    fontSize: 14,
    color: '#475159',
    marginTop: 2,
  },
  backButton: {
    position: 'absolute',
    bottom: 30,
    backgroundColor: '#967E76',
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginLeft: 5,
    borderRadius: 5,
    alignSelf: 'center', 
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    
  },
  backButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ProductListScreen;
