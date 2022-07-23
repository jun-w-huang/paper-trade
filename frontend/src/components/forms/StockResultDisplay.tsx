import React, { ReactElement } from "react";
import {
  handleBuyProps,
  IRootObject,
  Portfolio,
  userJSON,
} from "../../interfaces";
import BuyAndSellForm from "./BuyAndSellForm";

interface StockResultProps {
  userJSON: userJSON;
  JSONOrString: IRootObject | string;
  handleBuy: (props: handleBuyProps) => void;
}

function StockResultDisplay(
  props: React.PropsWithChildren<StockResultProps>
): ReactElement {
  if (typeof props.JSONOrString !== "string") {
    return (
      <div>
        <div id="StockResultDisplay">
          <table>
            <thead>
              <tr>
                <td>
                  {props.JSONOrString.companyName}: ${props.JSONOrString.symbol}
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Latest Price:</td>
                <td> {props.JSONOrString.latestPrice}</td>
              </tr>
              <tr>
                <td>52 Week High:</td>
                <td> {props.JSONOrString.week52High}</td>
              </tr>
              <tr>
                <td>52 Week Low:</td>
                <td> {props.JSONOrString.week52Low}</td>
              </tr>
              <tr>
                <td>P/E Ratio:</td>
                <td> {props.JSONOrString.peRatio}</td>
              </tr>
              <tr>
                <td>Market Cap:</td>
                <td> {props.JSONOrString.marketCap}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <BuyAndSellForm
          userJSON={props.userJSON}
          stockJSON={props.JSONOrString}
          handleBuy={props.handleBuy}
        />
      </div>
    );
  } else {
    return (
      <div>
        <p>{props.JSONOrString}</p>
      </div>
    );
  }
}

export default StockResultDisplay;
