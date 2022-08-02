import { useState } from "react";
import { userJSON } from "../dashboard/interfaces";

interface CreatePortfolioProps {
  userJSON: userJSON;
}

export default function CreatePortfolio(props: CreatePortfolioProps) {
  const [formData, setFormData] = useState({
    portfolioName: "My First Portfolio",
    cash: 1000000,
  });

  function updateFormData(value: any) {
    return setFormData((prev) => {
      return { ...prev, ...value };
    });
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // validate?
    const editedUser = {
      portfolio: {
        name: formData.portfolioName,
        cash: formData.cash,
      },
      stocks: [],
    };

    console.log(props.userJSON);

    fetch(`http://localhost:5000/update/${props.userJSON._id}`, {
      method: "POST",
      body: JSON.stringify(editedUser),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  return (
    <div id="createPortfolioContainer">
      <form id="createPortfolioForm" onSubmit={(e) => onSubmit(e)}>
        <div id="portfolioNameInput">
          <label htmlFor="portfolioName">Your portfolio name: </label>
          <input
            type="portfolioName"
            name="portfolioName"
            defaultValue="My First Portfolio"
            onChange={(e) => updateFormData({ portfolioName: e.target.value })}
          />
        </div>
        <div id="cashInput">
          <label htmlFor="cash">Starting Cash: </label>
          <input
            type="cash"
            name="cash"
            defaultValue="100000"
            onChange={(e) => updateFormData({ cash: e.target.value })}
          />
        </div>
        <input type="submit" value="Create" />
      </form>
    </div>
  );
}
