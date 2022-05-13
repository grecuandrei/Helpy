import React from "react";
import { Link, useLocation, useMatch, useResolvedPath } from "react-router-dom";
import logo from "../assets/logo.svg";
import { MdTableRows, MdLeaderboard } from "react-icons/md";

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

const AdminMenu = () => {
	return (
		<div className="admin-menu">
			<div className="logo-container">
				<img src={logo} alt="Helpy logo" />
			</div>
			<nav className="admin-nav">
				<CustomLink to={"/ads"}>
					<MdTableRows /> Ads
				</CustomLink>
				<CustomLink to={"/analytics"}>
					<MdLeaderboard /> Analytics
				</CustomLink>
			</nav>
		</div>
	);
};

export default AdminMenu;
