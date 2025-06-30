// src/components/BarChartComponent.jsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const BarChartComponent = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={380}>
      <BarChart
        data={data}
        margin={{
          top: 40,
          right: 30,
          left: 20,
          bottom: 40,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="label"
          angle={-30}
          textAnchor="end"
          interval={0}
          height={80}
        />
        <YAxis />
        <Tooltip />
        <Legend verticalAlign="top" align="center" wrapperStyle={{ paddingBottom: 12 }} />
        <Bar dataKey="creditosACargar" fill="#8884d8" name="Créditos a Cargar" />
        <Bar dataKey="creditosListos" fill="#82ca9d" name="Créditos Listos" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;
