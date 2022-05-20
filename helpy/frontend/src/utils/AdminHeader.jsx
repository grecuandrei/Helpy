import React from "react";
import { Link, useLocation, useMatch, useResolvedPath } from "react-router-dom";
import Avatar from "react-avatar";
import { useAuth0 } from "@auth0/auth0-react";
import { MdTableRows, MdLeaderboard, MdAccountBox } from "react-icons/md";

export function CustomLink({ children, to, ...props }) {
  const resolved = useResolvedPath(to);
  const location = useLocation();
	const match =
		useMatch({ path: resolved.pathname, end: true }) ??
		location.pathname.includes(to);

  return (
    <div>
      <Link
        to={to}
        {...props}
        className={"nav-link" + (match ? " active" : "")}
      >
        {children}
      </Link>
    </div>
  );
}

const AdminHeader = () => {
  const { logout, user } = useAuth0();

  return (
    <div className="menu">
      <nav className="nav">
      <CustomLink to={"/ads"}>
					<MdTableRows /> Ads
				</CustomLink>
				<CustomLink to={"/analytics"}>
					<MdLeaderboard /> Analytics
				</CustomLink>
        <CustomLink to={"/profile"}>
          <MdAccountBox /> Profile
        </CustomLink>
      </nav>
      <div className="profile-container">
        <div className="profile-info">
          <Link className="profile-link capitalize" to="/profile">
            {user.nickname}
          </Link>
          <div
            className="signout"
            onClick={() => {
              logout({ returnTo: window.location.origin });
            }}
          >
            Signout
          </div>
        </div>
        <Avatar name={user.nickname} round="100px" size="50px" />
      </div>
    </div>
  );
};

export default AdminHeader;
