import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";
import Home from "../views/Home";
import ProtectedRoute from "../auth/ProtectedRoute";
import AdsList from "../views/AdList";
import AddAd from "../views/AddAd";
import Ad from "../views/Ad";
import Profile from "../views/Profile";

const protectedRoutes = [
  { path: "/ads", component: AdsList },
  { path: "/addAd", component: AddAd },
  { path: "/ads/:id", component: Ad },
  { path: "/profile", component: Profile },
];

const AppRouter = () => (
  <Container>
    <Routes>
      <Route path="/" component={<Home/>} />
      {protectedRoutes.map((route) => (
        <ProtectedRoute
          key={route.path}
          path={route.path}
          exact
          component={route.component}
        />
      ))}
      <Navigate to="/" />
    </Routes>
  </Container>
);

export default AppRouter;
