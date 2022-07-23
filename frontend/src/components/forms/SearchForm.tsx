import { ReactElement, useState } from "react";
import { getStockJSON } from "../../helpers";
import {
  handleBuyProps,
  IRootObject,
  Portfolio,
  userJSON,
} from "../../interfaces";
import StockResultDisplay from "./StockResultDisplay";

const defaultFormData = {
  ticker: "",
};

interface SearchFormProps {
  userJSON: userJSON;
  JSONOrString: IRootObject | string;
  handleSearch: (stockJSON: IRootObject | string) => void;
  handleBuy: (props: handleBuyProps) => void;
}

function SearchForm(props: SearchFormProps): ReactElement {
  const [formData, setFormData] = useState(defaultFormData);
  const { ticker } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ticker: e.target.value,
    });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    getStockJSON(formData.ticker).then((JSONOrString: string | IRootObject) => {
      props.handleSearch(JSONOrString);
    });
  };

  return (
    <div>
      <div id="SearchForm">
        <form onSubmit={onSubmit}>
          <label htmlFor="ticker">Enter a ticker here:</label>
          <input
            type="text"
            id="ticker"
            defaultValue={ticker}
            onChange={onChange}
          />
          <input type="submit" value="Search" />
        </form>
      </div>
      <StockResultDisplay
        userJSON={props.userJSON}
        JSONOrString={props.JSONOrString}
        handleBuy={props.handleBuy}
      />
    </div>
  );
}

export default SearchForm;
