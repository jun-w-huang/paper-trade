import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <div className="component">
      <div id="header">
        <header id="title">Paper Trade</header>
        <NavLink className="nav-link" to="/">
          Sign Out
        </NavLink>
      </div>
    </div>
  );
}
