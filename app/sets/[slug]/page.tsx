"use client";
import { useParams, useSearchParams } from "next/navigation";
import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Skeleton,
  Pagination,
} from "@mui/material";
import TcgCard from "@/app/components/cardUi/TcgCard";
import { CardSet } from "@/typings/FaBSet";
import importLogo from "@/helpers/importLogo";
import Header from "@/app/components/generics/Header";
import SearchBar from "@/app/components/search/SearchBar";
import getFaBCardData from "@/helpers/getFaBCardData";
import getCardSet from "@/helpers/getSetData";
import Filter from "@/app/components/search/Filter";
import { CardPrintingPriceView } from "@/app/lib/db";
import AddToPortfolioModal from "@/app/components/modals/AddToPortfolioModal";
import useAuthProviders from "@/app/hooks/useAuthProviders";
import { FilterTypes } from "@/typings/Filter";

const SlugPage = () => {
  const { providers, handleLogin } = useAuthProviders();

  const params = useParams<{ slug: string }>();
  const searchParams = useSearchParams();

  const edition = searchParams.get("edition") as string;
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
  const [activeFilters, setActiveFilters] = useState<FilterTypes>({
    foiling: "all",
  });
  const [pageNumber, setPageNumber] = useState<number>(1);

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
      page: pageNumber,
    });
    const cardData = cardDataResults.data.result;
    const totalCards = cardDataResults.data.total;
    setCardSetTotal(totalCards);
    setCardData(cardData);
  };

  const handlePaginationChange = (_: ChangeEvent<unknown>, page: number) => {
    setPageNumber(page);
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await getFaBCardData({
          slug,
          sort: activeSort,
          edition,
          page: pageNumber,
          activeFilters,
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
  }, [activeSort, pageNumber, activeFilters]);

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
        <Box sx={{ display: "flex", gap: 2 }}>
          <Filter
            name={"price sort"}
            options={[
              { option: "DESC", text: "High To Low" },
              { option: "ASC", text: "Low To High" },
            ]}
            onCallback={(value: string) => setActiveSort(value)}
          />
          <Filter
            name={"foiling"}
            options={[
              { option: "all", text: "All" },
              { option: "C", text: "Cold Foil" },
              { option: "R", text: "Rainbow Foil" },
              { option: "S", text: "Non Foil" },
            ]}
            onCallback={(value: string) =>
              setActiveFilters({
                ...activeFilters,
                foiling: value as "C" | "R" | "S" | "all",
              })
            }
          />
        </Box>
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
          !loading &&
          cardData?.map((card) => {
            return (
              <TcgCard
                key={card.printing_unique_id}
                image={card.image_url}
                uniquePrintingId={card.printing_unique_id}
                uniqueCardId={card.card_unique_id}
                title={card.card_name}
                slug={slug}
                foiling={card.foiling as "S" | "C" | "R"}
                cardPrice={card.low_price}
                cardId={card.printing_id || ""}
                edition={card.edition}
              />
            );
          })}
      </Box>
      {loading && (
        <Box
          sx={{
            display: "flex",
            width: "100%",
            gap: "50px",
            flexFlow: "row wrap",
            marginTop: "40px",
          }}
        >
          {SkeletonLoader()}
        </Box>
      )}

      {!!cardSetTotal && cardData && cardSetTotal > 0 && (
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

export default SlugPage;

const SkeletonLoader = () => {
  const skeletons = [];
  let i = 0; // Initialize the counter

  // While loop to push Skeleton components into an array
  while (i < 20) {
    skeletons.push(
      <Skeleton
        variant="rectangular"
        height={330}
        width={225}
        sx={{ paddingLeft: 5 }}
      />
    );
    i++; // Increment the counter
  }

  return skeletons;
};
