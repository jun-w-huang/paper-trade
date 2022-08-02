import { ReactElement, useState } from "react";
import { getStockJSON } from "./helpers";
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
  const [JSONOrString, setJSONOrString] = useState<IRootObject | string>();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ticker: e.target.value,
    });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    getStockJSON(formData.ticker).then((JSONOrString: string | IRootObject) => {
      setJSONOrString(JSONOrString);
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
      {JSONOrString && (
        <StockResultDisplay
          token={props.token}
          JSONOrString={JSONOrString}
          handleBuy={props.handleBuy}
          handleSell={props.handleSell}
        />
      )}
    </div>
  );
}

export default SearchForm;
