export const FAVORITE_ITEM = 'FAVORITE_ITEM';
export const REMOVE_FAVORITE_ITEM = 'REMOVE_FAVORITE_ITEM';

export const favItemList = favItem => {
  console.log('---add-favItem->', favItem);
  return async dispatch => {
    // console.log('==favItem-->>', json);
    dispatch({
      type: FAVORITE_ITEM,
      payload: {favItem},
    });
  };
};

export const removeFavItemList = removeItem => {
  console.log('---remove-favItem->', removeItem);
  return async dispatch => {
    // console.log('==favItem-->>', json);
    dispatch({
      type: REMOVE_FAVORITE_ITEM,
      payload: {removeItem},
    });
  };
};
