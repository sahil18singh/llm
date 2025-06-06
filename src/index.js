import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import {Provider} from "react-redux";
import { Toaster } from "react-hot-toast";
import rootReducer from "./reducer"


const store = configureStore({
  reducer:rootReducer,
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
            <App />
            <Toaster/>
        </BrowserRouter>
    </Provider>


      
  </React.StrictMode>
);
