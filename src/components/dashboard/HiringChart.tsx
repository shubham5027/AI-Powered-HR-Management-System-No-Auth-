
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface HiringChartProps {
  data: {
    name: string;
    hires: number;
    attrition: number;
  }[];
}

export function HiringChart({ data }: HiringChartProps) {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="hires" name="New Hires" fill="#2563eb" />
          <Bar dataKey="attrition" name="Attrition" fill="#dc2626" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
