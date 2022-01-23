import { ADD_TOKEN, DELETE_TOKEN } from "../actions/tokenActions";

export const initialState = { token: {} };

export const tokenReducers = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TOKEN:
      const payload = action.payload;
      return { ...state, token: { ...state.agents, payload } };
    case DELETE_TOKEN:
      return { ...state, token: undefined };
    default:
      return state;
  }
};
