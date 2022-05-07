import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Analytics from "../pages/Admin/Analytics";
import Book from "../pages/Admin/Book";
import UserBooks from "../pages/User/Books";
import Books from "../pages/Admin/Books";
import Account from "../pages/User/Account";
import { useAuth0 } from "@auth0/auth0-react";

const Router = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (!isAuthenticated) {
      loginWithRedirect();
    }
  }, [isAuthenticated, loginWithRedirect]);

  return (
    isAuthenticated && (
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<UserBooks />} />
          {/* <Route exact path="/profile" element={<Account />} /> */}
          <Route exact path="/books" element={<Books />} />
          {/* <Route exact path="/books/:id" element={<Book />} />
          <Route exact path="analytics" element={<Analytics />} /> */}
        </Routes>
      </BrowserRouter>
    )
  );
};

export default Router;
