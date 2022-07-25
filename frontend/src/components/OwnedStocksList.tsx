import { useLayoutEffect, useState } from "react";
import { getStockLatestPrice, useInterval } from "../helpers";
import { Stock } from "../interfaces";

interface stockRowProps {
  stock: Stock;
}

function StockRow(props: stockRowProps) {
  const [latestPrice, setLatestPrice] = useState(0);
  const [latestPriceFontColor, setLatestPriceFontColor] = useState("black");

  useInterval(() => {
    getStockLatestPrice(props.stock.symbol).then((newLatestPrice) => {
      setLatestPrice(newLatestPrice);
      // must use new price as setState hook is async
      if (newLatestPrice > latestPrice) {
        setLatestPriceFontColor("green");
      } else {
        setLatestPriceFontColor("red");
      }
    });
  }, 5000);

  //initial price, runs once
  useLayoutEffect(() => {
    getStockLatestPrice(props.stock.symbol).then((newLatestPrice) => {
      setLatestPrice(newLatestPrice);
    });
  }, []);

  return (
    <tr>
      <td>{props.stock.symbol}</td>
      <td style={{ color: latestPriceFontColor }}>{latestPrice}</td>
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
    <div>
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
