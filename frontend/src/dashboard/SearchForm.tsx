import { ReactElement, useState } from "react";
import { fetchStockJSON } from "./helpers";
import { handleTradeProps, IRootObject } from "./interfaces";
import StockResultDisplay from "./StockResultDisplay";

const defaultFormData = {
  ticker: "",
};

interface SearchFormProps {
  token: string;
  handleBuy: (props: handleTradeProps) => Promise<void>;
  handleSell: (props: handleTradeProps) => Promise<void>;
}

function SearchForm(props: SearchFormProps): ReactElement {
  const [formData, setFormData] = useState(defaultFormData);
  const { ticker } = formData;
  /**
   * This useState object will hold what is returned from searching for a given stock ticker.
   * It will be an IRootObject (which is a JSON object containing relevant stock information),
   * or it will be a string in the case that there was an error fetching from the stock API.
   *
   */
  const [stockJSON, setStockJSON] = useState<IRootObject>();
  const [errorMessage, setErrorMessage] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ticker: e.target.value,
    });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchStockJSON(formData.ticker)
      .then((stockJSON: IRootObject) => {
        setStockJSON(stockJSON);
        setErrorMessage("");
      })
      .catch((error) => {
        setErrorMessage(error);
        setStockJSON(undefined);
      });
  };

  return (
    <div className="component">
      <div id="SearchForm">
        <h3>Search Stocks</h3>
        <form onSubmit={onSubmit}>
          <label htmlFor="ticker">Enter a ticker here:</label>
          <input
            type="text"
            id="ticker"
            placeholder="eg: AAPL"
            defaultValue={ticker}
            onChange={onChange}
          />
          <input type="submit" value="Search" />
        </form>
      </div>
      {stockJSON && (
        <StockResultDisplay
          token={props.token}
          stockJSON={stockJSON}
          handleBuy={props.handleBuy}
          handleSell={props.handleSell}
        />
      )}
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}

export default SearchForm;
