import {CART_PRODUCTS, FETCH_CART} from '../action/cart.action';

const initialState = {
  cartBulk: [],
  loading: false,
  fetchCartBulk: [],
};

const cartReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    // case LOADER:
    //   return {...state, loading: true};
    case CART_PRODUCTS:
      return {...state, cartBulk: payload, loading: false};
    case FETCH_CART:
      console.log(payload, 'shubhangi');
      return {...state, fetchCartBulk: payload, loading: false};
    default:
      return state;
  }
};

export default cartReducer;
