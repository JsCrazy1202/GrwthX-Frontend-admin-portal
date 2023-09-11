import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'
import { dataApi } from './slices/apiSlice';
import customizationReducer from './customizationReducer';

// ==============================|| REDUX - MAIN STORE ||============================== //

const persistConfig = {
    key: 'customization',
    storage,
    whiteList:[],
    blacklist: ['dataApi', 'customization']
};

const persistedReducer = persistReducer(persistConfig, combineReducers({
    [dataApi.reducerPath]: dataApi.reducer,
    customization: customizationReducer
}));

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      serializableCheck: false
  }).concat(dataApi.middleware)
});

setupListeners(store.dispatch);

let persistor = persistStore(store);

export { store, persistor };
