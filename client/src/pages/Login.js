import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert, Image } from "react-bootstrap";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!email.trim() || !password) {
      setErr("Email and password are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({ name: res.data.name, email: res.data.email })
      );
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setErr(error.response?.data?.message || "Login failed. Please try again.");
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
        background: "linear-gradient(135deg, #0066cc, #00cc99)", // ✅ background color/gradient
        padding: "20px",
      }}
    >
      <Container>
        <Row className="justify-content-center align-items-center">
          <Col xs={12} sm={10} md={6} lg={5}>
            <Card
              style={{
                borderRadius: "15px",
                padding: window.innerWidth < 768 ? "20px" : "25px",
                backgroundColor: "#eee",
                boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                margin: window.innerWidth < 768 ? "10px" : "0"
              }}
            >
              <Card.Body>
                <div className="brand text-center mb-4">
                  <Image
                    src="/logo2.png" // replace with correct path
                    alt="Logo"
                    className="mb-3"
                    roundedCircle
                    style={{ 
                      width: window.innerWidth < 768 ? "60px" : "70px", 
                      height: window.innerWidth < 768 ? "60px" : "70px" 
                    }}
                  />
                  <h2 style={{ 
                    fontWeight: "600", 
                    color: "#333",
                    fontSize: window.innerWidth < 768 ? "1.5rem" : "2rem"
                  }}>
                    Finanse Tracker
                  </h2>
                  <p style={{ 
                    color: "#6c757d",
                    fontSize: window.innerWidth < 768 ? "0.9rem" : "1rem"
                  }}>
                    Welcome back! Please login to your account.
                  </p>
                </div>

                {err && <Alert variant="danger">{err}</Alert>}

                <Form onSubmit={submit}>
                  <Form.Group className="mb-3" controlId="loginEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="loginPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
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
                    style={{
                      backgroundColor: "#0066cc",
                      border: "none",
                      fontWeight: "500",
                      padding: window.innerWidth < 768 ? "12px" : "10px",
                      fontSize: window.innerWidth < 768 ? "14px" : "16px",
                      borderRadius: "8px"
                    }}
                  >
                    {loading ? "Logging in…" : "Login"}
                  </Button>
                </Form>

                <div className="text-center">
                  <small style={{ color: "#6c757d" }}>
                    Don&apos;t have an account?{" "}
                    <Link to="/register" style={{ color: "#0066cc", fontWeight: "500" }}>
                      Register
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
