import { combineReducers, createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";

import { tokenReducers } from "./reducers/tokenReducers";

import storage from "redux-persist/lib/storage";
const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({ tokenReducers })
);

export const store = createStore(persistedReducer);

export const persistor = persistStore(store);
