import React, { useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import theme from "../theme";
import { Box, Button } from "@mui/material";
import { DateString } from "@/typings/Dates";

interface TCGLineChartData {
  data:
    | {
        date: DateString;
        low_price: number;
      }[]
    | null;
  width?: number;
  height?: number;
}
interface TCGProps {
  historicDataCb?: (dayInterval: string) => void;
}

const TCGLineChart: React.FC<TCGLineChartData & TCGProps> = ({
  data,
  width = 600,
  height = 300,
  historicDataCb,
}) => {
  let maxPrice = 0;
  let minPrice = 0;
  let lowerBound = 0;
  let upperBound = 20;

  const [activeButton, setActiveButton] = useState<
    "button1" | "button2" | "button3" | null
  >(null);

  if (data && data.length > 0) {
    maxPrice = Math.max(...data.map((d) => d.low_price));
    minPrice = Math.min(...data.map((d) => d.low_price));
    lowerBound = Math.max(0, minPrice - 5);
    upperBound = Math.round(maxPrice + 20);
  }
  return (
    <Box sx={{ color: theme.palette.text.primary }}>
      <ResponsiveContainer
        width="100%"
        height={400}
        style={{
          backgroundColor: theme.palette.secondary.main,
          padding: "5px",
          marginBottom: "1rem",
        }}
      >
        <LineChart
          width={width}
          height={height}
          data={data || []}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        >
          <Line type="monotone" dataKey="low_price" stroke={"#98ff65"} />

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
      </ResponsiveContainer>

      <Box>
        <Button
          variant="contained"
          sx={{
            mr: 5,
            backgroundColor:
              activeButton === "button1"
                ? theme.palette.secondary.main
                : theme.palette.primary.main,
          }}
          onClick={() => {
            historicDataCb && historicDataCb("7d");
            setActiveButton("button1");
          }}
        >
          7D
        </Button>
        <Button
          variant="contained"
          sx={{
            mr: 5,
            backgroundColor:
              activeButton === "button2"
                ? theme.palette.secondary.main
                : theme.palette.primary.main,
          }}
          onClick={() => {
            historicDataCb && historicDataCb("1m");
            setActiveButton("button2");
          }}
        >
          1M
        </Button>
        <Button
          variant="contained"
          sx={{
            mr: 5,
            backgroundColor:
              activeButton === "button3"
                ? theme.palette.secondary.main
                : theme.palette.primary.main,
          }}
          onClick={() => {
            historicDataCb && historicDataCb("6m");
            setActiveButton("button3");
          }}
        >
          6M
        </Button>
      </Box>
    </Box>
  );
};

export default TCGLineChart;
