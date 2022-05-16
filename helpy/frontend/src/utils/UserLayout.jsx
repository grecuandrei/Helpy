import { Auth0Context, useAuth0 } from "@auth0/auth0-react";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authSettings } from "../AuthSettings";
import UserHeader from "./UserHeader";
import logo from "../assets/logo.svg";

const UserLayout = ({ children }) => {
  const { user } = useAuth0();
  const navigate = useNavigate();

  /* inseamna ca are admin ca si rol, deci nu poate vedea partea de utilizator */
  console.log(user[authSettings.rolesKey])
  useEffect(() => {
    if (user && user[authSettings.rolesKey].length === 1) {
      navigate("/ads");
    }
  }, [navigate, user]);

  return (
    <div className="user-layout">
      <UserHeader />
      <div className="user-content">
        <Link style={{ height: 'fit-content', width: 'fit-content', paddingLeft: '3px'}} to="/home">
          <img style={{ height: 'fit-content', width: '350px' }} src={logo} alt="Helpy logo" />
        </Link>
        <div className="user-content-main">
          {children}
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
