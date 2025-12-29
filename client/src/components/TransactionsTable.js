import React, { useState } from "react";
import { Table, Button, Form } from "react-bootstrap";
import API from "../api";

export default function TransactionsTable({
  transactions = [],
  setTransactions,
  fetchTransactions,
  endpoint = "/transactions",
}) {
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({});

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;
    const previous = transactions.slice();
    if (typeof setTransactions === "function") {
      setTransactions(prev => prev.filter(t => t._id !== id));
    }
    try {
      await API.delete(`${endpoint}/${id}`);
    } catch (error) {
      console.error(error);
      if (typeof setTransactions === "function") setTransactions(previous);
      else if (fetchTransactions) await fetchTransactions();
      alert(error?.response?.data?.message || error.message || "Failed to delete");
    }
  };

  // START EDIT
  const handleEdit = (transaction) => {
    setEditId(transaction._id);
    setFormData({
      date: transaction.date?.split("T")[0],
      type: transaction.type,
      category: transaction.category,
      description: transaction.description,
      amount: transaction.amount,
    });
  };

  // SAVE EDIT
  const handleSave = async (id) => {
    try {
      const payload = {
        ...formData,
        amount: Number(formData.amount),
        date: new Date(formData.date).toISOString(),
      };
      const res = await API.put(`${endpoint}/${id}`, payload);

      if (typeof setTransactions === "function") {
        setTransactions(prev => prev.map(t => t._id === id ? res.data : t));
      } else if (fetchTransactions) {
        await fetchTransactions();
      }

      setEditId(null);
      setFormData({});
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || error.message || "Failed to update");
    }
  };

  return (
    <div className="card p-3 shadow-lg" style={{ borderRadius: '15px', border: 'none' }}>
      <h5 className="mb-4 text-center" style={{ color: '#d20404ff', fontWeight: 'bold' }}>All Transactions</h5>
      <div className="table-responsive" style={{ borderRadius: '10px', overflow: 'hidden' }}>
        <Table hover responsive bordered className="mb-0" style={{ border: '1px solid #dee2e6' }}>
          <thead>
            <tr>
              <th style={{ border: 'none', padding: '15px', fontWeight: '700', color: '#000' }}>Date</th>
              <th style={{ border: 'none', padding: '15px', fontWeight: '700', color: '#000' }}>Type</th>
              <th style={{ border: 'none', padding: '15px', fontWeight: '700', color: '#000' }}>Category</th>
              <th style={{ border: 'none', padding: '15px', fontWeight: '700', color: '#000' }}>Description</th>
              <th style={{ border: 'none', padding: '15px', fontWeight: '700', color: '#000' }}>Amount</th>
              <th style={{ border: 'none', padding: '15px', fontWeight: '700', color: '#000' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t._id} style={{ borderBottom: '1px solid #e9ecef', color: '#000' }}>
                {editId === t._id ? (
                  <>
                    <td style={{ border: 'none', padding: '15px' }}>
                      <Form.Control
                        type="date"
                        value={formData.date || ""}
                        onChange={e => setFormData({...formData, date: e.target.value})}
                        style={{ borderRadius: '8px', border: '1px solid #ced4da' }}
                      />
                    </td>
                    <td style={{ border: 'none', padding: '15px' }}>
                      <Form.Select
                        value={formData.type || ""}
                        onChange={e => setFormData({...formData, type: e.target.value})}
                        style={{ borderRadius: '8px', border: '1px solid #ced4da' }}
                      >
                        <option value="Income">Income</option>
                        <option value="Expense">Expense</option>
                      </Form.Select>
                    </td>
                    <td style={{ border: 'none', padding: '15px' }}>
                      <Form.Control
                        value={formData.category || ""}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                        style={{ borderRadius: '8px', border: '1px solid #ced4da' }}
                      />
                    </td>
                    <td style={{ border: 'none', padding: '15px' }}>
                      <Form.Control
                        value={formData.description || ""}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        style={{ borderRadius: '8px', border: '1px solid #ced4da' }}
                      />
                    </td>
                    <td style={{ border: 'none', padding: '15px' }}>
                      <Form.Control
                        type="number"
                        value={formData.amount || ""}
                        onChange={e => setFormData({...formData, amount: Number(e.target.value)})}
                        style={{ borderRadius: '8px', border: '1px solid #ced4da' }}
                      />
                    </td>
                    <td style={{ border: 'none', padding: '15px' }}>
                      <div className="d-flex gap-2">
                        <Button
                          size="sm"
                          variant="success"
                          style={{ width: "70px", borderRadius: '8px', fontWeight: '500' }}
                          onClick={() => handleSave(t._id)}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          style={{ width: "70px", borderRadius: '8px', fontWeight: '500' }}
                          onClick={() => {
                            setEditId(null);
                            setFormData({});
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={{ border: 'none', padding: '15px', fontWeight: '600', color: '#000' }}>
                      {new Date(t.date).toLocaleDateString()}
                    </td>
                    <td style={{ border: 'none', padding: '15px', color: '#000' }}>
                      <span 
                        className={`badge ${t.type === 'Income' ? 'bg-success' : 'bg-danger'}`}
                        style={{ borderRadius: '6px', fontSize: '0.8em' }}
                      >
                        {t.type}
                      </span>
                    </td>
                    <td style={{ border: 'none', padding: '15px', fontWeight: '500', color: '#000' }}>
                      {t.category || '-'}
                    </td>
                    <td style={{ border: 'none', padding: '15px', fontWeight: '500', color: '#000' }}>
                      {t.description || '-'}
                    </td>
                    <td style={{ 
                      border: 'none', 
                      padding: '15px', 
                      fontWeight: 'bold',
                      color: t.type === "Income" ? "#28a745" : "#dc3545"
                    }}>
                      {t.type === "Income" ? "+" : "-"}₹{Number(t.amount).toFixed(2)}
                    </td>
                    <td style={{ border: 'none', padding: '15px' }}>
                      <div className="d-flex gap-2">
                        <Button
                          size="sm"
                          variant="primary"
                          style={{ width: "70px", borderRadius: '8px', fontWeight: '500' }}
                          onClick={() => handleEdit(t)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          style={{ width: "70px", borderRadius: '8px', fontWeight: '500' }}
                          onClick={() => handleDelete(t._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-muted py-4" style={{ border: 'none' }}>
                  <i className="fas fa-inbox fa-2x mb-2"></i>
                  <br />
                  No transactions yet
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
