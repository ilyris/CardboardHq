"use client";

import { CardPrintingPriceViewWithPercentage } from "@/app/api/cardData/get/route";
import TcgCard from "@/app/components/TcgCard";
import getSearchCardData from "@/helpers/getSearchCardData";
import { Box, Container, Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import FaBSetJson from "@/app/jsonData/FaBSet.json";
import { CardSet } from "@/typings/FaBSet";
import AddToPortfolioModal from "@/app/components/modals/AddToPortfolioModal";
import useAuthProviders from "@/app/hooks/useAuthProviders";
import { useAppSelector } from "@/app/lib/hooks";
import { searchByFacetFilter } from "@/helpers/searchByFacetFilter";

const SearchPage = () => {
  const FaBSetDataJson: CardSet[] = FaBSetJson as CardSet[];

  const { providers, handleLogin } = useAuthProviders();
  const searchParams = useSearchParams();

  const facetSearchData = useAppSelector((state) => state.facetSearch);

  const [cardData, setCardData] = useState<any>([]);
  const [cardSetTotal, setCardSetTotal] = useState<number | null>(null);

  const artist = searchParams.get("artist");
  const searchQuery = searchParams.get("query");
  const className = searchParams.get("class");

  const handleSearchCardData = async () => {
    if (searchQuery && !facetSearchData.isFacetSearchOpen) {
      const response = await getSearchCardData({ searchQuery });
      setCardData(response.data.results);
    }
  };

  const handleFacetSearchData = async () => {
    const response = await searchByFacetFilter(
      facetSearchData.isFacetSearchOpen,
      artist,
      className,
      searchQuery
    );
    setCardData(response.data.results);
  };

  useEffect(() => {
    if (artist || searchQuery || className) {
      handleFacetSearchData();
    }
  }, [artist, searchQuery, className]);

  return (
    <Container>
      <Typography mb={4} variant="h4">
        Searching for: {artist || searchQuery}
      </Typography>
      {cardData && (
        <Box sx={{ display: "flex", flexFlow: "row wrap" }}>
          {cardData.map((card: CardPrintingPriceViewWithPercentage) => {
            const formattedSetName = FaBSetDataJson.find(
              (set) => set.id === card.set_id
            )?.formatted_name;

            if (formattedSetName)
              return (
                <TcgCard
                  key={card.printing_unique_id}
                  image={card.image_url}
                  title={card.card_name}
                  slug={formattedSetName}
                  cardId={card.printing_id}
                  cardPrice={card.low_price}
                  foiling={card.foiling as "S" | "R" | "C"}
                  edition={card.edition}
                  uniquePrintingId={card.printing_unique_id}
                  uniqueCardId={card.card_unique_id}
                />
              );
          })}
        </Box>
      )}
      <AddToPortfolioModal providers={providers} handleLogin={handleLogin} />
    </Container>
  );
};

export default SearchPage;
