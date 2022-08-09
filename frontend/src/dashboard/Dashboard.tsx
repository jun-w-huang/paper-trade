import React from "react";
import { handleTradeProps, IRootObject, Stock, userJSON } from "./interfaces";
import "../styles/Dashboard.css";

import PortfolioDetails from "./PortfolioDetails";
import SearchForm from "./SearchForm";
import OwnedStockList from "./OwnedStocksList";
import Header from "./Header";

import {
  getStockIndex,
  fetchStockLatestPrice,
  getThisUserJSON,
  updateUserInBackend,
} from "./helpers";
import TopTenStocksList from "./TopTenStocksList";

type DashboardProps = {
  token: string;
};
type DashboardState = {
  token: string;
  userJSON?: userJSON;
};

class Dashboard extends React.Component<DashboardProps, DashboardState> {
  initialState = {
    token: this.props.token,
    userJSON: {
      _id: {
        $oid: "",
      },
      username: "",
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
    this.refreshUserState();
  }

  handleBuy = async (props: handleTradeProps): Promise<void> => {
    if (props.cost > this.state.userJSON.portfolio.cash) {
      return Promise.reject("You don't have enough cash to buy this stock!");
    }
    const newStocks: Stock[] = this.state.userJSON.stocks.slice();

    const newStock = {
      symbol: props.stockJSON.symbol,
      quantity: props.quantity,
      pricePurchased: props.stockJSON.latestPrice,
      latestPrice: props.stockJSON.latestPrice,
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

    const index = getStockIndex(this.state.userJSON, props.stockJSON);

    if (index !== -1) {
      // if the user already owns the stock then combine them into one stock element
      const newCombinedStock = combineTwoStocks(
        newStock,
        this.state.userJSON.stocks[index]
      );
      newStocks[index] = newCombinedStock;
    } else {
      // otherwise just add a new stock to the array
      newStocks.push(newStock);
    }

    const newCash = this.state.userJSON.portfolio.cash - props.cost;
    const newPortfolio = {
      name: this.state.userJSON.portfolio.name,
      cash: newCash,
    };

    updateUserInBackend(
      this.state.userJSON._id,
      newPortfolio,
      newStocks,
      this.state.token
    ).then(() => {
      this.refreshUserState();
    });
  };

  handleSell = async (props: handleTradeProps): Promise<void> => {
    const newStocks: Stock[] = this.state.userJSON.stocks.slice();

    const index = getStockIndex(this.state.userJSON, props.stockJSON);
    if (props.quantity > newStocks[index].quantity) {
      return Promise.reject(
        "You are trying to sell more stock than you own! Please lower the quantity"
      );
    }

    if (props.quantity === newStocks[index].quantity) {
      // if quantity is all of the existing stock's quantity, then remove the stock from the
      // user's stocks
      newStocks.splice(index, 1);
    } else {
      // otherwise, just subtract the sold quantity from the existing quantity
      newStocks[index].quantity = newStocks[index].quantity - props.quantity;
    }

    const newCash = this.state.userJSON.portfolio.cash + props.cost;
    const newPortfolio = {
      name: this.state.userJSON.portfolio.name,
      cash: newCash,
    };

    updateUserInBackend(
      this.state.userJSON._id,
      newPortfolio,
      newStocks,
      this.state.token
    ).then(() => {
      this.refreshUserState();
    });
  };

  async refreshUserState() {
    const userJSON = await getThisUserJSON(this.props.token);
    if (userJSON) {
      for (let i = 0; i < userJSON.stocks.length; i++) {
        let stock: Stock = userJSON.stocks[i];
        stock.latestPrice = await fetchStockLatestPrice(stock.symbol);
      }
      this.setState({
        userJSON: userJSON,
      });
    }
  }

  render() {
    this.handleBuy = this.handleBuy.bind(this);
    this.handleSell = this.handleSell.bind(this);

    return (
      <div className="background-container">
        <Header username={this.state.userJSON.username} />
        <PortfolioDetails
          stocks={this.state.userJSON.stocks}
          portfolio={this.state.userJSON.portfolio}
        />
        <OwnedStockList stocks={this.state.userJSON.stocks} />
        <SearchForm
          token={this.state.token}
          handleBuy={this.handleBuy}
          handleSell={this.handleSell}
        />
        <TopTenStocksList />
      </div>
    );
  }
}

export default Dashboard;
