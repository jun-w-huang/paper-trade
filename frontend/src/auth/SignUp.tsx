import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/Auth.css";

// Renders sign up page and handles sign up attempts
export default function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newUser = formData;

    // attempt to register new user in database
    fetch(`http://localhost:5000/users/add`, {
      method: "POST",
      body: JSON.stringify(newUser),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        const data = await response.json();
        // check for erroneous response
        if (!response.ok) {
          // return error to catch block
          return Promise.reject(data);
        }
        // no error, continue to redirect to login page.
        navigate("/login");
      })
      .catch((err) => {
        setErrorMessage(err.msg);
      });
  };

  function updateFormData(value: any) {
    return setFormData((prev) => {
      return { ...prev, ...value };
    });
  }

  return (
    <div id="background-container">
      <div id="auth">
        <div id="title">
          <header>Paper Trade</header>
        </div>
        <hr id="separator"></hr>
        <form id="auth-form" onSubmit={onSubmit}>
          <label htmlFor="username">Create a username: </label>
          <div id="usernameInput">
            <input
              type="text"
              id="username"
              placeholder="username"
              defaultValue=""
              onChange={(e) => updateFormData({ username: e.target.value })}
            />
          </div>
          <label htmlFor="password">Password: </label>
          <div id="passwordInput">
            <input
              type="password"
              id="password"
              placeholder="password"
              defaultValue=""
              onChange={(e) => updateFormData({ password: e.target.value })}
            />
          </div>
          <div id="errorDisplay">{errorMessage}</div>
          <input className="auth-btn" type="submit" value="Register!" />
        </form>
        <hr id="separator"></hr>
        <div id="alt-auth-container">
          <b>Already have an account?</b>
          <NavLink className="nav-link" to="/login">
            Login
          </NavLink>
        </div>
      </div>
    </div>
  );
}
