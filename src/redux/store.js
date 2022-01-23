import { combineReducers, createStore } from "redux";
import { tokenReducers } from "./reducers/tokenReducers";
import { persistStore, persistReducer } from "redux-persist";
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
