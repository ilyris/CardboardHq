"use client";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Box, Container, Typography, Skeleton } from "@mui/material";
import TcgCard from "@/app/components/TcgCard";
import { CardSet } from "@/typings/FaBSet";
import importLogo from "@/helpers/importLogo";
import Header from "@/app/components/Header";
import SearchBar from "@/app/components/SearchBar";
import getFaBCardData from "@/helpers/getFaBCardData";
import getCardSet from "@/helpers/getSetData";
import convertFoilingLabel from "@/helpers/convertFoilingLabel";

import Filter from "@/app/components/Filter";
import { CardPrintingPriceView } from "@/app/lib/db";

const SlugPage = () => {
  const params = useParams<{ slug: string }>();
  const searchParams = useSearchParams();

  const edition = searchParams.get("edition") as string;
  console.log({ edition });
  const slug = params.slug;

  const [logo, setLogo] = useState<string | null>(null);
  const [searchQueryParams, setSearchQueryParams] = useState<string | null>(
    null
  );
  const [cardData, setCardData] = useState<CardPrintingPriceView[]>([]);
  const [cardSet, setCardSet] = useState<CardSet | null>(null);
  const [cardSetTotal, setCardSetTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeSort, setActiveSort] = useState<string>("");

  const loadLogo = async () => {
    const importedLogo = await importLogo(slug);
    setLogo(importedLogo);
  };

  const handleCardSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQueryParams(e.target.value);

    const cardDataResults = await getFaBCardData({
      slug,
      searchQuery: e.target.value,
      edition,
    });
    const cardData = cardDataResults.data.result;
    const totalCards = cardDataResults.data.total;
    setCardSetTotal(totalCards);
    setCardData(cardData);
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await getFaBCardData({
          slug,
          sort: activeSort,
          edition,
        });
        const newData = response.data.result;
        const totalCards = response.data.total;

        setCardSetTotal(totalCards);
        setCardData(newData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [activeSort]);

  useEffect(() => {
    if (slug) {
      loadLogo();
      (async () => {
        const cardSet = await getCardSet(slug);
        setCardSet(cardSet);
      })();
    }
  }, [slug]);

  return (
    <Container maxWidth="lg">
      <Header logo={logo} />
      <Box sx={{ display: "flex", flexFlow: "row wrap", alignItems: "center" }}>
        <Typography variant="h6" mr={2} display={"flex"} alignItems={"center"}>
          Cards: {cardSetTotal}
        </Typography>
        <SearchBar
          value={searchQueryParams ?? ""}
          placeholder={"Search a card"}
          onChange={(e) => handleCardSearch(e)}
        />
        <Filter
          options={[
            { option: "high to low", text: "high to low" },
            { option: "low to high", text: "low to high" },
          ]}
          onCallback={(value: string) => setActiveSort(value)}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexFlow: "row wrap",
          marginLeft: "-40px",
          marginTop: "40px",
        }}
      >
        {!!cardData.length &&
          cardSet?.id &&
          cardData?.map((card) => {
            const foilingType = convertFoilingLabel(
              card.foiling as "S" | "R" | "C"
            );
            return (
              <TcgCard
                key={card.printing_unique_id}
                image={card.image_url}
                title={card.card_name}
                slug={slug}
                foiling={foilingType}
                cardPrice={card.low_price}
                cardId={card.printing_id || ""}
              />
            );
          })}
      </Box>
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Skeleton variant="rectangular" width={210} height={118} />
        </Box>
      )}
    </Container>
  );
};

export default SlugPage;
