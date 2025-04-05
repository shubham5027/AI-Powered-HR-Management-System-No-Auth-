
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ChartData } from '@/data/mockData';

interface DepartmentChartProps {
  data: ChartData[];
}

export function DepartmentChart({ data }: DepartmentChartProps) {
  const COLORS = ['#2563eb', '#4f46e5', '#9333ea', '#16a34a', '#ea580c', '#0891b2'];

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
          <Tooltip formatter={(value) => [`${value} employees`, 'Count']} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
