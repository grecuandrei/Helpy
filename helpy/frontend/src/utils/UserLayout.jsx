import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authSettings } from "../AuthSettings";
import UserHeader from "./UserHeader";
import logo from "../assets/logo.svg";

const UserLayout = ({ children }) => {
  const { user } = useAuth0();
  const navigate = useNavigate();

  /* inseamna ca are admin ca si rol, deci nu poate vedea partea de utilizator */
  useEffect(() => {
    console.log(user)
    if (user && user[authSettings.rolesKey].length === 1) {
      navigate("/ads");
    }
  }, [user]);

  return (
    <div className="user-layout">
      <UserHeader />
      <div className="user-content">
        <Link to="/">
          <img src={logo} alt="Weblib logo" />
        </Link>
        <div className="user-content-main">
          {children}
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
