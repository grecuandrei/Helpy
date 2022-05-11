import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Analytics from "../pages/Admin/Analytics";
import Book from "../pages/Admin/Book";
import UserAds from "../pages/User/Books";
import Ads from "../pages/Admin/Books";
import Account from "../pages/User/Account";
import { useAuth0 } from "@auth0/auth0-react";
import AccountModal from "../components/modals/AccountModal";
import RegisterModal from "../components/modals/RegisterModal";

const Router = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const [openedModal, setOpenedModal] = useState(true);
  const [userExists, setUserExists] = useState(false);
  const [isPublisher, setIsPublisher] = useState(false);
  
  useEffect(() => {
    // console.log(user.sub)
    // fetch(`https://localhost:8000/api/users/register/${user.sub}`)
    //   .then(res => {res.json(); console.log(res)})
    //   .then(
    //     (result) => {
    //       setUserExists(true);
    //     },
    //     (error) => {
    //       console.log(error)
    //       setUserExists(false);
    //     }
    //   )

    const callBackendAPI = async () => {
      const response = await fetch(`http://localhost:8000/api/users/register/${user.sub}`);
      const body = await response.json();
  
      if (response.status !== 200) {
        throw Error(body.message)
      }
      return body;
    };

    callBackendAPI()
      .then(res => {
        setUserExists(true)
        setIsPublisher(res.isPublisher)
      })
      .catch(err => setUserExists(false));

    if (!isAuthenticated) {
      loginWithRedirect();
    }
  }, [ user?.sub, isAuthenticated, loginWithRedirect]);

  function Register(props) {
    const userExists = props.userExists;
    if (userExists) {
      return <UserAds isPublisher={isPublisher}/>
    } else {
      return <RegisterModal modalIsOpen={openedModal} closeModal={() => {setOpenedModal(false);}} userGUID={user.sub}/>
    }
  }

  return (
    isAuthenticated && (
      <BrowserRouter>
        <Routes>
          {/* <Route exact path="/" element={<UserAds />} /> */}
          <Route exact path="/" element={<Register userExists={userExists}/>} />
          <Route exact path="/home" element={<UserAds/>} />
          {/* <Route exact path="/profile" element={<AccountModal />} /> */}
          <Route exact path="/ads" element={<Ads isPublisher={isPublisher}/>} />
          {/* <Route exact path="/books/:id" element={<Book />} /> */}
          <Route exact path="/analytics" element={<Analytics />} />
        </Routes>
      </BrowserRouter>
    )
  );
};

export default Router;
