import React, {
  ReactElement,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { useParams, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { getStockIndex } from "../../helpers";
import {
  handleBuyProps,
  IRootObject,
  Portfolio,
  Stock,
  userJSON,
} from "../../interfaces";

interface BuyAndSellFormProps {
  userJSON: userJSON;
  stockJSON: IRootObject;
  handleBuy: (props: handleBuyProps) => void;
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
    // e.preventDefault()
    // console.log("buy button pressed");

    // if (cost > props.userJSON.portfolio.cash) {
    //   window.alert("You don't have enough cash to buy this stock!");
    //   return;
    // }

    // const newStocks = props.userJSON.stocks.slice();

    // const newStock = {
    //   symbol: props.stockJSON.symbol,
    //   quantity: quantity,
    //   pricePurchased: props.stockJSON.latestPrice,
    // };

    // function combineTwoStocks(newStock: Stock, oldStock: Stock) {
    //   // quantity will be the sum of both,
    //   // price purchased will be (q1 * pricepurchased1 + q2 * pricepurchased2)/ (q1+q2)
    //   // eg: 1 stock at 10$, and you buy 2 stocks at 20$, the average price should become
    //   // 1*10 = 10, 2*20 = 40, 50/3
    //   const newTotalQuantity = newStock.quantity + oldStock.quantity;
    //   const newAveragePricePurchased =
    //     (newStock.quantity * newStock.pricePurchased +
    //       oldStock.quantity * oldStock.pricePurchased) /
    //     newTotalQuantity;
    //   newStock.quantity = newTotalQuantity;
    //   newStock.pricePurchased = +newAveragePricePurchased.toFixed(2);
    //   return newStock;
    // }

    // if (stockIsOwned) {
    //   console.log("hello");
    //   const newCombinedStock = combineTwoStocks(
    //     newStock,
    //     props.userJSON.stocks[index]
    //   );
    //   newStocks[index] = newCombinedStock;
    // } else {
    //   newStocks.push(newStock);
    // }

    // const newCash = props.userJSON.portfolio.cash - cost;
    // const newPortfolio = {
    //   name: props.userJSON.portfolio.name,
    //   cash: newCash,
    // };

    // const editedUser = {
    //   portfolio: newPortfolio,
    //   stocks: newStocks,
    // };

    // await fetch(`http://localhost:5000/update/${props.userJSON._id}`, {
    //   method: "POST",
    //   body: JSON.stringify(editedUser),
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    const handleBuyProps = {
      cost: cost,
      userJSON: props.userJSON,
      quantity: quantity,
      stockJSON: props.stockJSON,
      stockIsOwned: stockIsOwned,
      index: index,
    };
    props.handleBuy(handleBuyProps);
  }

  async function onSell(e: React.MouseEvent<HTMLInputElement, MouseEvent>) {
    // e.preventDefault()
    console.log("sell button clciked");

    if (quantity > props.userJSON.stocks[index].quantity) {
      window.alert(
        "You are trying to sell more stock than you own! Please lower the quantity"
      );
      return;
    }

    const newStocks = props.userJSON.stocks.slice();

    if (quantity === props.userJSON.stocks[index].quantity) {
      newStocks.splice(index, 1);
    } else {
      newStocks[index].quantity = newStocks[index].quantity - quantity;
    }

    const newCash = props.userJSON.portfolio.cash + cost;
    const newPortfolio = {
      name: props.userJSON.portfolio.name,
      cash: newCash,
    };

    const editedUser = {
      portfolio: newPortfolio,
      stocks: newStocks,
    };

    console.log(newStocks);

    await fetch(`http://localhost:5000/update/${props.userJSON._id}`, {
      method: "POST",
      body: JSON.stringify(editedUser),
      headers: {
        "Content-Type": "application/json",
      },
    });
    // props.handleBuy();
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
