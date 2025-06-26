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
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 80, // Aumentar el margen inferior para rotar las etiquetas si es necesario
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="label"
          angle={-45} // Rotar las etiquetas para mejor legibilidad
          textAnchor="end"
          interval={0}
          height={60} // Aumentar la altura para acomodar las etiquetas rotadas
        />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="creditosACargar" fill="#8884d8" name="Créditos a Cargar" />
        <Bar dataKey="creditosListos" fill="#82ca9d" name="Créditos Listos" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;
