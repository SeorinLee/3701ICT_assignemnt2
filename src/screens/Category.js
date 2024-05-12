// 3701/assignmnet2/src/screens/Category.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';

const CategoryScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://fakestoreapi.com/products/categories');
      const data = await response.json();
      setCategories(data.map(category => category.toUpperCase())); 
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoading(false);
    }
  };

  const navigateToProductList = (category) => {
    navigation.navigate('ProductList', { category: category.toLowerCase() }); 
  };

  const getCategoryStyle = (category) => {
    switch (category) {
      case "ELECTRONICS":
        return styles.electronics;
      case "JEWELRY":
        return styles.jewelry;
      case "MEN'S CLOTHING":
        return styles.mensClothing;
      case "WOMEN'S CLOTHING":
        return styles.womensClothing;
      default:
        return styles.category;
    }
  };

  return (
    <View style={styles.container}>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        categories.map((category, index) => (
          <TouchableOpacity key={index} style={[styles.category, getCategoryStyle(category)]} onPress={() => navigateToProductList(category)}>
            <Text style={[styles.categoryText, getCategoryTextStyle(category)]}>{category}</Text>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
};

const getCategoryTextStyle = (category) => {
  switch (category) {
    case "ELECTRONICS":
      return styles.electronicsText;
    case "JEWELERY":
      return styles.jeweleryText;
    case "MEN'S CLOTHING":
      return styles.mensClothingText;
    case "WOMEN'S CLOTHING":
      return styles.womensClothingText;
    default:
      return null;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    width: '100%',
    height: '25%',
    fontSize: 50,
    fontWeight: 'bold',
    marginBottom: 0,
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: '#607274',
    color: '#2a3738',
  },
  category: {
    height: '25%',
    backgroundColor: '#DED0B6',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 25,
    marginVertical: 0,
    justifyContent: 'center',
    color: '#857c6d',
  },
  categoryText:{
    color: '#857c6d',
  },
  electronics: {
    backgroundColor: '#FAEED1',
  },
  electronicsText: {
    color: '#787266',
  },
  jewelery: {
    backgroundColor: '#DED0B6',
  },
  jeweleryText: {
    color: '#635e53',
  },
  mensClothing: {
    backgroundColor: '#B2A59B',
  },
  mensClothingText: {
    color: '#4f4945',
  },
  womensClothing: {
    backgroundColor: '#9c9087',
  },
  womensClothingText: {
    color: '#3b3632',
  },
  categoryText: {
    textAlignVertical: 'center',
    color: 'black',
    fontSize: 25,
    fontWeight: 'bold',
  },


});

export default CategoryScreen;
