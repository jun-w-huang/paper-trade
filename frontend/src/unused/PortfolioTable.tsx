import { ReactElement } from "react";
import { Stock } from "../dashboard/interfaces";

interface PortfolioTableProps {
  stocks: Stock[];
}

interface PortfolioTableRowProps {
  stock: Stock;
}

function PortfolioTableRow({ stock }: PortfolioTableRowProps): ReactElement {
  return (
    <tr>
      <td>{stock.symbol}</td>
      {/* <td>{stock.latestPrice}</td> */}
      <td>{stock.quantity}</td>
      <td>{stock.pricePurchased}</td>
    </tr>
  );
}

function PortfolioTable(props: PortfolioTableProps): ReactElement {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <td>Ticker</td>
            <td>Latest Price</td>
            <td>Quantity</td>
            <td>Price Purchased</td>
          </tr>
        </thead>
        <tbody>
          {props.stocks.map((stock) => (
            <PortfolioTableRow key={stock.symbol} stock={stock} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PortfolioTable;
