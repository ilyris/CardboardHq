"use client";
import { Box, Button, Container, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import AddPortfolioModal from "../components/modals/AddPortfolioModal";
import PortfolioCard from "../components/portfolio/PortfolioCard";
import { TransformedPortfolioData } from "../api/portfolio/route";
import { getPortfolioWithCardsList } from "@/helpers/getPortfolioWithCardsList";

const CollectionPage = () => {
  const [openPortfolioModal, setOpenPortfolioModal] = useState<boolean>(false);
  const [portfolioList, setPortfolioList] = useState<
    TransformedPortfolioData[]
  >([]);

  const togglePortfolioModalOpen = () => {
    setOpenPortfolioModal(!openPortfolioModal);
  };

  useEffect(() => {
    (async () => {
      const response = await getPortfolioWithCardsList();
      setPortfolioList(response);
    })();
  }, [portfolioList?.length]);

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
      {!!portfolioList.length && (
        <Box display="flex">
          {portfolioList.map((portfolio) => {
            const sumOfCards = portfolio.cards.reduce((acc, card) => {
              return acc + card.quantity;
            }, 0);

            const marketPriceSum = portfolio.cards.reduce((acc, card) => {
              const price =
                (card.market_price ?? card.unit_price) * card.quantity;
              return acc + price;
            }, 0);

            return (
              <Box key={portfolio.id}>
                <PortfolioCard
                  portfolioName={portfolio.name}
                  portfolioId={portfolio.id}
                  portfolioCards={sumOfCards}
                  portfolioSum={parseFloat(marketPriceSum.toFixed(2))}
                />
              </Box>
            );
          })}
        </Box>
      )}

      <Box></Box>
      <AddPortfolioModal
        isOpen={openPortfolioModal}
        isModalOpenCb={togglePortfolioModalOpen}
      />
    </Container>
  );
};

export default CollectionPage;
