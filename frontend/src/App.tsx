import { Route, Routes } from "react-router-dom";
import Dashboard from "./dashboard/Dashboard";
import LandingPage from "./landingPage/LandingPage";
import React from "react";
import SignUp from "./auth/SignUp";
import Login from "./auth/Login";

class App extends React.Component {
  initialState = {
    token: "",
    isLoggedIn: false,
  };
  state = this.initialState;

  handleLogin(token: string) {
    this.setState({
      token: token,
      isLoggedIn: true,
    });
  }

  render() {
    this.handleLogin = this.handleLogin.bind(this);
    return (
      <div>
        <Routes>
          <Route path="*" element={<LandingPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/login"
            element={<Login handleLogin={this.handleLogin} />}
          />
          {this.state.isLoggedIn && (
            <Route
              path="/dashboard"
              element={<Dashboard token={this.state.token} />}
            />
          )}
        </Routes>
      </div>
    );
  }
}

export default App;
