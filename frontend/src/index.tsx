import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";

// const userJSON =
//   {
//     "_id": {
//         "$oid": "61e83b060f564c8939df653d"
//     },
//     "username": "huang7178",
//     "password": "daisy123",
//     "portfolio": {
//         "name": "Tech Stocks",
//         "cash": 1000000
//     },
//     "stocks": [
//       {
//         "symbol": "AAPL",
//         "quantity": 100,
//         "pricePurchased": 175.35
//       },
//       {
//         "symbol": "AMZN",
//         "quantity": 200,
//         "pricePurchased": 3342.32
//       }]
// }

// const emptyJSON = {
//     "_id": {
//         "$oid": ""
//     },
//     "username": "",
//     "password": "",
//     "portfolio": {
//         "name": "",
//         "cash": 0
//     },
//     "stocks": []
// }

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
