import { useLayoutEffect, useState } from "react";
import { getStockLatestPrice, useInterval } from "./helpers";
import { Stock } from "./interfaces";

interface stockRowProps {
  stock: Stock;
}

function StockRow(props: stockRowProps) {
  const [latestPrice, setLatestPrice] = useState(0);

  // const [latestPriceFontColor, setLatestPriceFontColor] = useState("black");

  /**
   * This useInterval was planned to be used to refresh the prices of each stock owned
   * every few seconds and the color of the stock's price displayed to the user
   * would be green if it had increased and red if it had decreased.
   * I have decided to omit its use for now as it is very demanding on the stock data API.
   */
  // useInterval(() => {
  //   getStockLatestPrice(props.stock.symbol).then((newLatestPrice) => {
  //     setLatestPrice(newLatestPrice);
  //     // must use new price as setState hook is async
  //     if (newLatestPrice > latestPrice) {
  //       setLatestPriceFontColor("green");
  //     } else {
  //       setLatestPriceFontColor("red");
  //     }
  //   });
  // }, 5000);

  //initial price, runs once
  useLayoutEffect(() => {
    getStockLatestPrice(props.stock.symbol).then((newLatestPrice) => {
      setLatestPrice(newLatestPrice);
    });
  }, []);

  return (
    <tr>
      <td>{props.stock.symbol}</td>
      <td>{latestPrice}</td>
      <td>{props.stock.quantity}</td>
      <td>{props.stock.pricePurchased}</td>
      <td>{+(latestPrice * props.stock.quantity).toFixed(2)}</td>
      <td>
        {
          +(
            latestPrice * props.stock.quantity -
            props.stock.pricePurchased * props.stock.quantity
          ).toFixed(2)
        }
      </td>
    </tr>
  );
}

interface stockListProps {
  stocks: Stock[];
}
export default function OwnedStockList(props: stockListProps) {
  // This method will map out the records on the table
  const StocksToTable = (stockList: Stock[]) => {
    return stockList.map((stock) => (
      <StockRow
        stock={stock}
        // deleteStock={() => deleteStock(stock._id)}
        key={stock.symbol}
      />
    ));
  };

  // This following section will display the table with the records of individuals.
  return (
    <div className="component">
      <h3>Your Stocks</h3>
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Latest Price</th>
            <th>Quantity</th>
            <th>Price Purchased</th>
            <th>Value</th>
            <th>Net Value</th>
          </tr>
        </thead>
        <tbody>{StocksToTable(props.stocks)}</tbody>
      </table>
    </div>
  );
}
