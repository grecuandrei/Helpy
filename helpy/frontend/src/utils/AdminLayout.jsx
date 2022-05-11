import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authSettings } from "../AuthSettings";
import AdminHeader from "./AdminHeader";
import AdminMenu from "./AdminMenu";

const AdminLayout = ({ isPublisher, children }) => {
  const { user } = useAuth0();
  const navigate = useNavigate();

  /* inseamna ca are utilizator ca si rol, deci nu poate vedea partea de admin */
  useEffect(() => {
    if (!isPublisher) navigate("/");
    // if (user && user[authSettings.rolesKey].length === 0) {
    //   navigate("/");
    // }
  }, [ navigate, isPublisher]);

  return (
    <div className="layout">
      <AdminMenu />
      <div className="content">
        <AdminHeader />
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
