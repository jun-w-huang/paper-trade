import React, { useLayoutEffect, useState } from "react";
import { getStockIndex, getThisUserJSON } from "../../helpers";
import { handleTradeProps, IRootObject, userJSON } from "../../interfaces";

interface BuyAndSellFormProps {
  userJSON: userJSON;
  token: string;
  stockJSON: IRootObject;
  handleBuy: (props: handleTradeProps) => Promise<void>;
  handleSell: (props: handleTradeProps) => Promise<void>;
}

export default function BuyAndSellForm(props: BuyAndSellFormProps) {
  const [quantity, setQuantity] = useState(100);

  const [cost, setCost] = useState(0);
  const [stockIsOwned, setStockIsOwned] = useState(false);

  const index = getStockIndex(props.userJSON, props.stockJSON);

  useLayoutEffect(() => {
    console.log("use layout effect running");
    console.log(index);
    index === -1 ? setStockIsOwned(false) : setStockIsOwned(true);
    setCost(quantity * props.stockJSON.latestPrice ?? "0");
  }, [props.stockJSON]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("on change");
    setQuantity(parseInt(e.target.value));
    setCost(parseInt(e.target.value) * props.stockJSON.latestPrice ?? 0);
  };

  async function onBuy(e: React.MouseEvent<HTMLInputElement, MouseEvent>) {
    const handleTradeProps = {
      cost: cost,
      quantity: quantity,
      stockJSON: props.stockJSON,
    };
    props.handleBuy(handleTradeProps).then(async () => {
      getThisUserJSON(props.token).then((json) => {
        let i = getStockIndex(json, props.stockJSON);
        i === -1 ? setStockIsOwned(false) : setStockIsOwned(true);
      });
    });
  }

  async function onSell(e: React.MouseEvent<HTMLInputElement, MouseEvent>) {
    // e.preventDefault()
    console.log("sell button clciked");
    const handleTradeProps = {
      cost: cost,
      quantity: quantity,
      stockJSON: props.stockJSON,
    };
    props.handleSell(handleTradeProps).then(async () => {
      getThisUserJSON(props.token).then((json) => {
        let i = getStockIndex(json, props.stockJSON);
        i === -1 ? setStockIsOwned(false) : setStockIsOwned(true);
      });
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
          disabled={quantity ? false : true}
          name="buyButton"
          value="Buy"
          onClick={(e) => onBuy(e)}
        />
        <input
          type="button"
          hidden={!stockIsOwned}
          value="Sell"
          onClick={(e) => onSell(e)}
        />
      </form>
      <p>Cost / Revenue: {cost.toFixed(2)}</p>
    </div>
  );
}
