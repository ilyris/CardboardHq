import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const TCGLineChart = ({ data }) => {
  let maxPrice = 0;
  let minPrice = 0;
  let lowerBound = 0;
  let upperBound = 20;

  if (data && data.length > 0) {
    maxPrice = Math.max(...data.map((d) => d.low_price));
    minPrice = Math.min(...data.map((d) => d.low_price));
    lowerBound = Math.max(0, minPrice - 5);
    upperBound = maxPrice + 20;
  }

  return (
    <LineChart
      width={600}
      height={300}
      data={data || []}
      margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
    >
      <Line type="monotone" dataKey="low_price" stroke="#8884d8" />
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
      <XAxis dataKey="date" padding={{ left: 2, right: 2 }} />
      <YAxis domain={[lowerBound, upperBound]} padding={{ bottom: 50 }} />
      <Tooltip />
    </LineChart>
  );
};

export default TCGLineChart;
