import React from "react";
import { handleBuyProps, IRootObject, Stock, userJSON } from "./interfaces";
import "./styles/PaperTrade.css";

import PortfolioDetails from "./components/PortfolioDetails";
import SearchForm from "./components/forms/SearchForm";
import OwnedStockList from "./components/OwnedStocksList";
import Header from "./components/header";

import { getThisUserJSON } from "./helpers";
import TopTenStocksList from "./components/TopTenStocksList";

type PaperTradeProps = {
  token: string;
};
type PaperTradeState = {
  token: string;
  userJSON?: userJSON;
  JSONOrString: IRootObject | string;
};

class PaperTrade extends React.Component<PaperTradeProps, PaperTradeState> {
  initialState = {
    token: this.props.token,
    userJSON: {
      _id: {
        $oid: "",
      },
      username: "",
      password: "",
      portfolio: {
        name: "",
        cash: 0,
      },
      stocks: [],
    },
    JSONOrString: "",
  };
  state = this.initialState;

  componentDidMount() {
    this.fetchUser();
  }

  componentDidUpdate(prevProps: PaperTradeProps, prevState: PaperTradeState) {
    console.log("helloo component is updating!");
    getThisUserJSON(this.props.token).then((userJSON) => {
      if (
        userJSON.stocks !== prevState.userJSON?.stocks &&
        typeof prevState.userJSON !== "undefined" &&
        prevState.userJSON.stocks[1].symbol !== userJSON.stocks[1].symbol
      ) {
        this.setState({
          userJSON: userJSON,
        });
      }
    });
  }

  handleSearch(JSONOrString: IRootObject | string) {
    if (typeof JSONOrString === "string") {
      this.setState({
        JSONOrString: JSONOrString,
      });
    } else {
      this.setState({
        JSONOrString: JSONOrString,
      });
    }
  }

  async handleBuy(props: handleBuyProps) {
    console.log("handlebuy running");
    console.log("buy button pressed");

    if (props.cost > this.state.userJSON.portfolio.cash) {
      window.alert("You don't have enough cash to buy this stock!");
      return;
    }
    console.log("user json is :");
    console.log(this.state.userJSON);
    const newStocks: Stock[] = this.state.userJSON.stocks.slice();

    const newStock = {
      symbol: props.stockJSON.symbol,
      quantity: props.quantity,
      pricePurchased: props.stockJSON.latestPrice,
    };

    function combineTwoStocks(newStock: Stock, oldStock: Stock) {
      // quantity will be the sum of both,
      // price purchased will be (q1 * pricepurchased1 + q2 * pricepurchased2)/ (q1+q2)
      // eg: 1 stock at 10$, and you buy 2 stocks at 20$, the average price should become
      // 1*10 = 10, 2*20 = 40, 50/3
      const newTotalQuantity = newStock.quantity + oldStock.quantity;
      const newAveragePricePurchased =
        (newStock.quantity * newStock.pricePurchased +
          oldStock.quantity * oldStock.pricePurchased) /
        newTotalQuantity;
      newStock.quantity = newTotalQuantity;
      newStock.pricePurchased = +newAveragePricePurchased.toFixed(2);
      return newStock;
    }

    if (props.stockIsOwned) {
      console.log("hello");
      const newCombinedStock = combineTwoStocks(
        newStock,
        this.state.userJSON.stocks[props.index]
      );
      newStocks[props.index] = newCombinedStock;
    } else {
      newStocks.push(newStock);
    }

    const newCash = this.state.userJSON.portfolio.cash - props.cost;
    const newPortfolio = {
      name: this.state.userJSON.portfolio.name,
      cash: newCash,
    };

    const editedUser = {
      portfolio: newPortfolio,
      stocks: newStocks,
    };

    await fetch(`http://localhost:5000/update/${this.state.userJSON._id}`, {
      method: "POST",
      body: JSON.stringify(editedUser),
      headers: {
        "Content-Type": "application/json",
      },
    });
    this.fetchUser();
  }

  fetchUser() {
    getThisUserJSON(this.props.token).then((userJSON) => {
      console.log(userJSON);
      if (userJSON) {
        this.setState({
          userJSON: userJSON,
        });
      }
    });
  }

  render() {
    this.handleSearch = this.handleSearch.bind(this);
    this.handleBuy = this.handleBuy.bind(this);

    return (
      <div className="container">
        <Header username={this.state.userJSON.username} />
        <PortfolioDetails portfolio={this.state.userJSON.portfolio} />
        <SearchForm
          userJSON={this.state.userJSON}
          JSONOrString={this.state.JSONOrString}
          handleSearch={this.handleSearch}
          handleBuy={this.handleBuy}
        />
        <OwnedStockList stocks={this.state.userJSON.stocks} />
        <TopTenStocksList />
      </div>
    );
  }
}

export default PaperTrade;
