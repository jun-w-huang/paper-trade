import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/Auth.css";

interface loginProps {
  setToken: (token: string) => void;
}

/**
 * Renders login page and handles login attempts
 * @param props contains a setToken function called upon valid form submission.
 */
export default function Login(props: loginProps) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  function updateFormData(value: any) {
    return setFormData((prev) => {
      return { ...prev, ...value };
    });
  }

  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userCredentials = formData;

    fetch(`http://localhost:5000/auth/`, {
      method: "POST",
      body: JSON.stringify(userCredentials),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        const user = await response.json();
        props.setToken(user.token);
        navigate("/dashboard");
      })
      .catch((error) => {
        setErrorMessage(error.msg);
      });
  };

  return (
    <div id="background-container">
      <div id="auth">
        <div id="title">
          <header>Paper Trade</header>
        </div>
        <hr id="separator"></hr>
        <form id="auth-form" onSubmit={onSubmit}>
          <label htmlFor="username">Username: </label>
          <div>
            <input
              type="text"
              id="username"
              placeholder="username"
              defaultValue=""
              onChange={(e) => updateFormData({ username: e.target.value })}
            />
          </div>
          <label htmlFor="password">Password: </label>
          <div>
            <input
              type="password"
              id="password"
              placeholder="password"
              defaultValue=""
              onChange={(e) => updateFormData({ password: e.target.value })}
            />
          </div>
          <div id="errorDisplay">{errorMessage}</div>
          <input className="auth-btn" type="submit" value="Login" />
        </form>
        <hr id="separator"></hr>
        <div id="alt-auth-container">
          <b>Don't have an account?</b>
          <NavLink className="nav-link" to="/signup">
            Sign Up
          </NavLink>
        </div>
      </div>
    </div>
  );
}
