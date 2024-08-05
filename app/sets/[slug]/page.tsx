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
import TcgCard from "@/app/components/TcgCard";
import { CardSet } from "@/typings/FaBSet";
import importLogo from "@/helpers/importLogo";
import Header from "@/app/components/Header";
import SearchBar from "@/app/components/SearchBar";
import getFaBCardData from "@/helpers/getFaBCardData";
import getCardSet from "@/helpers/getSetData";
import Filter from "@/app/components/Filter";
import { CardPrintingPriceView } from "@/app/lib/db";
import AddToPortfolioModal from "@/app/components/AddToPortfolioModal";

const SlugPage = () => {
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
  const [pageNumber, setPageNumber] = useState<number>(1);

  // modals
  const [isAddToPortfolioModalOpen, setIsAddToPortfolioModalOpen] =
    useState<boolean>(false);

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

  const toggleAddToPortfolioIsOpen = () => {
    console.log("firing");
    setIsAddToPortfolioModalOpen(!isAddToPortfolioModalOpen);
  };
  const closeAddToPortfolioModal = () => {
    setIsAddToPortfolioModalOpen(false);
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await getFaBCardData({
          slug,
          sort: activeSort,
          edition,
          page: pageNumber,
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
  }, [activeSort, pageNumber]);

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
            { option: "High To Low", text: "High To Low" },
            { option: "Low To High", text: "Low To High" },
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
            return (
              <TcgCard
                key={card.printing_unique_id}
                image={card.image_url}
                title={card.card_name}
                slug={slug}
                foiling={card.foiling as "S" | "C" | "R"}
                cardPrice={card.low_price}
                cardId={card.printing_id || ""}
                edition={card.edition}
                toggleAddToPortfolioModalCb={toggleAddToPortfolioIsOpen}
              />
            );
          })}
      </Box>
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Skeleton variant="rectangular" width={210} height={118} />
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
      <AddToPortfolioModal
        isOpen={isAddToPortfolioModalOpen}
        onCloseCb={closeAddToPortfolioModal}
      />
    </Container>
  );
};

export default SlugPage;
