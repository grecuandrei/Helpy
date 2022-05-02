import { createStore, configureStore, applyMiddleware } from "redux";  
import { composeWithDevTools } from "redux-devtools-extension";  
import thunk from "redux-thunk";  
import rootReducer from "./reducers";  

const initialState = {};  

const middleware = [thunk];  

const store = configureStore(  // configureStore/createStore
    rootReducer,  
    initialState,  
    composeWithDevTools(applyMiddleware(...middleware))  
);  

export default store;