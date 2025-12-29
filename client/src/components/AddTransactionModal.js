import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, ToggleButton } from "react-bootstrap";

const DEFAULT_CATEGORIES = ["Select a Category", "Bills", "Food", "Mobile Recharge", "Orders", "Parents Given", "Salary", "Scholorship", "Shopping",  "Xerox", "Others"];

export default function AddTransactionModal({ show, onHide, onAdd }) {
  const [type, setType] = useState("Expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(DEFAULT_CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (show) {
      // prefill today's date and default category whenever modal opens
      setDate(new Date().toISOString().split("T")[0]);
      setCategory(DEFAULT_CATEGORIES[0]);
      setType("Expense");
      setAmount("");
      setDescription("");
    }
  }, [show]);

  const submit = (e) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return alert("Enter a valid amount");

    const payload = {
      type, // "Income" or "Expense"
      amount: Number(amount),
      category: category || "Other",
      description,
      date: date || new Date().toISOString()
    };

    onAdd(payload);
    onHide(); // close modal after adding
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={submit}>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">Add Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-3 g-2">
            <Col xs={6}>
              <ToggleButton
                id="t-income"
                type="radio"
                variant={type === "Income" ? "outline-success" : "outline-secondary"}
                className="w-100"
                checked={type === "Income"}
                onChange={() => setType("Income")}
              >
                Income
              </ToggleButton>
            </Col>
            <Col xs={6}>
              <ToggleButton
                id="t-expense"
                type="radio"
                variant={type === "Expense" ? "outline-danger" : "outline-secondary"}
                className="w-100"
                checked={type === "Expense"}
                onChange={() => setType("Expense")}
              >
                Expense
              </ToggleButton>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              placeholder="Enter the Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
              {DEFAULT_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Cancel</Button>
          <Button variant="primary" type="submit">Add Transaction</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
