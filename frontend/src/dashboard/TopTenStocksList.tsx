import { useLayoutEffect, useState } from "react";
import { IRootObject } from "./interfaces";

interface stockRowProps {
  stockJSON: IRootObject;
  usePercentChange: Boolean;
}
function StockRow(props: stockRowProps) {
  return (
    <tr>
      <td>{props.stockJSON.symbol}</td>
      <td>{props.stockJSON.companyName}</td>
      {/* <td style={{ color: latestPriceFontColor }}>{latestPrice}</td> */}
      <td>{props.stockJSON.latestPrice}</td>
      <td>
        {props.usePercentChange
          ? `${props.stockJSON.changePercent.toFixed(2)}%`
          : props.stockJSON.change.toFixed(2)}
      </td>
    </tr>
  );
}

export default function TopTenStocksList() {
  const [topTen, setTopTen] = useState([]);
  const [usePercentChange, setUsePercentChange] = useState(true);

  const fetchData = async () => {
    const request =
      await fetch(`https://sandbox.iexapis.com/stable/stock/market/list/mostactive/
                                        ?token=Tpk_e2b21cc8584845038c4338a07fc520ef`);
    const data = await request.json();
    setTopTen(data);
  };

  const TogglePercent = () => {
    return (
      <button
        type="button"
        onClick={() => {
          setUsePercentChange((prev) => !prev);
        }}
      >
        Toggle %
      </button>
    );
  };

  useLayoutEffect(() => {
    fetchData();
  }, []);

  const StockListToTableBody = (stockList: IRootObject[]) => {
    return stockList.map((stock) => (
      <StockRow
        usePercentChange={usePercentChange}
        stockJSON={stock}
        key={stock.symbol}
      />
    ));
  };

  return (
    <div className="component">
      <div>
        <h3>Trending Stocks</h3>
        <TogglePercent />
      </div>
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Company Name</th>
            <th>Latest Price</th>
            <th>Change</th>
          </tr>
        </thead>
        <tbody>{StockListToTableBody(topTen)}</tbody>
      </table>
    </div>
  );
}
