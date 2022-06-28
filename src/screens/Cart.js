import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {cartItemSelector} from '../redux/selectors/product.selector';
import {
  incrementQty,
  removeCartList,
  decrementQty,
} from '../redux/action/cart.action';
import Toast from 'react-native-toast-message';
import StarRating from 'react-native-star-rating';
///////////// reuseable components ////////////////
import Button from '../reusable/Button';
import OrderButton from '../reusable/OrderButton';
import CardBottomButton from '../reusable/CardBottomButton';

const Cart = props => {
  const dispatch = useDispatch();
  const cartProductData = useSelector(cartItemSelector, shallowEqual);

  const [counter, setCounter] = useState(0);
  const [favoriteList1, setFavoruiteList1] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState([]);
  const [checkOut, setCheckOut] = useState([]);

  console.log('data----->', cartProductData);

  let priceData = cartProductData;
  let grandTotal = 0;
  let totalPrice = 0;
  console.log(
    priceData.map((item, index) => {
      console.log('indexindex------->', item.cartItem.price);
      totalPrice += item.cartItem.price * item.cartItem.qty;
      grandTotal = totalPrice + 6;
    }),
  );
  // console.log('==========totalPrice======>', totalPrice);
  const renderItem = ({item, index}) => {
    // console.log('item-----item---index->', item.cartItem, index);
    return (
      <Item
        // id={item.cartItem.id}
        // title={item.cartItem.title}
        // price={item.cartItem.price}
        // image={item.cartItem.image}
        // category={item.cartItem.category}
        // rating={item.cartItem.rating}
        // qty={item.cartItem.qty}
        item={item}
        index={index}
      />
    );
  };

  const Item = ({item, index}) => {
    const {id, title, price, description, category, image, rating, count, qty} =
      item?.cartItem;

    return (
      <View style={styles.mainContainer}>
        <View style={styles.cardContainer}>
          <View style={styles.cardContainerInner}>
            <View style={{width: '40%'}}>
              <Image
                style={styles.productImage}
                source={{
                  uri:
                    image ||
                    'https://upload.wikimedia.org/wikipedia/commons/d/d1/Image_not_available.png',
                }}
              />
            </View>

            <View style={{width: '60%'}}>
              <Text>{title}</Text>
              <Text>$ {price}</Text>
              <StarRating
                containerStyle={{width: 50}}
                starStyle={{width: 30, height: 20}}
                starSize={20}
                disabled={false}
                maxStars={5}
                rating={rating}
                fullStarColor={'green'}
                // selectedStar={(rating) => this.onStarRatingPress(rating)}
              />

              <View style={styles.counterContainer}>
                <Button
                  title={'-'}
                  textStyle={{fontSize: 25}}
                  style={styles.decrementStyle}
                  onPress={() => {
                    decrement(item, index);
                  }}
                />

                <Text style={{fontSize: 25}}>{qty}</Text>

                <Button
                  title={'+'}
                  textStyle={{fontSize: 25}}
                  style={styles.decrementStyle}
                  onPress={() => {
                    increment(item, index);
                  }}
                />
              </View>
            </View>
          </View>

          <View style={styles.bottomBtnContainer}>
            <CardBottomButton
              title={'Save for later'}
              titleStyle={styles.btn}
              onPress={() => {
                alert('Save for later pressed!');
              }}
            />
            <CardBottomButton
              title={'Remove'}
              titleStyle={styles.btn}
              onPress={() => {
                onRemoveFavorite(item?.cartItem);
              }}
            />
            <CardBottomButton
              title={'Buy this now'}
              titleStyle={styles.btn}
              onPress={() => {
                buyNow(item?.cartItem);
              }}
            />
          </View>
        </View>
      </View>
    );
  };

  const listEmptyComponent = () => {
    return (
      <View style={styles.noDataFound}>
        <Text style={styles.noDataFoundText}>No Data Found..!</Text>
      </View>
    );
  };

  const decrement = (product, index) => {
    if (counter === 0) {
      return;
    } else console.log('false');

    dispatch(decrementQty(product, index));
    setCounter(product.cartItem.qty - 1);
  };

  const increment = (product, index) => {
    dispatch(incrementQty(product, index));
    setCounter(product.cartItem.qty + 1);
  };

  const onRemoveFavorite = removeProducts => {
    dispatch(removeCartList(removeProducts));
    const filteredList = favoriteList1.filter(
      item => item.id !== removeProducts.id,
    );
    setFavoruiteList1(filteredList);
    Toast.show({
      type: 'error',
      text1: `${removeProducts.title}`,
      text2: `removed`,
    });
  };

  const buyNow = orderDetail => {
    console.log('---orderDetail-->', orderDetail);
    setOrderPlaced([...orderPlaced, orderDetail]);
    props.navigation.navigate('PlaceOrderScreen', {
      orderPlaced: orderPlaced.length > 0 ? orderPlaced : [],
    });
    // props.navigation.navigate('PlaceOrderScreen');
  };

  const stickyFooter = () => {
    return (
      <>
        <View style={styles.footerStyle}>
          <OrderButton
            priceText={totalPrice || '0'}
            texText={'6'}
            grandTotal={grandTotal}
            rippleStyle={styles.placeOrderBtn}
            placeOrderText={'Place Order'}
            textStyle={styles.placeOrderText}
            onPress={() => {
              props.navigation.navigate('PlaceOrderScreen');
              // props.navigation.navigate('PlaceOrderScreen', {
              //   favoriteList: favoriteList.length > 0 ? favoriteList : [],
              // })
            }}
          />
        </View>
      </>
    );
  };

  return (
    <View style={{flex: 1}}>
      {cartProductData && (
        <FlatList
          data={cartProductData}
          renderItem={renderItem}
          keyExtractor={(item, index) => index}
          // ListFooterComponent={footer}
          ListEmptyComponent={listEmptyComponent}
          style={{flex: 1}}
        />
      )}
      <View style={styles.headerStyle}>{stickyFooter()}</View>
    </View>
  );
};

export default Cart;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#eee',
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  cardContainer: {backgroundColor: '#fff', width: '100%', paddingTop: 10},
  cardContainerInner: {flexDirection: 'row', alignItems: 'center'},
  productImage: {width: 150, height: 150, resizeMode: 'contain'},
  bottomBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    padding: 10,
    marginTop: 20,
    height: 50,
    alignItems: 'center',
  },
  btn: {fontSize: 16, fontWeight: 'bold'},
  counterContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
    width: '50%',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  decrementStyle: {
    backgroundColor: '#eee',
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    width: 35,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  incrementStyle: {
    backgroundColor: '#eee',
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    width: 35,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerStyle: {
    flex: 0.1,
    // width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    // shadow ios start //
    backgroundColor: '#fff',
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 1},
    shadowOpacity: 10,
    shadowRadius: 3,
    // shadow ios end //
  },
  footerStyle: {
    flex: 1,
    width: '101%',
    padding: 8,
    elevation: 2,
  },
  placeOrderBtn: {
    backgroundColor: '#C65D7B',
    justifyContent: 'center',
    alignItems: 'center',
    width: 180,
    height: 40,
    borderRadius: 2,
  },
  placeOrderText: {fontSize: 18, color: '#fff', fontWeight: 'bold'},
});
