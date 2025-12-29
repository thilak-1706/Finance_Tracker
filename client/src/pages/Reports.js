import React, { useEffect, useState, useMemo } from "react";
import { Container, Row, Col, Card, Form, Button, Table } from "react-bootstrap";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import API from "../api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from 'xlsx';
import bgImage from "../assets/bg2.jpg"; // background image

export default function Reports() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    balance: 0,
    totalTransactions: 0,
  });
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const res = await API.get("/transactions");
        setTransactions(res.data);
      } catch (err) {
        console.error("Failed to load transactions", err);
      }
    };
    loadTransactions();
  }, []);

  // Filter transactions for selected month/year
  const monthTx = useMemo(() => {
    return transactions.filter((tx) => {
      const d = new Date(tx.date);
      return (
        d.getMonth() + 1 === Number(selectedMonth) &&
        d.getFullYear() === Number(selectedYear)
      );
    });
  }, [transactions, selectedMonth, selectedYear]);

  // Calculate summary for selected month
  useEffect(() => {
    let income = 0;
    let expense = 0;
    monthTx.forEach((tx) => {
      if (tx.type === "Income") income += tx.amount;
      if (tx.type === "Expense") expense += tx.amount;
    });
    setSummary({
      income,
      expense,
      balance: income - expense,
      totalTransactions: monthTx.length,
    });
  }, [monthTx]);

  // Chart data
  const chartData = [
    { name: "Income", value: summary.income },
    { name: "Expense", value: summary.expense },
  ];
  const COLORS = ["#28a745", "#dc3545"]; // green, red

  const expenseCategories = useMemo(() => {
    const map = {};
    monthTx
      .filter((t) => t.type === "Expense")
      .forEach((t) => {
        const cat = t.category || "Other";
        map[cat] = (map[cat] || 0) + Number(t.amount || 0);
      });
    return Object.keys(map).map((key) => ({ name: key, value: map[key] }));
  }, [monthTx]);

  const exportToPDF = () => {
    const sortedTx = monthTx.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
    const doc = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });

    // Top banner
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setFillColor(210, 4, 4);
    doc.rect(0, 0, pageWidth, 70, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text('FINANCE TRACKER', 24, 30);
    doc.setFontSize(12);
    doc.text(
      `Monthly Transactions Report - ${new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}`,
      24,
      52
    );

    // Summary chips
    const summaryY = 90;
    const chips = [
      { label: 'Income', value: `₹${summary.income}`, color: [40, 167, 69] },
      { label: 'Expense', value: `₹${summary.expense}`, color: [220, 53, 69] },
      { label: 'Balance', value: `₹${summary.balance}`, color: [33, 37, 41] },
      { label: 'Transactions', value: `${summary.totalTransactions}`, color: [2, 117, 216] },
    ];
    let chipX = 24;
    chips.forEach((c) => {
      const text = `${c.label}: ${c.value}`;
      doc.setFontSize(10);
      const textWidth = doc.getTextWidth(text);
      const padX = 8;
      const padY = 6;
      doc.setFillColor(...c.color);
      doc.roundedRect(chipX, summaryY - 12, textWidth + padX * 2, 20, 6, 6, 'F');
      doc.setTextColor(255, 255, 255);
      doc.text(text, chipX + padX, summaryY + 2);
      chipX += textWidth + padX * 2 + 8;
    });

    // Table
    autoTable(doc, {
      startY: summaryY + 28,
      head: [["Date", "Type", "Category", "Amount (₹)", "Description"]],
      body: sortedTx.map((tx) => [
        new Date(tx.date).toLocaleDateString(),
        tx.type,
        tx.category || "-",
        Number(tx.amount).toFixed(2),
        tx.description || "-",
      ]),
      theme: 'striped',
      styles: {
        fontSize: 9,
        cellPadding: 6,
        lineColor: [222, 226, 230],
        lineWidth: 0.4,
      },
      headStyles: {
        fillColor: [33, 37, 41],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250],
      },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 60, halign: 'center' },
        2: { cellWidth: 110 },
        3: { cellWidth: 80, halign: 'right' },
        4: { cellWidth: 'auto' },
      },
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index === 1) {
          const type = data.cell.raw;
          if (type === 'Income') data.cell.styles.textColor = [40, 167, 69];
          if (type === 'Expense') data.cell.styles.textColor = [220, 53, 69];
          data.cell.styles.fontStyle = 'bold';
        }
      },
      didDrawPage: (data) => {
        // Footer page numbers
        const pageCount = doc.internal.getNumberOfPages();
        const str = `Page ${doc.internal.getCurrentPageInfo().pageNumber} of ${pageCount}`;
        doc.setFontSize(8);
        doc.setTextColor(120, 120, 120);
        doc.text(str, pageWidth - 60, doc.internal.pageSize.getHeight() - 10);
      },
    });

    // Totals row (separate table for emphasis)
    const totals = sortedTx.reduce(
      (acc, t) => {
        if (t.type === 'Income') acc.income += Number(t.amount || 0);
        if (t.type === 'Expense') acc.expense += Number(t.amount || 0);
        return acc;
      },
      { income: 0, expense: 0 }
    );
    const balance = totals.income - totals.expense;
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Total Income (₹)", "Total Expense (₹)", "Balance (₹)"]],
      body: [[
        totals.income.toFixed(2),
        totals.expense.toFixed(2),
        balance.toFixed(2),
      ]],
      styles: { halign: 'right', cellPadding: 6 },
      headStyles: { fillColor: [210, 4, 4], textColor: [255, 255, 255] },
      columnStyles: {
        0: { halign: 'right' },
        1: { halign: 'right' },
        2: { halign: 'right', textColor: balance >= 0 ? [40, 167, 69] : [220, 53, 69] },
      },
    });

    doc.save(`finance_report_${selectedMonth}_${selectedYear}.pdf`);
  };

  const exportToExcel = () => {
    // Transactions sheet
    const txRows = [
      ['Date', 'Type', 'Category', 'Amount (₹)', 'Description'],
      ...monthTx.map((tx) => [
        new Date(tx.date).toLocaleDateString(),
        tx.type,
        tx.category || '-',
        Number(tx.amount) || 0,
        tx.description || '-',
      ]),
    ];
    // Totals row
    const totalIncome = monthTx.filter(t => t.type === 'Income').reduce((s, t) => s + Number(t.amount || 0), 0);
    const totalExpense = monthTx.filter(t => t.type === 'Expense').reduce((s, t) => s + Number(t.amount || 0), 0);
    const totalBalance = totalIncome - totalExpense;
    txRows.push([]);
    txRows.push(['Total Income (₹)', 'Total Expense (₹)', 'Balance (₹)']);
    txRows.push([totalIncome, totalExpense, totalBalance]);

    const wsTx = XLSX.utils.aoa_to_sheet(txRows);
    // Column widths
    wsTx['!cols'] = [
      { wch: 12 }, // Date
      { wch: 10 }, // Type
      { wch: 18 }, // Category
      { wch: 14 }, // Amount
      { wch: 40 }, // Description
    ];
    // Number formats for Amount column and totals
    const range = XLSX.utils.decode_range(wsTx['!ref']);
    for (let r = 1; r <= range.e.r; r++) {
      const addr = XLSX.utils.encode_cell({ r, c: 3 });
      const cell = wsTx[addr];
      if (cell && typeof cell.v === 'number') {
        cell.z = '#,##0.00';
      }
    }

    // Summary sheet
    const wsSummary = XLSX.utils.aoa_to_sheet([
      ['Month', new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' })],
      ['Total Income', summary.income],
      ['Total Expense', summary.expense],
      ['Balance', summary.balance],
      ['Total Transactions', summary.totalTransactions],
    ]);
    wsSummary['!cols'] = [{ wch: 22 }, { wch: 18 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsTx, 'Transactions');
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');
    XLSX.writeFile(wb, `finance_report_${selectedMonth}_${selectedYear}.xlsx`);
  };

  // ---------- TABLE DATA FOR ALL MONTHS ----------
  const monthlySummary = useMemo(() => {
    const map = {};
    transactions.forEach((tx) => {
      const d = new Date(tx.date);
      const key = `${d.getMonth() + 1}-${d.getFullYear()}`;
      if (!map[key]) {
        map[key] = { month: d.getMonth() + 1, year: d.getFullYear(), income: 0, expense: 0 };
      }
      if (tx.type === "Income") map[key].income += tx.amount;
      if (tx.type === "Expense") map[key].expense += tx.amount;
    });

    return Object.values(map).map((m) => ({
      ...m,
      balance: m.income - m.expense,
    }));
  }, [transactions]);

  // Totals row
  const totalRow = useMemo(() => {
    let totalIncome = 0,
      totalExpense = 0,
      totalBalance = 0;
    monthlySummary.forEach((m) => {
      totalIncome += m.income;
      totalExpense += m.expense;
      totalBalance += m.balance;
    });
    return { totalIncome, totalExpense, totalBalance };
  }, [monthlySummary]);

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
        {/* Header */}
        <Row className="mb-4 d-flex justify-content-between align-items-center">
          <Col xs={12} md={6}>
            <h2 className="mb-2 mb-md-3" style={{ fontSize: window.innerWidth < 768 ? '1.5rem' : '2rem' }}>
              <span style={{ color: "#d20404ff" }}>MONTHLY</span>{" "}
              <span style={{ color: "black" }}>REPORTS</span>
            </h2>
            <p className="text-success mb-0">Analyze your financial data</p>
          </Col>
          <Col xs={12} md={6} className="mt-3 mt-md-0">
            <Form className="d-flex flex-column flex-md-row justify-content-md-end gap-2">
              <Form.Select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="flex-fill"
                style={{ 
                  fontSize: window.innerWidth < 768 ? '14px' : '16px',
                  borderRadius: '8px'
                }}
              >
                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((m, i) => (
                  <option key={i + 1} value={i + 1}>
                    {m}
                  </option>
                ))}
              </Form.Select>
              <Form.Control
                type="number"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                style={{ 
                  maxWidth: "120px",
                  fontSize: window.innerWidth < 768 ? '14px' : '16px',
                  borderRadius: '8px'
                }}
              />
            </Form>
          </Col>
        </Row>

        {/* Export Buttons */}
        <Row className="mb-3">
          <Col className="text-center text-md-end">
            <div className="d-flex flex-column flex-md-row gap-2 justify-content-center justify-content-md-end">
              <Button 
                variant="danger" 
                size="sm" 
                onClick={exportToPDF} 
                style={{ 
                  borderRadius: '8px',
                  fontSize: window.innerWidth < 768 ? '12px' : '14px',
                  padding: window.innerWidth < 768 ? '6px 12px' : '8px 16px'
                }}
              >
                <i className="fas fa-file-pdf me-1"></i>
                Export PDF
              </Button>
              <Button 
                variant="success" 
                size="sm" 
                onClick={exportToExcel} 
                style={{ 
                  borderRadius: '8px',
                  fontSize: window.innerWidth < 768 ? '12px' : '14px',
                  padding: window.innerWidth < 768 ? '6px 12px' : '8px 16px'
                }}
              >
                <i className="fas fa-file-excel me-1"></i>
                Export Excel
              </Button>
            </div>
          </Col>
        </Row>

        {/* Summary Cards */}
        <Row xs={1} sm={2} lg={4} className="g-3">
          <Col>
            <Card className="p-2 shadow-lg text-center" style={{ 
              borderRadius: '12px', 
              border: 'none',
              minHeight: '96px'
            }}>
              <h5 style={{ fontSize: window.innerWidth < 768 ? '1rem' : '1.1rem' }}>
                Total Balance
              </h5>
              <h4 
                style={{ 
                  fontSize: window.innerWidth < 768 ? '1.3rem' : '1.5rem',
                  color: '#212529',
                  fontWeight: 700
                }}
              >
                ₹{summary.balance}
              </h4>
            </Card>
          </Col>
          <Col>
            <Card className="p-2 shadow-lg text-center" style={{ 
              borderRadius: '12px', 
              border: 'none',
              minHeight: '96px'
            }}>
              <h5 style={{ fontSize: window.innerWidth < 768 ? '1rem' : '1.1rem' }}>
                Total Income
              </h5>
              <h4 
                style={{ 
                  fontSize: window.innerWidth < 768 ? '1.3rem' : '1.5rem',
                  color: '#212529',
                  fontWeight: 700
                }}
              >
                ₹{summary.income}
              </h4>
            </Card>
          </Col>
          <Col>
            <Card className="p-2 shadow-lg text-center" style={{ 
              borderRadius: '12px', 
              border: 'none',
              minHeight: '96px'
            }}>
              <h5 style={{ fontSize: window.innerWidth < 768 ? '1rem' : '1.1rem' }}>
                Total Expense
              </h5>
              <h4 
                style={{ 
                  fontSize: window.innerWidth < 768 ? '1.3rem' : '1.5rem',
                  color: '#212529',
                  fontWeight: 700
                }}
              >
                ₹{summary.expense}
              </h4>
            </Card>
          </Col>
          <Col>
            <Card className="p-2 shadow-lg text-center" style={{ 
              borderRadius: '12px', 
              border: 'none',
              minHeight: '96px'
            }}>
              <h5 style={{ fontSize: window.innerWidth < 768 ? '1rem' : '1.1rem' }}>
                Total Transactions
              </h5>
              <h4 style={{ 
                fontSize: window.innerWidth < 768 ? '1.3rem' : '1.5rem',
                color: '#212529',
                fontWeight: 700
              }}>
                {summary.totalTransactions}
              </h4>
            </Card>
          </Col>
        </Row>

        {/* Charts */}
        <Row className="mt-4">
          <Col xs={12} lg={6} className="mb-4 mb-lg-0">
            <Card className="p-4 shadow-lg h-100" style={{ borderRadius: '15px', border: 'none' }}>
              <h5 className="mb-3 text-center" style={{ 
                color: '#d20404ff', 
                fontWeight: 'bold',
                fontSize: window.innerWidth < 768 ? '1.1rem' : '1.25rem'
              }}>
                Income vs Expense
              </h5>
              <ResponsiveContainer width="100%" height={window.innerWidth < 768 ? 400 : 450}>
                <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}-₹${value}`}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>

          <Col xs={12} lg={6} className="mb-4 mb-lg-0">
            <Card className="p-4 shadow-lg h-100" style={{ borderRadius: '15px', border: 'none' }}>
              <h5 className="mb-3 text-center" style={{ 
                color: '#d20404ff', 
                fontWeight: 'bold',
                fontSize: window.innerWidth < 768 ? '1.1rem' : '1.25rem'
              }}>
                Expense Categories
              </h5>
              {expenseCategories.length > 0 ? (
                <ResponsiveContainer width="100%" height={window.innerWidth < 768 ? 400 : 450}>
                  <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <Pie
                      data={expenseCategories}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      labelLine={true}
                      label={({ cx, cy, midAngle, outerRadius, name, value }) => {
                        const RADIAN = Math.PI / 180;
                        const isMobile = window.innerWidth < 768;
                        const radius = outerRadius + (isMobile ? 40 : 30);
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);
                        return (
                          <text
                            x={x}
                            y={y}
                            fill="#333"
                            textAnchor={x > cx ? "start" : "end"}
                            dominantBaseline="central"
                            fontSize={isMobile ? 9 : 12}
                            fontWeight="600"
                            style={{
                              textShadow: '1px 1px 2px rgba(255,255,255,0.8)',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {`${name}-₹${value}`}
                          </text>
                        );
                      }}
                    >
                      {expenseCategories.map((entry, index) => (
                        <Cell
                          key={`cell-cat-${index}`}
                          fill={`hsl(${(index * 60) % 360}, 70%, 50%)`}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₹${value}`} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-muted py-5">
                  <i className="fas fa-chart-pie fa-3x mb-3"></i>
                  <br />
                  No expense data for this month
                </div>
              )}
            </Card>
          </Col>
        </Row>

        {/* Table below charts */}
       <Row className="mt-4">
  <Col>
    <Card className="p-4 shadow-lg mb-2" style={{ borderRadius: '15px', border: 'none' }}>
      <h5 className="mb-4 text-center" style={{ color: '#d20404ff', fontWeight: 'bold' }}>
        Monthly Summary
      </h5>
      <div className="table-responsive" style={{ borderRadius: '10px', overflow: 'hidden' }}>
        <Table hover responsive bordered className="mb-0" style={{ border: '1px solid #dee2e6' }}>
          <thead style={{ backgroundColor: '#212529' }}>
            <tr>
              <th style={{ border: 'none', padding: '15px', fontWeight: '700' }}>
                Month
              </th>
              <th style={{ border: 'none', padding: '15px', fontWeight: '700' }}>
                Total Income
              </th>
              <th style={{ border: 'none', padding: '15px', fontWeight: '700'}}>
                Total Expense
              </th>
              <th style={{ border: 'none', padding: '15px', fontWeight: '700'}}>
                Available Balance
              </th>
            </tr>
          </thead>
          <tbody>
            {monthlySummary.map((m, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #e9ecef' }}>
                <td
                  style={{
                    border: 'none',
                    padding: '15px',
                    fontWeight: '600',
                    color: '#000000', // black text
                  }}
                >
                  {new Date(m.year, m.month - 1).toLocaleString('default', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </td>
                <td style={{ border: 'none', padding: '15px', fontWeight: 'bold', color: '#28a745' }}>
                  ₹{m.income}
                </td>
                <td style={{ border: 'none', padding: '15px', fontWeight: 'bold', color: '#dc3545' }}>
                  ₹{m.expense}
                </td>
                <td
                  style={{
                    border: 'none',
                    padding: '15px',
                    fontWeight: 'bold',
                    color: m.balance >= 0 ? '#28a745' : '#dc3545',
                  }}
                >
                  ₹{m.balance}
                </td>
              </tr>
            ))}
            <tr
              className="fw-bold"
              style={{ backgroundColor: '#f8f9fa', borderTop: '2px solid #dee2e6' }}
            >
              <td style={{ border: 'none', padding: '15px', fontWeight: 'bold', color: '#000000' }}>
                Total
              </td>
              <td style={{ border: 'none', padding: '15px', fontWeight: 'bold', color: '#28a745' }}>
                ₹{totalRow.totalIncome}
              </td>
              <td style={{ border: 'none', padding: '15px', fontWeight: 'bold', color: '#dc3545' }}>
                ₹{totalRow.totalExpense}
              </td>
              <td
                style={{
                  border: 'none',
                  padding: '15px',
                  fontWeight: 'bold',
                  color: totalRow.totalBalance >= 0 ? '#28a745' : '#dc3545',
                }}
              >
                ₹{totalRow.totalBalance}
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    </Card>
  </Col>
</Row>

      </Container>
    </div>
  );
}
