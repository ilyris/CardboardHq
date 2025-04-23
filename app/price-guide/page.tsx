"use client";
import { Box, Container, Typography } from "@mui/material";
import React from "react";
import Filter from "../components/search/Filter";

const PriceGuide = () => {
  return (
    <Container>
      <Typography variant="h2">Price Guide</Typography>
      <div>
        <Box>
          <Filter
            name={"sets"}
            options={[
              { option: "all", text: "Select a set" },
              { option: "ASC", text: "Low To High" },
            ]}
            onCallback={(value: string) => 1}
          />
        </Box>

        <Box>
          <Filter
            name={"price sort"}
            options={[
              { option: "DESC", text: "High To Low" },
              { option: "ASC", text: "Low To High" },
            ]}
            onCallback={(value: string) => 1}
          />
        </Box>
      </div>
    </Container>
  );
};
export default PriceGuide;
