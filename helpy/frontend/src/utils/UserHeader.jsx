import React, { useState, useEffect } from "react";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import "../styling/admin.tailwind.css";
import Avatar from "react-avatar";
import { useAuth0 } from "@auth0/auth0-react";
import { MdTableRows, MdAllInbox, MdAccountBox } from "react-icons/md";

export function CustomLink({ children, to, ...props }) {
  const resolved = useResolvedPath(to);
  const match = useMatch({ path: resolved.pathname, end: true });


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

const UserHeader = () => {
  const { logout, user } = useAuth0();
  const [ userBD, setUserBD ] = useState('');

  const callBackendAPI = async () => {
		const response = await fetch(`${process.env.REACT_APP_NODE_API}/users/guid/${user.sub}`);
		const body = await response.json();

		if (response.status !== 200) {
		throw Error(body.message)
		}
		return body;
	};

	useEffect(() => {
		callBackendAPI()
		.then(res => {
			setUserBD(res)
		})
		.catch(err => console.log(err));
	}, []);

  return (
    <div className="menu">
      <nav className="nav">
        <CustomLink to={"/home"}>
          <MdTableRows /> Ads
        </CustomLink>
        <CustomLink to={"/taken"}>
          <MdAllInbox /> Taken Ads
        </CustomLink>
        <CustomLink to={"/profile"}>
          <MdAccountBox /> Profile
        </CustomLink>
      </nav>
      <div className="profile-container">
        <div className="profile-info">
          <Link className="profile-link capitalize" to="/profile">
            {userBD.surname}
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
        <Avatar name={userBD.surname} round="100px" size="50px" />
      </div>
    </div>
  );
};

export default UserHeader;
