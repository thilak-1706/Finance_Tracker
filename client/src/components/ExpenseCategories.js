import React, { useMemo } from "react";
import { Card } from "react-bootstrap";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function ExpenseCategories({ transactions = [] }) {
  // Aggregate only Expense type for categories
  const expenseCategories = useMemo(() => {
    const map = {};
    transactions
      .filter((t) => t.type === "Expense")
      .forEach((t) => {
        const cat = t.category || "Other";
        map[cat] = (map[cat] || 0) + Number(t.amount || 0);
      });
    return Object.keys(map).map((key) => ({ name: key, value: map[key] }));
  }, [transactions]);

  return (
    <Card className="p-4 shadow-lg mt-4" style={{ height: "450px", borderRadius: '15px', border: 'none' }}>
      <h5 className="mb-3 text-center" style={{ color: '#d20404ff', fontWeight: 'bold' }}>Expense Categories</h5>
      {expenseCategories.length > 0 ? (
        <ResponsiveContainer width="100%" height={window.innerWidth < 768 ? 400 : 350}>
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
                    {isMobile ? `${name}-₹${value}` : `${name}-₹${value}`}
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
  );
}
