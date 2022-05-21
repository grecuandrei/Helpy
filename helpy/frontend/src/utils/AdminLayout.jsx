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
    const callBackendAPI = async () => {
      const response = await fetch(`${process.env.REACT_APP_NODE_API}/users/guid/${user.sub}`);
      const body = await response.json();
  
      if (response.status !== 200) {
      throw Error(body.message)
      }
      return body;
    };
    callBackendAPI().then(result => {
      if (!result.isPublisher) {
        navigate("/home");
      }
    })
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
