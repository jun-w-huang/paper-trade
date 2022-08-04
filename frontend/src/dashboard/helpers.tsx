import { useRef, useEffect } from "react";
import { IRootObject, Portfolio, Stock, userJSON } from "./interfaces";

export async function getStockJSON(
  ticker: string
): Promise<IRootObject | string> {
  try {
    const response =
      await fetch(`https://sandbox.iexapis.com/stable/stock/${ticker}/quote/
                                        ?token=Tpk_e2b21cc8584845038c4338a07fc520ef`);
    const stockJSON = await response.json();
    return stockJSON;
  } catch {
    return `Tried to fetch ${ticker}, but the stock wasn't found ):`;
  }
}

export async function getStockLatestPrice(symbol: string): Promise<number> {
  return getStockJSON(symbol).then((stockJSON) => {
    if (typeof stockJSON === "string") {
      return 0;
    } else {
      return stockJSON.latestPrice;
    }
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
    const userJSON = await response.json();
    return userJSON;
  }
}

export async function updateUser(
  userID: { $oid: string },
  editedUserPortfolio: Portfolio,
  editedUserStocks: Stock[],
  token: string
): Promise<any> {
  const editedUser = {
    portfolio: editedUserPortfolio,
    stocks: editedUserStocks,
  };
  console.log(userID);
  fetch(`http://localhost:5000/update/${userID}`, {
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

// https://gist.github.com/babakness/faca3b633bc23d9a0924efb069c9f1f5
// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
// dan abramov set interval typescript version
// export type IntervalFunction = () => unknown | void;

// export function useInterval(callback: IntervalFunction, delay: number) {
//   const savedCallback = useRef<IntervalFunction | null>(null);

//   // Remember the latest callback.
//   useEffect(() => {
//     savedCallback.current = callback;
//   });

//   // Set up the interval.
//   useEffect(() => {
//     function tick() {
//       if (savedCallback.current !== null) {
//         savedCallback.current();
//       }
//     }
//     const id = setInterval(tick, delay);
//     return () => clearInterval(id);
//   }, [delay]);
// }
