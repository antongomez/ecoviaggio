import React from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import "./scss/header.scss";

export const Header = () => {
  return (
    <Navbar expand="lg" fixed="top" className="bg-white fw-bolder fs-6 shadow">
      <Container>
        <Navbar.Brand href="/" className="fs-5">
            <img src="/NameLogo.svg" style={{ width: "700%" }} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
      </Container>
    </Navbar>
  );
};
