"use client";
import { Box, Button, Container, Typography } from "@mui/material";
import React, { useState } from "react";
import AddPortfolioModal from "../components/modals/AddPortfolioModal";

const CollectionPage = () => {
  const [openPortfolioModal, setOpenPortfolioModal] = useState<boolean>(false);

  const togglePortfolioModalOpen = () => {
    setOpenPortfolioModal(!openPortfolioModal);
  };

  return (
    <Container>
      <Typography mb={4} variant="h3">
        Your Collections
      </Typography>
      <Box
        display="flex"
        justifyContent={"space-between"}
        borderBottom={"1px solid #fff"}
      >
        <Typography variant="h5">Portfolios</Typography>
        <Button
          variant="contained"
          sx={{ mb: 1 }}
          onClick={togglePortfolioModalOpen}
        >
          Add Portfolio
        </Button>
      </Box>
      <AddPortfolioModal
        isOpen={openPortfolioModal}
        isModalOpenCb={togglePortfolioModalOpen}
      />
    </Container>
  );
};

export default CollectionPage;
