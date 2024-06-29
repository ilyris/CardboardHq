"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import TcgCard from "@/app/components/TcgCard";
import { Card } from "@/typings/FaBCard";
import { CardSet } from "@/typings/FaBSet";
import importLogo from "@/helpers/importLogo";
import Header from "@/app/components/Header";
import SearchBar from "@/app/components/SearchBar";
import getPrintingImageUrl from "@/helpers/getCardPrintingImageUrl";
import getFaBCardData from "@/helpers/getFaBCardData";
import getCardSet from "@/helpers/getSetData";

const SlugPage = () => {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [logo, setLogo] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<string | null>(null);
  const [cardData, setCardData] = useState<Card[] | null>(null);
  const [cardSet, setCardSet] = useState<CardSet | null>(null);

  const loadLogo = async () => {
    const importedLogo = await importLogo(slug);
    setLogo(importedLogo);
  };

  useEffect(() => {
    if (slug) {
      loadLogo();
      (async () => {
        const cardSet = await getCardSet(slug);
        setCardSet(cardSet);
      })();

      (async () => {
        const cardDataResults = await getFaBCardData(slug);
        const cardData = cardDataResults.data.result;
        setCardData(cardData);
      })();
    }
  }, [slug]);

  const handleCardSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams(e.target.value);

    const cardDataResults = await getFaBCardData(slug, e.target.value);
    const cardData = cardDataResults.data.result;

    setCardData(cardData);
  };

  return (
    <Container maxWidth="lg">
      <Header logo={logo} />
      <Box sx={{ display: "flex", flexFlow: "row wrap" }}>
        <Typography variant="body2" mr={2}>
          Cards: {cardData?.length}
        </Typography>
        <SearchBar
          value={searchParams ?? ""}
          placeholder={"Search a card"}
          onChange={(e) => handleCardSearch(e)}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexFlow: "row wrap",
          justifyContent: "space-between",
        }}
      >
        {cardData &&
          cardSet &&
          cardData?.map((card) => {
            const cardImageUrl = getPrintingImageUrl(card, cardSet);
            const cardId = card.printings.find(
              (cardPrinting) => cardPrinting.set_id === cardSet?.id
            )?.id;

            return (
              <TcgCard
                key={card.name}
                image={cardImageUrl}
                title={card.name}
                slug={slug}
                cardId={cardId || ""}
              />
            );
          })}
      </Box>
    </Container>
  );
};

export default SlugPage;
