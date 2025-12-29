import React from "react";
import { Card, Row, Col, ListGroup } from "react-bootstrap";
import bgImage from "../assets/bg2.jpg";

export default function About() {
  return (
    <div
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <div className="p-2 p-md-4 bg-white bg-opacity-75 rounded-4 shadow-lg">
        {/* App Title */}
        <h2 className="text-center text-primary mb-4 fw-bold" style={{
          fontSize: window.innerWidth < 768 ? '1.5rem' : '2rem'
        }}>
          💰 About <span style={{ color: "#d20404ff" }}>Finance</span>{" "}
          <span style={{ color: "black" }}>Tracker</span>
        </h2>
        <p className="text-muted text-center" style={{
          fontSize: window.innerWidth < 768 ? '1rem' : '1.25rem'
        }}>
          <strong>Finance Tracker</strong> is your personal companion for managing
          income, expenses, and savings. We simplify money management so you can
          focus on your goals and build financial confidence 🚀.
        </p>

        {/* Who We Are */}
        <Card className="shadow-sm border-0 my-4 bg-light rounded-3">
          <Card.Body>
            <h4 className="text-secondary mb-3">👥 Who We Are</h4>
            <p className="text-muted">
              We are a passionate team of developers and finance enthusiasts dedicated
              to creating tools that make financial management simple, transparent,
              and accessible for everyone.
            </p>
          </Card.Body>
        </Card>

        {/* Mission & Vision */}
        <Row className="my-4">
          <Col xs={12} md={6} className="mb-3">
            <Card className="shadow border-0 h-100 rounded-3">
              <Card.Body>
                <h4 className="text-secondary" style={{
                  fontSize: window.innerWidth < 768 ? '1.1rem' : '1.25rem'
                }}>
                  🎯 Our Mission
                </h4>
                <p className="text-muted" style={{
                  fontSize: window.innerWidth < 768 ? '0.9rem' : '1rem'
                }}>
                  Empower individuals to manage their finances better by providing a
                  simple, reliable, and insightful financial tracking platform.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={6} className="mb-3">
            <Card className="shadow border-0 h-100 rounded-3">
              <Card.Body>
                <h4 className="text-secondary" style={{
                  fontSize: window.innerWidth < 768 ? '1.1rem' : '1.25rem'
                }}>
                  🌍 Our Vision
                </h4>
                <p className="text-muted" style={{
                  fontSize: window.innerWidth < 768 ? '0.9rem' : '1rem'
                }}>
                  To be the most trusted personal finance app that helps people achieve
                  financial freedom and stability.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="g-4 my-4">

  {/* Why Choose Us */}
  <Col md={6}>
    <Card className="shadow-sm border-0 rounded-3 h-100">
      <Card.Body>
        <h4 className="text-secondary mb-3">💡 Why Choose Finance Tracker?</h4>
        <ListGroup variant="flush">
          <ListGroup.Item className="border-0">✅ User-friendly interface</ListGroup.Item>
          <ListGroup.Item className="border-0">✅ Accurate expense categorization & insights</ListGroup.Item>
          <ListGroup.Item className="border-0">✅ Exportable reports for tracking</ListGroup.Item>
          <ListGroup.Item className="border-0">✅ Secure authentication with JWT</ListGroup.Item>
          <ListGroup.Item className="border-0">✅ Fully responsive design</ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  </Col>

  {/* Features */}
  <Col md={6}>
    <Card className="shadow-sm border-0 rounded-3 bg-light h-100">
      <Card.Body>
        <h4 className="text-secondary mb-3">✨ Key Features</h4>
        <ListGroup variant="flush">
          <ListGroup.Item className="border-0">✅ Add & categorize income and expenses</ListGroup.Item>
          <ListGroup.Item className="border-0">✅ View interactive dashboard</ListGroup.Item>
          <ListGroup.Item className="border-0">✅ Generate & export monthly reports</ListGroup.Item>
          <ListGroup.Item className="border-0">✅ Monitor financial growth</ListGroup.Item>
          <ListGroup.Item className="border-0">✅ Secure login with JWT</ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  </Col>

  {/* Tech Stack */}
  <Col md={6}>
    <Card className="shadow-sm border-0 rounded-3 bg-light h-100">
      <Card.Body>
        <h4 className="text-secondary mb-3">⚙️ Technologies Used</h4>
        <ListGroup variant="flush">
          <ListGroup.Item className="border-0">💻 MongoDB – NoSQL database</ListGroup.Item>
          <ListGroup.Item className="border-0">⚡ Express.js – Backend framework</ListGroup.Item>
          <ListGroup.Item className="border-0">🖥️ React.js – Frontend library</ListGroup.Item>
          <ListGroup.Item className="border-0">🔧 Node.js – Backend runtime</ListGroup.Item>
          <ListGroup.Item className="border-0">🎨 Bootstrap – Responsive design</ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  </Col>

  {/* Future Plans */}
  {/* Future Plans */}
<Col md={6}>
  <Card className="shadow-sm border-0 rounded-3 h-100">
    <Card.Body>
      <h4 className="text-secondary mb-3">🚀 Future Plans</h4>
      <ListGroup variant="flush">
        <ListGroup.Item className="border-0">📊 AI-powered financial recommendations</ListGroup.Item>
        <ListGroup.Item className="border-0">💳 Bank account integration</ListGroup.Item>
        <ListGroup.Item className="border-0">📱 Mobile app with offline support</ListGroup.Item>
        <ListGroup.Item className="border-0">🧾 Smart bill reminders & alerts</ListGroup.Item>
        <ListGroup.Item className="border-0">🌐 Multi-language support</ListGroup.Item>
      </ListGroup>
    </Card.Body>
  </Card>
</Col>


</Row>


        {/* Contact */}
        <Card className="shadow-sm border-0 p-3 text-center rounded-3 bg-danger text-white">
          <h4 className="mb-3" style={{
            fontSize: window.innerWidth < 768 ? '1.1rem' : '1.25rem'
          }}>
            📞 Contact Us
          </h4>
          <p className="mb-0" style={{
            fontSize: window.innerWidth < 768 ? '0.9rem' : '1.25rem'
          }}>
            📞 9944892796 | 📧 financetracker@gmail.com
          </p>
        </Card>
      </div>
    </div>
  );
}
