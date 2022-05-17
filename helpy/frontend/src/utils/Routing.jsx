import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Analytics from "../pages/Admin/Analytics";
import Book from "../pages/Admin/Book";
import UserAds from "../pages/User/Ads";
import UserTaken from "../pages/User/Taken";
import Ads from "../pages/Admin/Books";
import Account from "../pages/User/Account";
import { useAuth0 } from "@auth0/auth0-react";
import Profile from "../pages/Profile";
import RegisterModal from "../components/modals/RegisterModal";
import { Navigate } from "react-router-dom";

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
		const response = await fetch(`http://localhost:8000/api/users/guid/${user.sub}`);
		const body = await response.json();

		if (response.status !== 200 && response.status !== 404) {
			throw Error(body.message)
		}
		return response;
	};

	function Register() {
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

		return <div>Loading...</div>;
	}

	return (
		isAuthenticated && (
		<BrowserRouter>
			<Routes>
			<Route exact path="/" element={Register()} />
			<Route exact path="/home" element={<UserAds/>} />
			<Route exact path="/register" element={<RegisterModal modalIsOpen={openedModal} closeModal={() => setOpenedModal(false)} userGUID={user.sub} userEmail={user.name}/>} />
			<Route exact path="/taken" element={<UserTaken userGUID={user}/>} />
			<Route exact path="/profile" element={<Profile userGUID={user.sub}/>} />
			<Route exact path="/ads" element={<Ads/>} />
			{/* <Route exact path="/books/:id" element={<Book />} /> */}
			{/* <Route exact path="/analytics" element={<Analytics />} /> */}
			</Routes>
		</BrowserRouter>
		)
	);
};

export default Router;
