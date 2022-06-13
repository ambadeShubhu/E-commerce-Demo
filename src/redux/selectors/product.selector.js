export const productListSelector = state => state.productData.productBulk;
export const tokenSelector = state => state.loginReducer.token;
export const cartItemSelector = state => state.cartData.cartBulk;
export const favoriteItemSelector = state => state.favoriteItem.favItemBulk;
export const cartDataSelector = state => state.cartData.fetchCartBulk;
