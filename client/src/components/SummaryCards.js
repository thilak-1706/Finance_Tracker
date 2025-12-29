import React from "react";
import { Row, Col, Card } from "react-bootstrap";

export default function SummaryCards({ transactions = [] }) {
  const income = transactions
    .filter(t => t.type === "Income")
    .reduce((s, t) => s + Number(t.amount || 0), 0);
  const expense = transactions
    .filter(t => t.type === "Expense")
    .reduce((s, t) => s + Number(t.amount || 0), 0);
  const balance = income - expense;

  const cardStyle = { minHeight: "100px" };

  return (
    <Row xs={1} sm={2} lg={4} className="g-3">
      <Col>
        <Card className="p-3 shadow-lg" style={{ 
          ...cardStyle, 
          borderRadius: '12px',
          border: 'none'
        }}>
          <div className="text-muted" style={{ fontSize: window.innerWidth < 768 ? '0.9rem' : '1rem' }}>
            Total Balance
          </div>
          <h4 style={{ 
            fontSize: window.innerWidth < 768 ? '1.5rem' : '1.8rem',
            fontWeight: 'bold',
            color: balance >= 0 ? '#28a745' : '#dc3545'
          }}>
            ₹{balance.toFixed(2)}
          </h4>
          <small className={balance >= 0 ? "text-success" : "text-danger"}>
            {balance >= 0 ? "Positive balance" : "Negative balance"}
          </small>
        </Card>
      </Col>
      <Col>
        <Card className="p-3 shadow-lg" style={{ 
          ...cardStyle, 
          borderRadius: '12px',
          border: 'none'
        }}>
          <div className="text-muted" style={{ fontSize: window.innerWidth < 768 ? '0.9rem' : '1rem' }}>
            Total Income
          </div>
          <h4 style={{ 
            fontSize: window.innerWidth < 768 ? '1.5rem' : '1.8rem',
            fontWeight: 'bold',
            color: '#28a745'
          }}>
            ₹{income.toFixed(2)}
          </h4>
          <small className="text-success">Money coming in</small>
        </Card>
      </Col>
      <Col>
        <Card className="p-3 shadow-lg" style={{ 
          ...cardStyle, 
          borderRadius: '12px',
          border: 'none'
        }}>
          <div className="text-muted" style={{ fontSize: window.innerWidth < 768 ? '0.9rem' : '1rem' }}>
            Total Expenses
          </div>
          <h4 style={{ 
            fontSize: window.innerWidth < 768 ? '1.5rem' : '1.8rem',
            fontWeight: 'bold',
            color: '#dc3545'
          }}>
            ₹{expense.toFixed(2)}
          </h4>
          <small className="text-danger">Money going out</small>
        </Card>
      </Col>
      <Col>
        <Card className="p-3 shadow-lg" style={{ 
          ...cardStyle, 
          borderRadius: '12px',
          border: 'none'
        }}>
          <div className="text-muted" style={{ fontSize: window.innerWidth < 768 ? '0.9rem' : '1rem' }}>
            Transactions
          </div>
          <h4 style={{ 
            fontSize: window.innerWidth < 768 ? '1.5rem' : '1.8rem',
            fontWeight: 'bold',
            color: '#495057'
          }}>
            {transactions.length}
          </h4>
          <small className="text-muted">Total recorded</small>
        </Card>
      </Col>
    </Row>
  );
}
