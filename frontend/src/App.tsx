import { Route, Routes } from "react-router-dom";
import Dashboard from "./dashboard/Dashboard";
import LandingPage from "./landingPage/LandingPage";
import React from "react";
import SignUp from "./auth/SignUp";
import Login from "./auth/Login";

class App extends React.Component {
  initialState = {
    token: "",
  };
  state = this.initialState;

  setToken(token: string) {
    this.setState({
      token: token,
    });
  }

  render() {
    this.setToken = this.setToken.bind(this);
    return (
      <div>
        <Routes>
          <Route path="*" element={<LandingPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login setToken={this.setToken} />} />
          {this.state.token && (
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
