import { useRef, useEffect } from "react";
import { IRootObject, Stock, userJSON } from "./interfaces";

export async function getStockJSON(
  ticker: string
): Promise<IRootObject | string> {
  // console.log(`fetching ${ticker} JSON `);
  // const string = '{"avgTotalVolume":102907144,"calculationPrice":"close","change":2.89,"changePercent":0.01678,"close":175.08,"closeSource":"official","closeTime":1641934800998,"companyName":"Apple Inc","currency":"USD","delayedPrice":175.12,"delayedPriceTime":1641934794061,"extendedChange":0.16,"extendedChangePercent":0.00091,"extendedPrice":175.24,"extendedPriceTime":1641949197193,"high":175.18,"highSource":"15 minute delayed price","highTime":1641934813503,"iexAskPrice":0,"iexAskSize":0,"iexBidPrice":0,"iexBidSize":0,"iexClose":174.93,"iexCloseTime":1641934798642,"iexLastUpdated":1641934798642,"iexMarketPercent":0.012563814998690337,"iexOpen":172.38,"iexOpenTime":1641911400308,"iexRealtimePrice":174.93,"iexRealtimeSize":100,"iexVolume":956582,"lastTradeTime":1641934799659,"latestPrice":175.08,"latestSource":"Close","latestTime":"January 11, 2022","latestUpdate":1641934800998,"latestVolume":76137861,"low":170.82,"lowSource":"15 minute delayed price","lowTime":1641912928335,"marketCap":2859821674680,"oddLotDelayedPrice":175.01,"oddLotDelayedPriceTime":1641934795584,"open":172.19,"openTime":1641911402394,"openSource":"official","peRatio":15.59,"previousClose":172.19,"previousVolume":106765552,"primaryExchange":"NASDAQ","symbol":"AAPL","volume":76137861,"week52High":182.94,"week52Low":115.67,"ytdChange":-0.01351791068311083,"isUSMarketOpen":false}'
  // const stockJSON = JSON.parse(string)
  // return stockJSON
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

export async function getAllUserJSON(): Promise<userJSON[] | void> {
  const response = await fetch(`http://localhost:5000/users/`);
  if (!response.ok) {
    const message = `An error occured: ${response.statusText}`;
    window.alert(message);
    return;
  }

  const users = await response.json();
  return users;
}

export async function getThisUserJSON(token: string) {
  // const users = await getAllUserJSON()
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

export async function getThisUserStocks(id: string) {
  const response = await fetch(`http://localhost:5000/users/${id}`);
  if (response) {
    const user = await response.json();
    return user.stocks;
  }
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
export type IntervalFunction = () => unknown | void;

export function useInterval(callback: IntervalFunction, delay: number) {
  const savedCallback = useRef<IntervalFunction | null>(null);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  });

  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (savedCallback.current !== null) {
        savedCallback.current();
      }
    }
    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}
