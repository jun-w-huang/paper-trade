import { ReactElement } from "react";
import { Portfolio, Stock } from "./interfaces";
import { PieChart } from "./PieChart";
import cashSVG from "../res/cash.png";

interface PortfolioDetailProps {
  portfolio: Portfolio;
  stocks: Stock[];
}

export default function PortfolioDetails(
  props: PortfolioDetailProps
): ReactElement {
  const portfolioValue = () => {
    let sumValue = props.portfolio.cash;
    for (let i = 0; i < props.stocks.length; i++) {
      let stock = props.stocks[i];
      sumValue += stock.latestPrice * stock.quantity;
    }
    return sumValue;
  };

  const totalReturn = () => {
    let totalReturn = (portfolioValue() - 1000000) / 1000000;

    return totalReturn.toFixed(2);
  };

  return (
    <div className="component">
      <div id="PortfolioDetails">
        <div id="PortfolioDetails-text">
          <div id="PortfolioDetails-cash">
            {/* https://www.svgrepo.com/svg/165955/cash */}
            <img src={cashSVG} id="PortfolioDetails-cashSVG" />
            <p>Cash: {props.portfolio.cash.toFixed(2)}</p>
          </div>
          <hr id="separator" />
          <div id="PortfolioDetails-returns">
            <p>Total Value: {portfolioValue()}</p>
            <p>Total Return: {totalReturn()}%</p>
          </div>
        </div>
        <div id="pie-container">
          <PieChart portfolio={props.portfolio} stocks={props.stocks} />
        </div>
      </div>
    </div>
  );
}
