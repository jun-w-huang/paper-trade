import { Route, Routes } from "react-router-dom";
import PaperTrade from "./PaperTrade";
import Home from "./components/Home";
import React from "react";

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
          <Route
            path="*"
            element={
              <Home token={this.state.token} handleLogin={this.handleLogin} />
            }
          />
          {this.state.isLoggedIn && (
            <Route
              path="/dashboard"
              element={<PaperTrade token={this.state.token} />}
            />
          )}
        </Routes>
      </div>
    );
  }
}

export default App;
