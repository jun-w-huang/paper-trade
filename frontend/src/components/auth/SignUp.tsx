import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/SignUp.css";

export default function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //.. handle submit
    // .. check that this username doesn't exist
    //.. send to database
    // redirect to main page.

    const newUser = formData;

    fetch(`http://localhost:5000/users/add`, {
      method: "POST",
      body: JSON.stringify(newUser),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        const isJson = response.headers
          .get("content-type")
          ?.includes("application/json");
        const data = isJson && (await response.json());

        // check for error response
        if (!response.ok) {
          // return error to catch block
          return Promise.reject(data);
        }
        // no error, continue to redirect to login page.
        navigate("/login");
      })
      .catch((err) => {
        console.log("Error found!");
        setErrorMessage(err.msg);
      });
  };

  function updateFormData(value: any) {
    return setFormData((prev) => {
      return { ...prev, ...value };
    });
  }

  return (
    <div id="signUpContainer">
      <form id="signUpForm" onSubmit={onSubmit}>
        <div id="usernameInput">
          <label htmlFor="username">Create a username: </label>
          <input
            type="text"
            id="username"
            defaultValue=""
            onChange={(e) => updateFormData({ username: e.target.value })}
          />
        </div>
        <div id="passwordInput">
          <label htmlFor="password">Password: </label>
          <input
            type="text"
            id="password"
            defaultValue=""
            onChange={(e) => updateFormData({ password: e.target.value })}
          />
        </div>
        <div id="errorDisplay">
          <p>{errorMessage}</p>
        </div>
        <input type="submit" value="Register!" />
      </form>
    </div>
  );
}
