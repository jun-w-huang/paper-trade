import { ReactElement, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Portfolio, Stock } from "./interfaces";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

interface PieChartProps {
  portfolio: Portfolio;
  stocks: Stock[];
}

ChartJS.register(ArcElement, Tooltip, Legend);

export function PieChart(props: PieChartProps): ReactElement {
  const labels = (): Array<String> => {
    var result: Array<String> = Array<String>();
    result.push("Cash");
    props.stocks.map((stock) => {
      result.push(stock.symbol);
    });
    return result;
  };

  const stockValues = (): Array<Number> => {
    var result: Array<Number> = Array<Number>();
    result.push(props.portfolio.cash);
    for (let i = 0; i < props.stocks.length; i++) {
      const stock = props.stocks[i];
      result.push(stock.latestPrice * stock.quantity);
    }
    return result;
  };
  const data = {
    labels: labels(),
    datasets: [
      {
        label: "# of Votes",
        data: stockValues(),
        backgroundColor: [
          "rgba(255, 99, 132, 0.3)",
          "rgba(54, 162, 235, 0.3)",
          "rgba(255, 206, 86, 0.3)",
          "rgba(75, 192, 192, 0.3)",
          "rgba(153, 102, 255, 0.3)",
          "rgba(255, 159, 64, 0.3)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="component" id="doughnut-container">
      <Doughnut data={data} />
    </div>
  );
}
