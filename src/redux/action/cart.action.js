export const CART_PRODUCTS = 'CART_PRODUCTS';
export const FETCH_CART = 'FETCH_CART';

// {"category": "jewelery", "count": 400, "description": "From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean's pearl. Wear facing inward to be bestowed with love and abundance, or outward for protection.", "id": 5, "image": "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg", "price": 695, "rating": 4.6, "title": "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet"}

export const cartList = cartItems => {
  console.log('---cartI->', cartItems);
  try {
    return async dispatch => {
      const result = await fetch(`https://fakestoreapi.com/carts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 5,
          date: new Date(),
          products: [
            {productId: cartItems.id, quantity: cartItems.count},
            // {productId: 1, quantity: 5},
          ],
        }),
      });

      const json = await result.json();
      console.log('==jsonjson=>>', json);
      if (json) {
        dispatch({
          type: CART_PRODUCTS,
          payload: json,
        });
        console.log('data add successfully', json);
      } else {
        console.log('enable to add');
      }
    };
  } catch (error) {
    console.log(error);
  }
};

export const getCartData = userId => {
  try {
    return async dispatch => {
      fetch(`https://fakestoreapi.com/carts/user/${userId}`)
        .then(res => res.json())
        .then(json => {
          console.log('==fetch data=>>', json);
          if (json) {
            dispatch({
              type: FETCH_CART,
              payload: json,
            });
            console.log('data fetch successfully', json);
          } else {
            console.log('enable to add');
          }
        });
    };
  } catch (error) {}
};
