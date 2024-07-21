import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/components/stroe/Store';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from './src/components/MainScreen';
import CartScreen from './src/components/CartScreen';
import { Text, View, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Shopping">
          <Stack.Screen
            name="Shopping"
            component={MainScreen}
            options={{
              headerTitle: () => (
                <View style={styles.headerTitleContainer}>
                  <Text style={styles.headerTitleText}>Shopping</Text>
                </View>
              ),
              headerTitleAlign: 'center',  
              headerStyle: {
                backgroundColor: '#3FD7C8',  
              },
              headerTintColor: '#fff',  
            }}
          />
          <Stack.Screen name="Cart" component={CartScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

const styles = StyleSheet.create({
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleText: {
    fontSize: wp('5%'),  
    fontWeight: 'bold',
    color: 'black',  
  },
});

export default App;
