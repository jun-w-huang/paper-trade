import React, { ReactElement } from "react";
import { handleTradeProps, IRootObject } from "./interfaces";
import BuyAndSellForm from "./BuyAndSellForm";

interface StockResultProps {
  token: string;
  JSONOrString: IRootObject | string;
  handleBuy: (props: handleTradeProps) => Promise<void>;
  handleSell: (props: handleTradeProps) => Promise<void>;
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
          token={props.token}
          stockJSON={props.JSONOrString}
          handleBuy={props.handleBuy}
          handleSell={props.handleSell}
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
