import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "./scss/header.scss";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <Navbar expand="lg" fixed="top" className="bg-white fw-bolder fs-6 shadow">
      <Container>
        <Navbar.Brand href="#home" className="fs-5">
          <a href="/">
            <img src="/NameLogo.svg" style={{ width: "700%" }} />
          </a>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#about">About</Nav.Link>
            <NavDropdown title="Projects" id="basic-nav-dropdown">
              <NavDropdown.Item href="#projects/hachudc2023">
                HackUDC 2023
              </NavDropdown.Item>
              <NavDropdown.Item href="#projects/aceptaelreto">
                Acepta el reto
              </NavDropdown.Item>
              <NavDropdown.Item href="#projects/hachudc2024">
                HackUDC 2024
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
