import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, FlatList, Image, TouchableOpacity, Modal, Pressable, ScrollView, StatusBar } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, updateQuantity } from './CartSlice';
import Icon from 'react-native-vector-icons/FontAwesome';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const MainScreen = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);

  const getProducts = async () => {
    try {
      const response = await fetch('https://fakestoreapi.com/products');
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const starArray = Array(5).fill(0).map((_, index) => {
      if (index < fullStars) return 'star';
      if (index === fullStars && hasHalfStar) return 'star-half-o';
      return 'star-o';
    });
    return starArray.map((type, index) => (
      <Icon key={index} name={type} size={wp('4%')} color="#FFD700" />
    ));
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  const handleQuantityChange = (product, change) => {
    const currentQuantity = cartItems.find(item => item.id === product.id)?.quantity || 0;
    dispatch(updateQuantity({ id: product.id, quantity: currentQuantity + change }));
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={data}
          keyExtractor={({ id }) => id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setSelectedProduct(item)}>
              <View style={styles.card}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={styles.textContainer}>
                  <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
                    {item.title}
                  </Text>
                  <View style={styles.ratingContainer}>
                    {renderStars(item.rating.rate)}
                    <Text style={styles.ratingText}> {item.rating.count}  </Text>
                  </View>
                  <View style={styles.priceContainer}>
                    <Text style={styles.price}>Rs.{item.price}</Text>
                    {cartItems.find(cartItem => cartItem.id === item.id) ? (
                      <View style={styles.quantityContainer}>
                        <Pressable
                          style={styles.quantityButton}
                          onPress={() => handleQuantityChange(item, -1)}
                          disabled={cartItems.find(cartItem => cartItem.id === item.id)?.quantity <= 1}
                        >
                          <Text style={styles.quantityButtonText}>-</Text>
                        </Pressable>
                        <Text style={styles.quantityText}>{cartItems.find(cartItem => cartItem.id === item.id)?.quantity || 0}</Text>
                        <Pressable
                          style={styles.quantityButton}
                          onPress={() => handleQuantityChange(item, 1)}
                        >
                          <Text style={styles.quantityButtonText}>+</Text>
                        </Pressable>
                      </View>
                    ) : null}
                  </View>
                  <Text style={styles.category}>Category: {item.category}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
      {selectedProduct && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={!!selectedProduct}
          onRequestClose={() => setSelectedProduct(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalView}>
              <ScrollView contentContainerStyle={styles.modalContent}>
                <Image source={{ uri: selectedProduct.image }} style={styles.modalImage} />
                <View style={styles.modalDescriptionContainer}>
                  <Text style={styles.modalDescriptionLabel}>Description:</Text>
                  <Text style={styles.modalDescriptionText}>{selectedProduct.description}</Text>
                </View>
                <View style={styles.buttonContainer}>
                  <Pressable
                    style={[styles.button, styles.buttonAddToCart]}
                    onPress={() => {
                      handleAddToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                  >
                    <View style={styles.buttonTextContainer}>
                      <Icon name="shopping-cart" size={wp('4%')} color="#fff" />
                      <Text style={styles.buttonText}> Add to Cart</Text>
                    </View>
                  </Pressable>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => setSelectedProduct(null)}
                  >
                    <Text style={styles.buttonText}>Close</Text>
                  </Pressable>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingHorizontal: wp('2.5%'),
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: hp('1%'),
    marginHorizontal: hp('1%'),
    padding: wp('4%'),
    height: hp('20%'), 
    backgroundColor: '#fff',
    borderRadius: wp('2.5%'),
    borderWidth: 1,
    borderColor: '#B8B8B8',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
  },
  image: {
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: wp('2.5%'),
    marginRight: wp('2.5%'),
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    lineHeight: hp('2.5%'),  
    overflow: 'hidden',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('0.5%'),
    justifyContent: 'space-between',
  },
  price: {
    fontSize: wp('4%'),
    color: 'black',
    fontWeight: 'bold',
    marginRight: wp('2.5%'),
  },
  category: {
    fontSize: wp('3.5%'),
    color: '#555',
    marginTop: hp('0.5%'),
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('0.5%'),
  },
  ratingText: {
    fontSize: wp('3.5%'),
    color: '#555',
    marginLeft: wp('1%'),
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    borderRadius: wp('1.5%'),
    padding: wp('1%'),
    paddingHorizontal: wp('2.5%'),
    backgroundColor: '#ddd',
    marginHorizontal: wp('1%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    marginHorizontal: wp('2.5%'),
    color: 'black',
  },
  quantityButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  button: {
    borderRadius: wp('2.5%'),
    padding: wp('2.5%'),
    elevation: 2,
    width: '48%',
    alignItems: 'center',
  },
  buttonAddToCart: {
    backgroundColor: '#ff0000',
  },
  buttonClose: {
    backgroundColor: '#888',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: wp('2.5%'),
    paddingVertical: hp('2.5%'),
    paddingHorizontal: wp('2.5%'),
    width: '90%',
    maxHeight: '80%',
  },
  modalContent: {
    alignItems: 'center',
  },
  modalImage: {
    width: wp('30%'),
    height: wp('30%'),
    marginBottom: hp('2%'),
  },
  modalDescriptionContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: hp('2.5%'),
    width: '100%',
  },
  modalDescriptionLabel: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    flex: 1,
  },
  modalDescriptionText: {
    fontSize: wp('4%'),
    flex: 2,
    textAlign: 'left',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});
