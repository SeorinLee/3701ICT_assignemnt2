// 3701/assignmnet2/src/screens/ProductDetail.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { addToCart as addToCartAction } from '../store/actions';

const ProductDetailScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchProductDetail();
  }, []);

  const fetchProductDetail = async () => {
    try {
      const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
      const data = await response.json();
      setProduct(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product details:', error);
      setLoading(false);
    }
  };

  const addToCart = () => {
    dispatch(addToCartAction(product)); // Redux 액션 디스패치
    console.log('Product added to cart:', product);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <View style={styles.item}>
          <Image source={{ uri: product.image }} style={styles.image} />
          <View style={styles.details}>
            <Text style={styles.title}>{product.title}</Text>
            <View style={styles.infoContainer}>
              <Text style={styles.price}>Price: ${product.price}</Text>
              <Text style={styles.rate}>Rate: {product.rating.rate}</Text>
              <Text style={styles.sold}>Sold: {product.rating.count}</Text>
            </View>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <View style={styles.buttonContent}>
                  <Ionicons name="backspace-outline" size={25} color="white" />
                  <Text style={styles.buttonText}>Back</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cartButton} onPress={addToCart}>
                <View style={styles.buttonContent}>
                  <Ionicons name="cart" size={25} color="white" />
                  <Text style={styles.buttonText}>Add to Cart</Text>
                </View>
              </TouchableOpacity>
            </View>
            <Text style={styles.descriptionTitle}>DESCRIPTION</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEE3CB',
  },
  item: {
    width: '90%',
    height: '98%',
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#B7C4CF',
    borderRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  image: {
    backgroundColor: 'white',
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    borderColor: '#697178', 
    borderWidth: 2, 
    borderRadius: 10,
  },
  details: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3e484f',
    marginBottom: 10,
    marginVertical: 20,
  },
  infoContainer: {
    justifyContent: 'space-evenly', 
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#98a8b5',
    borderColor: '#697178', 
    borderWidth: 2, 
    borderRadius: 10,
    height: 50,
    width:'100%',
    color: '#475159',
  },
  price: {
    fontSize: 17,
    paddingLeft: 10,
  },
  rate: {
    fontSize: 17,
    paddingLeft: 29,
    marginRight: 35,
  },
  sold: {
    fontSize: 17,
    marginRight: 10,
  },
  descriptionTitle: {
    color: '#3e484f',
    paddingTop: 15,
    paddingBottom: 5,
    alignSelf: 'flex-start',
    fontWeight: 'bold',
    fontSize: 17,
  },
  description: {
    fontSize: 14,
    color: '#333333',
    backgroundColor: '#98a8b5',
    borderRadius: 10,
    paddingTop: 5,
    paddingLeft: 5,
    paddingRight:5,
    paddingBottom:5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  backButton: {
    backgroundColor: '#967E76',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  cartButton: {
    backgroundColor: '#967E76',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default ProductDetailScreen;
