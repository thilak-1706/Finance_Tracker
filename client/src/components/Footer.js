import React from "react";
import { Container } from "react-bootstrap";

export default function Footer() {
  return (
    <footer className="bg-primary text-light py-3">
      <Container className="text-center">
        <h5 className="mb-2 text-dark">Contact Us</h5>

        <p className="mb-2">
          📞 <a href="tel:9944892796" className="text-light text-decoration-none">9944892796</a> | 
          📧 <a href="mailto:financetracker@gmail.com" className="text-light text-decoration-none"> financetracker@gmail.com</a>
        </p>

        <small className="d-block mt-2 text-dark">
          &copy; {new Date().getFullYear()} Finance Tracker. All rights reserved.
        </small>
      </Container>
    </footer>
  );
}
