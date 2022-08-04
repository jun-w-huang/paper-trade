import { NavLink } from "react-router-dom";
import "../styles/LandingPage.css";
import stonks_jpg from "../res/stonks.jpg";

export default function LandingPage() {
  return (
    <div id="background-container">
      <div id="title-navlinks-container">
        <div id="titles-container">
          <div id="title">
            <header>Paper Trade</header>
          </div>
          <div id="subtitle">
            Develop a false sense of investing competency so that you can lose
            all your hard earned savings in the real world.
          </div>
        </div>

        <div id="nav-links-container">
          <hr id="separator"></hr>
          <NavLink className="nav-link" to="/login">
            Login
          </NavLink>
          <NavLink className="nav-link" to="/signup">
            Sign up
          </NavLink>
        </div>
      </div>
      <div id="images-container">
        {/* source of stonks_jpg
        https://pbs.twimg.com/profile_images/1521648739840057344/seS95AMn_400x400.jpg */}
        <img className="image" src={stonks_jpg} alt="stonks.jpg" />
      </div>
    </div>
  );
}
