import React from 'react';
import {Provider} from 'react-redux';
import Router from './src/router';
import Toast from 'react-native-toast-message';

import {PersistGate} from 'redux-persist/lib/integration/react';
import {store, Persistor} from './Store';

const App = () => {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={Persistor}>
          <Router />
          <Toast />
        </PersistGate>
      </Provider>
    </>
  );
};

export default App;
