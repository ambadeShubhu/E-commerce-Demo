import {StyleSheet, Text, SafeAreaView, View} from 'react-native';
import React from 'react';
import {useRoute} from '@react-navigation/native';

const PlaceOrderScreen = () => {
  const route = useRoute();
  const {orderPlaced} = route.params;
  console.log(
    'favoriteListfavoriteListfavoriteList->----------->',
    orderPlaced,
  );
  return (
    <SafeAreaView>
      <Text>PlaceOrderScreen</Text>
    </SafeAreaView>
  );
};

export default PlaceOrderScreen;

const styles = StyleSheet.create({});
