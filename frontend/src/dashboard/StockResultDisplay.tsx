import React, { ReactElement } from "react";
import { handleTradeProps, IRootObject } from "./interfaces";
import BuyAndSellForm from "./BuyAndSellForm";

interface StockResultProps {
  token: string;
  stockJSON: IRootObject;
  handleBuy: (props: handleTradeProps) => Promise<void>;
  handleSell: (props: handleTradeProps) => Promise<void>;
}

function StockResultDisplay(
  props: React.PropsWithChildren<StockResultProps>
): ReactElement {
  return (
    <div>
      <div id="StockResultDisplay">
        <table>
          <thead>
            <tr>
              <td>
                {props.stockJSON.companyName}: ${props.stockJSON.symbol}
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Latest Price:</td>
              <td> {props.stockJSON.latestPrice}</td>
            </tr>
            <tr>
              <td>52 Week High:</td>
              <td> {props.stockJSON.week52High}</td>
            </tr>
            <tr>
              <td>52 Week Low:</td>
              <td> {props.stockJSON.week52Low}</td>
            </tr>
            <tr>
              <td>P/E Ratio:</td>
              <td> {props.stockJSON.peRatio}</td>
            </tr>
            <tr>
              <td>Market Cap:</td>
              <td> {props.stockJSON.marketCap}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <BuyAndSellForm
        token={props.token}
        stockJSON={props.stockJSON}
        handleBuy={props.handleBuy}
        handleSell={props.handleSell}
      />
    </div>
  );
}

export default StockResultDisplay;
