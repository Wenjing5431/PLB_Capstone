import "../css/Header.css";
import React from "react";
import { Link } from "react-router-dom";

class Header extends React.Component {
  render() {
    console.log("header props", this.props.username);
    const { username } = this.props;
    console.log(username ? "yes" : "no");
    return (
      <div className="ui secondary fixed pointing menu header">
        <Link to="/" className="item">
          <i className="fas fa-rocket header-icon" />
          Personal Learning Booster
        </Link>
        <div className="right menu">
          <Link to="" className="item">
            Github
          </Link>

          {username ? (
            <span className="header-span">
              <p className="item">{username}</p>
              <Link to="/login" className="item">
                Logout
              </Link>
            </span>
          ) : (
            <span className="header-span">
              <Link to="" className="item">
                About Us
              </Link>
              <Link to="/login" className="item login">
                Get Started
              </Link>
            </span>
          )}
        </div>
      </div>
    );
  }
}

export default Header;
