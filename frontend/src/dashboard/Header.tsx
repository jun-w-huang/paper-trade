import { NavLink } from "react-router-dom";

interface HeaderProps {
  username: string;
}

export default function Header(props: HeaderProps) {
  return (
    <div className="component">
      <div id="header">
        <div>
          <header id="title">Paper Trade</header>
        </div>
        <div id="header-subcontainer">
          <p> Logged in as: {props.username}</p>
          <NavLink className="nav-link" to="/">
            Sign Out
          </NavLink>
        </div>
      </div>
    </div>
  );
}
