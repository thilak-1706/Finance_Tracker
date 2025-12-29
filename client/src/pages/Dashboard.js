import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import SummaryCards from "../components/SummaryCards";
import ExpenseCategories from "../components/ExpenseCategories";
import RecentTransactions from "../components/RecentTransactions";
import TransactionsTable from "../components/TransactionsTable";
import AddTransactionModal from "../components/AddTransactionModal";
import API from "../api";
import bgImage from "../assets/bg2.jpg";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [user, setUser] = useState(null);

  const loadTransactions = async () => {
    try {
      const res = await API.get("/transactions");
      setTransactions(res.data);
    } catch (err) {
      console.error("Failed to load transactions", err);
    }
  };

  useEffect(() => {
    loadTransactions();

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleAdd = async (tx) => {
    try {
      const res = await API.post("/transactions", tx);
      setTransactions((prev) => [res.data, ...prev]);
      setShowAdd(false);
    } catch (err) {
      console.error("Add failed", err);
    }
  };

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
      <Container fluid className="p-2 p-md-4 bg-white bg-opacity-75 rounded-4 shadow-lg">
        <Row className="mb-4 d-flex justify-content-between align-items-center">
          <Col xs={12} md={8}>
            <h2 className="mb-2 mb-md-0" style={{ fontSize: window.innerWidth < 768 ? '1.5rem' : '2rem' }}>
              {user ? (
                <>
                  <span style={{ color: "#d20404ff" }}>Welcome, </span>
                  <span style={{ color: "black" }}>{user.name}</span>
                </>
              ) : (
                "Finance Tracker"
              )}
            </h2>
            <p className="text-success mb-0">Take control of your financial future</p>
          </Col>
          <Col xs={12} md={4} className="text-end mt-2 mt-md-0">
            <button
              className="btn btn-primary w-100 w-md-auto"
              onClick={() => setShowAdd(true)}
              style={{ 
                borderRadius: '8px',
                fontSize: window.innerWidth < 768 ? '14px' : '16px',
                padding: window.innerWidth < 768 ? '8px 16px' : '10px 20px'
              }}
            >
              + Add Transaction
            </button>
          </Col>
        </Row>

        <SummaryCards transactions={transactions} />

        <Row className="mt-4">
          <Col xs={12} lg={6} className="mb-4 mb-lg-0">
            <ExpenseCategories transactions={transactions} />
          </Col>
          <Col xs={12} lg={6}>
            <RecentTransactions transactions={transactions} />
          </Col>
        </Row>

        <Row className="mt-4 mb-2">
          <Col>
            <TransactionsTable transactions={transactions} setTransactions={setTransactions}/>
          </Col>
        </Row>

        <AddTransactionModal
          show={showAdd}
          onHide={() => setShowAdd(false)}
          onAdd={handleAdd}
        />
      </Container>
    </div>
  );
}
