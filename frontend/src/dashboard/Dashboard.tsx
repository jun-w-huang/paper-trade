import React from "react";
import { handleTradeProps, IRootObject, Stock, userJSON } from "./interfaces";
import "../styles/Dashboard.css";

import PortfolioDetails from "./PortfolioDetails";
import SearchForm from "./SearchForm";
import OwnedStockList from "./OwnedStocksList";
import Header from "./Header";

import { getStockIndex, getStockLatestPrice, getThisUserJSON } from "./helpers";
import TopTenStocksList from "./TopTenStocksList";

type DashboardProps = {
  token: string;
};
type DashboardState = {
  token: string;
  userJSON?: userJSON;
  JSONOrString: IRootObject | string;
};

class Dashboard extends React.Component<DashboardProps, DashboardState> {
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
    this.refreshUserJSON();
  }

  componentDidUpdate(prevProps: DashboardProps, prevState: DashboardState) {
    // check userJSON and if their stocks have changed then update userJSON state.
    console.log("updating component");
    getThisUserJSON(this.props.token).then((userJSON) => {
      if (
        // checks if stocks owned have changed.
        typeof prevState.userJSON !== "undefined" &&
        userJSON.stocks !== prevState.userJSON?.stocks &&
        prevState.userJSON.stocks[0] &&
        prevState.userJSON.stocks[0].symbol !== userJSON.stocks[0].symbol
      ) {
        this.setState({
          userJSON: userJSON,
        });
      }
    });
  }

  handleBuy = async (props: handleTradeProps): Promise<void> => {
    return this.refreshUserJSON().then(() => {
      if (props.cost > this.state.userJSON.portfolio.cash) {
        window.alert("You don't have enough cash to buy this stock!");
        return Promise.reject();
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

      const editedUser = {
        portfolio: newPortfolio,
        stocks: newStocks,
      };

      fetch(`http://localhost:5000/update/${this.state.userJSON._id}`, {
        method: "POST",
        body: JSON.stringify(editedUser),
        headers: {
          "Content-Type": "application/json",
        },
      }).then(() => {
        return this.refreshUserJSON();
      });
    });
  };

  handleSell = async (props: handleTradeProps): Promise<void> => {
    const index = getStockIndex(this.state.userJSON, props.stockJSON);
    return this.refreshUserJSON().then(() => {
      const newStocks: Stock[] = this.state.userJSON.stocks.slice();

      if (props.quantity > newStocks[index].quantity) {
        window.alert(
          "You are trying to sell more stock than you own! Please lower the quantity"
        );
        return Promise.reject();
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

      const editedUser = {
        portfolio: newPortfolio,
        stocks: newStocks,
      };

      fetch(`http://localhost:5000/update/${this.state.userJSON._id}`, {
        method: "POST",
        body: JSON.stringify(editedUser),
        headers: {
          "Content-Type": "application/json",
        },
      }).then(() => {
        return this.refreshUserJSON();
      });
    });
  };

  async refreshUserJSON(): Promise<any> {
    const userJSON = await getThisUserJSON(this.props.token);
    if (userJSON) {
      for (let i = 0; i < userJSON.stocks.length; i++) {
        let stock: Stock = userJSON.stocks[i];
        stock.latestPrice = await getStockLatestPrice(stock.symbol);
      }
      this.setState({
        userJSON: userJSON,
      });
      return Promise.resolve();
    }
    return Promise.reject();
  }

  render() {
    this.handleBuy = this.handleBuy.bind(this);
    this.handleSell = this.handleSell.bind(this);

    return (
      <div className="background-container">
        <Header />
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
