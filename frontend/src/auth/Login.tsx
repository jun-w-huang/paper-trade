import React, { useState } from "react";
import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
import "../styles/Auth.css";

interface loginProps {
  handleLogin: (token: string) => void;
}

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

    const fetchUser = async () => {
      const response = await fetch(`http://localhost:5000/auth/`, {
        method: "POST",
        body: JSON.stringify(userCredentials),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const user = await response.json();
      return user;
    };

    const user = await fetchUser();

    if (user.token) {
      // props.userID = user.id;
      props.handleLogin(user.token);
      navigate("/dashboard");
    } else {
      console.log("error found");
      setErrorMessage(user.msg);
    }
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
