import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authSettings } from "../AuthSettings";
import AdminHeader from "./AdminHeader";
import logo from "../assets/logo.svg";

const AdminLayout = ({ children }) => {
  const { user } = useAuth0();
  const navigate = useNavigate();

  /* inseamna ca are utilizator ca si rol, deci nu poate vedea partea de admin */
  useEffect(() => {
    if (user && user[authSettings.rolesKey].length === 0) {
      navigate("/home");
    }
  }, [ navigate, user]);

  return (
    <div className="user-layout">
      <AdminHeader />
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

export default AdminLayout;
