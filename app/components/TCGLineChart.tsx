import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import theme from "../theme";
import { Box } from "@mui/material";

const TCGLineChart = ({ data }) => {
  let maxPrice = 0;
  let minPrice = 0;
  let lowerBound = 0;
  let upperBound = 20;

  if (data && data.length > 0) {
    maxPrice = Math.max(...data.map((d) => d.low_price));
    minPrice = Math.min(...data.map((d) => d.low_price));
    lowerBound = Math.max(0, minPrice - 5);
    upperBound = Math.round(maxPrice + 20);
  }

  return (
    <Box sx={{ color: theme.palette.text.primary }}>
      <LineChart
        width={600}
        height={300}
        data={data || []}
        margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
      >
        <Line type="monotone" dataKey="low_price" stroke={"#98ff65"} />
        <CartesianGrid
          stroke="#FFF"
          strokeDasharray="5 5"
          color={theme.palette.text.primary}
        />
        <XAxis
          dataKey="date"
          padding={{ left: 2, right: 2 }}
          color={theme.palette.text.primary}
        />
        <YAxis
          domain={[lowerBound, upperBound]}
          padding={{ bottom: 50 }}
          color={theme.palette.text.primary}
        />
        <Tooltip />
      </LineChart>
    </Box>
  );
};

export default TCGLineChart;
