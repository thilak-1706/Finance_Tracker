import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert, Image } from "react-bootstrap";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!name.trim() || !email.trim() || !password) {
      setErr("Name, email and password are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/register", { name, email, password });
      if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({ name: res.data.name, email: res.data.email })
        );
        navigate("/dashboard");
      } else {
        setErr("Registration succeeded but no token received.");
      }
    } catch (error) {
      console.error("Register error:", error);
      setErr(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0066cc, #00cc99)",
        padding: "20px",
      }}
    >
      <Container>
        <Row className="justify-content-center align-items-center">
          <Col md={6} lg={5}>
            <Card
              style={{
                borderRadius: "15px",
                padding: "25px",
                backgroundColor: "#eee",
                boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
              }}
            >
              <Card.Body>
                <div className="brand text-center mb-4">
                  <Image
                    src="/logo3.png"
                    alt="Logo"
                    className="brand-image mb-3"
                    roundedCircle
                    style={{ width: "70px", height: "70px" }}
                  />
                  <h2 style={{ fontWeight: "600", color: "#333" }}>Create Account</h2>
                  <p style={{ color: "#6c757d" }}>
                    Join us today! Fill in your info below.
                  </p>
                </div>

                {err && <Alert variant="danger">{err}</Alert>}

                <Form onSubmit={submit}>
                  <Form.Group className="mb-3" controlId="registerName">
                    <Form.Label>Your Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={loading}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="registerEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="registerPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? "Registering…" : "Register"}
                  </Button>
                </Form>

                <div className="text-center">
                  <small style={{ color: "#6c757d" }}>
                    Already have an account?{" "}
                    <Link to="/login" style={{ color: "#2193b0", fontWeight: "500" }}>
                      Login
                    </Link>
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
