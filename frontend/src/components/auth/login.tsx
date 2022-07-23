import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/login.css";

interface loginProps {
  handleLogin: (token: string) => void;
}

export function Login(props: loginProps) {
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
    // check is correct,,, we will skip it for now
    e.preventDefault();

    const userCredentials = formData;
    console.log("username: " + formData.username);
    console.log("pw: " + formData.password);

    // fetchUser
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
    <div id="loginContainer">
      <form id="loginForm" onSubmit={onSubmit}>
        <div id="usernameInput">
          <label htmlFor="username">Username: </label>
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
        <div id="errorDisplay">{errorMessage}</div>
        <input type="submit" value="Login" />
      </form>
    </div>
  );
}
