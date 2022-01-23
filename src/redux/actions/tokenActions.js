export const ADD_TOKEN = "ADD_TOKEN";
export const DELETE_TOKEN = "DELETE_TOKEN";

export const addToken = (payload) => ({ type: ADD_TOKEN, payload });

export const deleteToken = () => ({ type: DELETE_TOKEN });
