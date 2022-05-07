import React from "react";
import { Link } from "react-router-dom";
import Avatar from "react-avatar";
import { useAuth0 } from "@auth0/auth0-react";

const AdminHeader = ({ children }) => {
  const { logout, user } = useAuth0();

  return (
    <div className="header">
      <div className="profile-container">
        <div className="profile-info">
          <p className="capitalize">{user.nickname}</p>
          <Link
            to="/"
            onClick={() => {
              logout({ returnTo: window.location.origin });
            }}
          >
            Signout
          </Link>
        </div>
        <Avatar name={user.nickname} round="100px" size="50px" />
      </div>
    </div>
  );
};

export default AdminHeader;
