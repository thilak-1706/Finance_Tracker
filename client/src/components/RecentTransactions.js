import React from "react";
import { Card, ListGroup } from "react-bootstrap";

export default function RecentTransactions({ transactions = [] }) {
  const recent = transactions.slice(0, 6);

  if (transactions.length === 0) {
    return (
      <Card className="p-4 shadow mt-4" style={{ minHeight: "400px" }}>
        <h5 className="text-danger">Recent Transactions</h5>
        <div className="text-muted mt-3">
          No transactions yet — add your first transaction to get started
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 shadow-lg mt-4" style={{ 
      height: "450px", 
      borderRadius: '15px', 
      border: 'none' 
    }}>
      <h5 className="text-center mb-3" style={{ 
        color: '#d20404ff', 
        fontWeight: 'bold',
        fontSize: window.innerWidth < 768 ? '1.1rem' : '1.25rem'
      }}>
        Recent Transactions
      </h5>
      <ListGroup variant="flush" style={{ maxHeight: '350px', overflowY: 'auto' }}>
        {recent.map((t) => (
          <ListGroup.Item 
            key={t._id || Math.random()} 
            style={{ 
              border: 'none', 
              borderBottom: '1px solid #e9ecef',
              padding: window.innerWidth < 768 ? '12px 0' : '15px 0'
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div style={{ flex: 1, minWidth: 0 }}>
                <div 
                  className="fw-bold" 
                  style={{ 
                    fontSize: window.innerWidth < 768 ? '0.9rem' : '1rem',
                    color: '#495057'
                  }}
                >
                  {t.category || 'Other'}
                </div>
                <small className="text-muted" style={{ fontSize: '0.8rem' }}>
                  {new Date(t.date).toLocaleDateString()}
                </small>
                {t.description && (
                  <div className="text-muted" style={{ 
                    fontSize: '0.75rem',
                    marginTop: '2px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {t.description}
                  </div>
                )}
              </div>
              <div
                className={`fw-bold ${t.type === "Income" ? "text-success" : "text-danger"}`}
                style={{ 
                  fontSize: window.innerWidth < 768 ? '0.9rem' : '1rem',
                  textAlign: 'right',
                  minWidth: 'fit-content',
                  marginLeft: '10px'
                }}
              >
                {t.type === "Income" ? "+" : "-"}₹{Number(t.amount).toFixed(2)}
              </div>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  );
}
