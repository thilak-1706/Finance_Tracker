import React from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

export default function AppNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // remove JWT
    navigate("/login");
  };

  return (
    <Navbar
      bg="primary"
      variant="dark"
      expand="lg"
      className="px-3"
      style={{ paddingLeft: "15px", paddingRight: "15px" }}
    >
      {/* Brand / Logo */}
      <Navbar.Brand
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: "1.8rem",
          fontWeight: "600",
        }}
      >
        <span style={{ color: "#d20404ff" }}>Finance</span>{" "}
        <span style={{ color: "black" }}>Tracker</span>
      </Navbar.Brand>

      {/* Toggle for mobile */}
      <Navbar.Toggle aria-controls="basic-navbar-nav" />

      <Navbar.Collapse id="basic-navbar-nav">
        {/* Navigation Buttons */}
        <Nav className="me-auto d-flex align-items-center flex-column flex-lg-row">
          <Button
            as={Link}
            to="/dashboard"
            variant="light"
            className="nav-btn mb-2 mb-lg-0 me-lg-2"
          >
            Dashboard
          </Button>
          <Button
            as={Link}
            to="/reports"
            variant="light"
            className="nav-btn mb-2 mb-lg-0 me-lg-2"
          >
            Reports
          </Button>
          <Button
            as={Link}
            to="/about"
            variant="light"
            className="nav-btn mb-2 mb-lg-0 me-lg-2"
          >
            About
          </Button>
        </Nav>

        {/* Logout Button */}
        <Nav>
          <Button variant="light" className="nav-btn" onClick={handleLogout}>
            Logout
          </Button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
