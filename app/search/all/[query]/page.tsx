"use client";
import { CardPrintingPriceViewWithPercentage } from "@/app/api/cardData/get/route";
import TcgCard from "@/app/components/TcgCard";
import getSearchCardData from "@/helpers/getSearchCardData";
import { Box, Container, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import FaBSetJson from "@/app/jsonData/FaBSet.json";
import { CardSet } from "@/typings/FaBSet";

const SearchPage = () => {
  const FaBSetDataJson: CardSet[] = FaBSetJson as CardSet[];

  const params = useParams();
  const searchQuery = decodeURI(params.query as string);
  const [cardData, setCardData] = useState<any>([]);

  const handleSearchCardData = async () => {
    if (searchQuery) {
      const response = await getSearchCardData({ searchQuery });
      setCardData(response.data.results);
    }
  };

  useEffect(() => {
    handleSearchCardData();
  }, []);

  return (
    <Container>
      <Typography mb={4} variant="h4">
        Searching for: {searchQuery}
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
                  slug={formattedSetName} // this needs to be like heavy-hitters
                  cardId={card.printing_id}
                  cardPrice={card.low_price}
                  foiling={card.foiling as "S" | "R" | "C"}
                  edition={card.edition}
                />
              );
          })}
        </Box>
      )}
    </Container>
  );
};

export default SearchPage;
