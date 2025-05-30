"use client";

import { CardPrintingPriceViewWithPercentage } from "@/app/api/cardData/get/route";
import { Box, Container, Pagination, Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";
import React, { ChangeEvent, useEffect, useState } from "react";
import FaBSetJson from "@/app/jsonData/FaBSet.json";
import { CardSet } from "@/typings/FaBSet";
import AddToPortfolioModal from "@/app/components/modals/AddToPortfolioModal";
import useAuthProviders from "@/app/hooks/useAuthProviders";
import { useAppSelector } from "@/app/lib/hooks";
import { searchByFacetFilter } from "@/helpers/searchByFacetFilter";
import TcgCard from "@/app/components/cardUi/TcgCard";

const SearchPage = () => {
  const FaBSetDataJson: CardSet[] = FaBSetJson as CardSet[];

  const { providers, handleLogin } = useAuthProviders();
  const searchParams = useSearchParams();

  const facetSearchData = useAppSelector((state) => state.facetSearch);

  const [cardData, setCardData] = useState<any>([]);
  const [cardSetTotal, setCardSetTotal] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const artist = searchParams.get("artist");
  const searchQuery = searchParams.get("query");
  const className = searchParams.get("class");

  // const handleSearchCardData = async () => {
  //   if (searchQuery && !facetSearchData.isFacetSearchOpen) {
  //     const response = await getSearchCardData({ searchQuery });
  //     setCardData(response.data.results);
  //   }
  // };

  const handlePaginationChange = (_: ChangeEvent<unknown>, page: number) => {
    setPageNumber(page);
  };

  const handleFacetSearchData = async () => {
    const response = await searchByFacetFilter(
      facetSearchData.isFacetSearchOpen,
      artist,
      className,
      searchQuery,
      pageNumber
    );
    setCardData(response.data.results.results);

    const totalCards = response.data.results.total;
    setCardSetTotal(totalCards);
  };

  useEffect(() => {
    if (artist || searchQuery || className) {
      handleFacetSearchData();
    }
  }, [artist, searchQuery, className, pageNumber]);

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
      {cardSetTotal && cardData && (
        <Box display={"flex"} justifyContent={"center"}>
          <Pagination
            sx={{ marginTop: 5, marginBottom: 10 }}
            count={Math.ceil(cardSetTotal / 25)}
            page={pageNumber}
            color="primary"
            onChange={handlePaginationChange}
          />
        </Box>
      )}
      <AddToPortfolioModal providers={providers} handleLogin={handleLogin} />
    </Container>
  );
};

export default SearchPage;
