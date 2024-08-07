"use client";
import { Box, Button, Dialog, TextField } from "@mui/material";
import React, { useState } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";

interface AddPortfolioModalProps {
  isOpen: boolean;
  isModalOpenCb: () => void;
}
const AddPortfolioModal: React.FC<AddPortfolioModalProps> = ({
  isOpen,
  isModalOpenCb,
}) => {
  const [portfolioName, setPortfolioName] = useState<string>("");
  const [portfolioDescription, setPortfolioDescription] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPortfolioName(e.target.value);
  };

  const handlePortfolioDescription = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPortfolioDescription(e.target.value);
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    await axios.post("/api/portfolio/allPortfolios", {
      portfolioName,
      portfolioDescription,
    });
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => isModalOpenCb()}
      PaperProps={{
        sx: {
          padding: 5,
        },
      }}
    >
      <DialogTitle color="#000">Create A Portfolio</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexFlow: "row wrap" }}>
          <TextField
            id="portfolio-name"
            label="Portfolio Name"
            variant="outlined"
            value={portfolioName}
            defaultValue={"Test Portfolio Name"}
            onChange={handleInputChange}
            sx={{ flexBasis: "100%" }}
          />
          <TextField
            multiline
            rows={4}
            maxRows={6}
            id="description"
            label="Description"
            variant="outlined"
            value={portfolioDescription}
            defaultValue={"This is my PSA 10 collection"}
            onChange={handlePortfolioDescription}
            sx={{ flexBasis: "100%", mt: 3 }}
          />
        </Box>

        <Box display="flex" justifyContent={"flex-end"} mb={3} mt={3}>
          <Button type="submit" variant="contained">
            Save Portfolio
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default AddPortfolioModal;
