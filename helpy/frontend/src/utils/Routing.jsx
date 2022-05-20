import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Analytics from "../pages/Admin/Analytics";
import UserAds from "../pages/User/Ads";
import UserTaken from "../pages/User/Taken";
import Ads from "../pages/Admin/Ads";
import Ad from "../pages/Admin/Ad";
import ProfileAdmin from "../pages/Admin/ProfileAdmin";
import { useAuth0 } from "@auth0/auth0-react";
import Profile from "../pages/User/Profile";
import Register from "../components/modals/Register";
import { Navigate } from "react-router-dom";
import Loading from "../components/Loading";

const Router = () => {
	const { user, isAuthenticated, loginWithRedirect } = useAuth0();
	const [openedModal, setOpenedModal] = useState(true);
	const [userExists, setUserExists] = useState(2);

	useEffect(() => {
		if (!isAuthenticated) {
		loginWithRedirect();
		}
	}, [ isAuthenticated, loginWithRedirect]);

	const callBackendAPI = async () => {
		const response = await fetch(`${process.env.REACT_APP_URL}/users/guid/${user.sub}`);
		const body = await response.json();

		if (response.status !== 200 && response.status !== 404) {
			throw Error(body.message)
		}
		return response;
	};

	function CheckRegister() {
		useEffect(() => {
		callBackendAPI()
		.then(res => {
			if (res.status === 200) {
				setUserExists(1);
			} else if (res.status === 404) {
				setUserExists(0);
			}
		})
		.catch(err => {return err});
		}, []);

		console.log(userExists === 0)

		if (userExists === 1) {
			return <Navigate to={"/home"}/>;
		} else if (userExists === 0) {
			return <Navigate to={"/register"}/>
		}

		return <Loading />;
	}

	return (
		isAuthenticated && ( 
		<BrowserRouter>
			<Routes>
			<Route exact path="/" element={CheckRegister()} />
			<Route exact path="/home" element={<UserAds/>} />
			<Route exact path="/register" element={<Register userGUID={user.sub} userEmail={user.name}/>} />
			<Route exact path="/taken" element={<UserTaken userGUID={user}/>} />
			<Route exact path="/ads" element={<Ads/>} />
			<Route exact path="/ads/:id" element={<Ad/>} />
			<Route exact path="/analytics" element={<Analytics />} />
			<Route exact path="/profile" element={<Profile userGUID={user.sub}/>} />
			<Route exact path="/profileAdmin" element={<ProfileAdmin userGUID={user.sub}/>} />
			</Routes>
		</BrowserRouter>
		)
	);
};

export default Router;
