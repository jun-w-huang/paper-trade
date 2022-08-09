import { Stock } from "./interfaces";

interface stockRowProps {
  stock: Stock;
}

function StockRow(props: stockRowProps) {
  return (
    <tr>
      <td>{props.stock.symbol}</td>
      <td>{props.stock.latestPrice}</td>
      <td>{props.stock.quantity}</td>
      <td>{props.stock.pricePurchased}</td>
      <td>{+(props.stock.latestPrice * props.stock.quantity).toFixed(2)}</td>
      <td>
        {
          +(
            props.stock.latestPrice * props.stock.quantity -
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
  // This method will map out the stocks on the table
  const StocksToTable = (stockList: Stock[]) => {
    return stockList.map((stock) => (
      <StockRow stock={stock} key={stock.symbol} />
    ));
  };

  // This following section will display the table with the users stocks
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
