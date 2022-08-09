import React, { useLayoutEffect, useState } from "react";
import { getStockIndex, getThisUserJSON } from "./helpers";
import { handleTradeProps, IRootObject } from "./interfaces";

interface BuyAndSellFormProps {
  token: string;
  stockJSON: IRootObject;
  handleBuy: (props: handleTradeProps) => Promise<void>;
  handleSell: (props: handleTradeProps) => Promise<void>;
}

export default function BuyAndSellForm(props: BuyAndSellFormProps) {
  const [quantity, setQuantity] = useState(100);

  const [cost, setCost] = useState(0);
  const [stockIsOwned, setStockIsOwned] = useState(false);
  const [tradeInProgress, setTradeInProgress] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useLayoutEffect(() => {
    setErrorMessage("");
    // checks if the stock searched is owned by the user and displays a sell button if necessary
    getThisUserJSON(props.token).then((json) => {
      let i = getStockIndex(json, props.stockJSON);
      i === -1 ? setStockIsOwned(false) : setStockIsOwned(true);
    });
    setCost(quantity * props.stockJSON.latestPrice ?? "0");
  }, [props.stockJSON]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(parseInt(e.target.value));
    setCost(parseInt(e.target.value) * props.stockJSON.latestPrice ?? 0);
  };

  async function onBuy(e: React.MouseEvent<HTMLInputElement, MouseEvent>) {
    const handleTradeProps = {
      cost: cost,
      quantity: quantity,
      stockJSON: props.stockJSON,
    };
    setTradeInProgress(true);
    props
      .handleBuy(handleTradeProps)
      .then(async () => {
        getThisUserJSON(props.token).then((json) => {
          let i = getStockIndex(json, props.stockJSON);
          i === -1 ? setStockIsOwned(false) : setStockIsOwned(true);
          setTradeInProgress(false);
        });
      })
      .catch((error) => {
        setErrorMessage(error);
        setTradeInProgress(false);
      });
  }

  async function onSell(e: React.MouseEvent<HTMLInputElement, MouseEvent>) {
    const handleTradeProps = {
      cost: cost,
      quantity: quantity,
      stockJSON: props.stockJSON,
    };
    setTradeInProgress(true);
    props
      .handleSell(handleTradeProps)
      .then(async () => {
        getThisUserJSON(props.token).then((json) => {
          let i = getStockIndex(json, props.stockJSON);
          i === -1 ? setStockIsOwned(false) : setStockIsOwned(true);
          setTradeInProgress(false);
          setErrorMessage("");
        });
      })
      .catch((error) => {
        setErrorMessage(error);
        setTradeInProgress(false);
      });
  }

  return (
    <div id="BuyForm">
      <form>
        <label htmlFor="quantity">Quantity: </label>
        <input
          type="text"
          id="quantity"
          defaultValue="100"
          onChange={onChange}
        />
        <input
          type="button"
          disabled={!tradeInProgress && quantity ? false : true}
          name="buyButton"
          value="Buy"
          onClick={(e) => onBuy(e)}
        />
        <input
          type="button"
          disabled={stockIsOwned && !tradeInProgress && quantity ? false : true}
          value="Sell"
          onClick={(e) => onSell(e)}
        />
      </form>
      <p>Cost / Revenue: {cost.toFixed(2)}</p>
      <p>{errorMessage}</p>
    </div>
  );
}
