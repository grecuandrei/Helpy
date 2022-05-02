import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { NavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import AuthenticationButton from "./AuthenticationButton";

const guestItem = [{ path: "/", title: "Home" }];

const authItem = [
  ...guestItem,
  { path: "/profile", title: "Profile" },
  { path: "/ads", title: "Ads" },
];

const NavBar = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
      <Container>
        <Navbar.Brand href="#home" />
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            {(isAuthenticated ? authItem : guestItem).map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                exact
                className="nav-link"
              >
                {item.title}
              </NavLink>
            ))}
          </Nav>
          <Nav>
            <AuthenticationButton />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;