import { createStore, compose, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import reducers from "./reducers";

const INITIAL_STATE = {};

const middleware = [thunk];

const composer =
  process.env.NODE_ENV === "development" ? composeWithDevTools : compose;

const store = createStore(
  reducers,
  INITIAL_STATE,
  composer(applyMiddleware(...middleware))
);

export default store;
