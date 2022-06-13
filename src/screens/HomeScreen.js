import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';
import {useNavigation, useRoute} from '@react-navigation/native';

import {productList} from '../redux/action/product.action';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  cartItemSelector,
  favoriteItemSelector,
  productListSelector,
} from '../redux/selectors/product.selector';
import {ToggleModal} from '../reusable/Model';
import {cartList} from '../redux/action/cart.action';
import {favItemList, removeFavItemList} from '../redux/action/favorite.action';

const HomeScreen = () => {
  const navigation = useNavigation();
  const favItemData = useSelector(favoriteItemSelector, shallowEqual);
  const dispatch = useDispatch();
  const productData = useSelector(productListSelector, shallowEqual);
  const itemCart = useSelector(cartItemSelector, shallowEqual);

  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [btnText, setBtnText] = useState(
    <Icon name="grid" size={30} color={'#C65D7B'} />,
  );

  const [favoriteList, setFavoruiteList] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [gridColumn, setGridColumn] = useState(true);

  useEffect(() => {
    setLoading(true);
    dispatch(productList(limit));
    setLoading(false);
  }, [limit]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const modalOpen = item => {
    setModalData(item);
    toggleModal();
  };

  const listEmptyComponent = () => {
    return (
      <View style={styles.noDataFound}>
        <Text style={styles.noDataFoundText}>No Data Found..!</Text>
      </View>
    );
  };

  const Item = item => {
    const {id, title, price, description, category, image, rating, count} =
      item;
    return (
      <View
        style={[
          styles.itemStyle,
          {
            width: gridColumn ? '90%' : '45%',
            marginHorizontal: gridColumn ? 18 : 10,
          },
        ]}>
        <TouchableOpacity style={{}} onPress={() => modalOpen(item)}>
          <View
            style={[
              styles.productImgContainer,
              {width: gridColumn ? 350 : 200},
            ]}>
            <Image
              style={styles.productImage}
              source={{
                uri:
                  image ||
                  'https://upload.wikimedia.org/wikipedia/commons/d/d1/Image_not_available.png',
              }}
            />

            <TouchableOpacity
              style={[
                styles.icon,
                {right: gridColumn ? 10 : 20, top: gridColumn ? 10 : 1},
              ]}
              onPress={() =>
                ifExists(item) ? onRemoveFavorite(item) : onFavorite(item)
              }>
              <Icon
                name={ifExists(item) ? 'heart' : 'heart-outline'}
                size={gridColumn ? 32 : 22}
                color={'#C65D7B'}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <View style={styles.informationContainer}>
          <View style={{flex: 1}}>
            <Text>{category}</Text>
            <Text style={{fontSize: 14, marginTop: 4}}>{title}</Text>
            <Text style={{fontSize: 16, marginTop: 4, fontWeight: 'bold'}}>
              ${price}
            </Text>
          </View>

          <View style={styles.ratingStyleContainer}>
            <Text
              style={[
                styles.ratingStyle,
                {
                  color: rating > 3 ? 'green' : 'orange',
                  borderColor: rating > 3 ? 'green' : 'orange',
                },
              ]}>
              {rating}
            </Text>
          </View>
        </View>
        <ToggleModal
          isVisible={isModalVisible}
          backdropColor={'#eee'}
          backdropOpacity={0.7}
          // onSwipeComplete={() => toggleModal()}
          onBackdropPress={() => toggleModal()}
          toggleModal={toggleModal}
          data={modalData}
          addToCart={() => addItemCart(modalData)}
        />
      </View>
    );
  };

  const addItemCart = item => {
    dispatch(cartList(item));
    navigation.navigate('Cart');
    toggleModal();
    // alert('add item to cart');
  };

  const onFavorite = addProducts => {
    dispatch(favItemList(addProducts));
    setFavoruiteList([...favoriteList, addProducts]);
    Toast.show({
      type: 'success',
      text1: `${addProducts.title}`,
      text2: `added to Favorite`,
    });
  };

  const onRemoveFavorite = removeProducts => {
    dispatch(removeFavItemList(removeProducts));
    const filteredList = favoriteList.filter(
      item => item.id !== removeProducts.id,
    );
    setFavoruiteList(filteredList);
    Toast.show({
      type: 'error',
      text1: `${removeProducts.title}`,
      text2: `removed from Favorite`,
    });
  };

  // function to check if an item exists in the favorite list or not
  const ifExists = exists => {
    if (favoriteList.filter(item => item.id === exists.id).length > 0) {
      return true;
    }
    return false;
  };

  const renderItem = ({item}) => {
    return (
      <Item
        id={item.id}
        title={item.title}
        price={item.price}
        image={item.image}
        category={item.category}
        rating={item.rating.rate}
        count={item.rating.count}
        description={item.description}
      />
    );
  };

  const handlePaggination = () => {
    if (productData.lenght !== limit) {
      setLimit(limit + 10);
    }
  };

  const handleLisView = () => {
    if (gridColumn === true) {
      setGridColumn(false);
      setBtnText(<Icon name="list" size={30} color={'#C65D7B'} />);
    } else {
      setGridColumn(true);
      setBtnText(<Icon name="grid" size={30} color={'#C65D7B'} />);
    }
  };

  const renderHeader = () => {};

  return (
    <SafeAreaView>
      <View style={styles.listGridContainer}>
        <View
          style={{
            // borderWidth: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: 80,
          }}>
          <TouchableOpacity style={{}} onPress={handleLisView}>
            <Text>{btnText}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{}}>
            <Icon name="cart" size={30} color={'#C65D7B'} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.header}
          onPress={() =>
            navigation.navigate('AddToFav', {
              favoriteList: favoriteList.length > 0 ? favoriteList : [],
            })
          }>
          <Text style={styles.text}>Go to favorites</Text>
        </TouchableOpacity>
      </View>

      {productData.length == 0 ? (
        <ActivityIndicator size="large" color="#00ff00" style={{top: 300}} />
      ) : (
        <>
          <FlatList
            key={gridColumn ? 'one column' : 'two column'}
            data={productData}
            renderItem={renderItem}
            keyExtractor={(item, index) => index}
            ListEmptyComponent={listEmptyComponent}
            onEndReached={handlePaggination}
            numColumns={gridColumn ? 1 : 2}
            // ListHeaderComponent={renderHeader}
            // columnWrapperStyle={{flex: 1, justifyContent: 'space-evenly'}}
          />
        </>
      )}

      {/* <Toast /> */}
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  itemStyle: {
    backgroundColor: '#fff',
    padding: 10,
    // marginVertical: 5,
    // marginHorizontal: 10,
    elevation: 5,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  productImgContainer: {height: 180},
  productImage: {
    width: '100%',
    height: '80%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    resizeMode: 'contain',
  },
  icon: {
    position: 'absolute',
    zIndex: 1000,
  },
  informationContainer: {flexDirection: 'row', marginTop: 10},

  ratingStyleContainer: {
    borderRadius: 10,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingStyle: {
    fontWeight: 'bold',
    borderWidth: 1,
    padding: 2,
    borderRadius: 5,
  },

  noDataFoundText: {fontSize: 28, textAlign: 'center'},
  listGridContainer: {
    // borderWidth: 1,
    flexDirection: 'row',
    right: 10,
    justifyContent: 'space-between',
    marginTop: 10,
    paddingLeft: 30,
    paddingRight: 10,
  },
  header: {
    borderWidth: 2,
    borderColor: '#C65D7B',
    alignItems: 'center',
    width: '30%',
    justifyContent: 'center',
    height: 30,
    marginLeft: 30,
    borderRadius: 10,
  },
});
