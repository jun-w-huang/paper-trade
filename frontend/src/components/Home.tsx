import { NavLink, Route, Routes } from "react-router-dom";
import "../styles/Home.css";
import { Login } from "./auth/login";
import SignUp from "./auth/SignUp";

interface homeProps {
  handleLogin: (token: string) => void;
  token: string;
}

export default function Home(props: homeProps) {
  return (
    <div className="bg-container">
      <div className="home-container">
        <div id="logo">
          <header>Paper Trade</header>
          <p>token is {props.token}</p>
        </div>
        <div id="routes-container">
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/login"
              element={<Login handleLogin={props.handleLogin} />}
            />
          </Routes>
        </div>
        <div id="nav-links">
          <NavLink className="nav-link" to="/signup">
            Create an Account
          </NavLink>
          <NavLink className="nav-link" to="/login">
            Login
          </NavLink>
        </div>
      </div>
    </div>
  );
}
