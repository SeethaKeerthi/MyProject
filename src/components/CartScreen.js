import React from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { incrementQuantity, decrementQuantity } from './CartSlice';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const CartScreen = () => {
  const cart = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
            <View style={styles.buttonContainer}>
              <Button title="+" onPress={() => dispatch(incrementQuantity(item.id))} />
              <Button title="-" onPress={() => dispatch(decrementQuantity(item.id))} />
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp('5%'), // Responsive padding
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: hp('1%'), // Responsive margin
    padding: wp('4%'), // Responsive padding
    backgroundColor: '#f9f9f9',
    borderRadius: wp('2%'), // Responsive border radius
    elevation: 2, // Add shadow effect for Android
    shadowColor: '#000', // Shadow effect for iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemTitle: {
    fontSize: wp('4%'), // Responsive font size
    flex: 1,
  },
  itemQuantity: {
    fontSize: wp('3.5%'), // Responsive font size
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default CartScreen;
