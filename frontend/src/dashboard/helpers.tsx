import { IRootObject, Portfolio, Stock, userJSON } from "./interfaces";

export async function fetchStockJSON(ticker: string): Promise<any> {
  try {
    const response =
      await fetch(`https://sandbox.iexapis.com/stable/stock/${ticker}/quote/
                                        ?token=Tpk_e2b21cc8584845038c4338a07fc520ef`);
    const stockJSON = await response.json();
    return Promise.resolve(stockJSON);
  } catch {
    return Promise.reject(
      `Tried to fetch ${ticker}, but the stock was not found.`
    );
  }
}

export async function fetchStockLatestPrice(symbol: string): Promise<number> {
  return fetchStockJSON(symbol)
    .then((stockJSON) => {
      return Promise.resolve(stockJSON.latestPrice);
    })
    .catch((error) => {
      return Promise.reject(0);
    });
}

export async function getThisUserJSON(token: string) {
  const response = await fetch(`http://localhost:5000/auth/user`, {
    method: "GET",
    headers: {
      "x-auth-token": token,
    },
  });
  if (response) {
    const userJSON = response.json();
    return userJSON;
  }
}

export async function updateUserInBackend(
  userID: { $oid: string },
  editedUserPortfolio: Portfolio,
  editedUserStocks: Stock[],
  token: string
): Promise<any> {
  const editedUser = {
    portfolio: editedUserPortfolio,
    stocks: editedUserStocks,
  };

  return fetch(`http://localhost:5000/update/${userID}`, {
    method: "POST",
    body: JSON.stringify(editedUser),
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": token,
    },
  });
}

// returns a valid index if the stock exists in the portfolio, otherwise returns -1
export function getStockIndex(
  userJSON: userJSON,
  stock: Stock | IRootObject
): number {
  const searchValue = stock.symbol;
  const isStockSymbol = (stock: Stock) => {
    return stock.symbol === searchValue;
  };
  const index = userJSON.stocks.findIndex(isStockSymbol);
  return index;
}
