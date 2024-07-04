"use client";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import TcgCard from "@/app/components/TcgCard";
import { Card, Printing } from "@/typings/FaBCard";
import { CardSet } from "@/typings/FaBSet";
import importLogo from "@/helpers/importLogo";
import Header from "@/app/components/Header";
import SearchBar from "@/app/components/SearchBar";
import getPrintingImageUrl from "@/helpers/getCardPrintingImageUrl";
import getFaBCardData from "@/helpers/getFaBCardData";
import getCardSet from "@/helpers/getSetData";
import convertFoilingLabel from "@/helpers/convertFoilingLabel";
import {
  ProductPriceData,
  fetchCardPriceData,
  getGroupDataBySet,
  loadCardPriceData,
} from "@/helpers/getFaBCardPriceData";

const SlugPage = () => {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [logo, setLogo] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<string | null>(null);
  const [cardData, setCardData] = useState<Card[]>([]);
  const [cardSet, setCardSet] = useState<CardSet | null>(null);
  const [cardSetTotal, setCardSetTotal] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const [cardsPriceData, setCardsPriceData] = useState<ProductPriceData[]>([]);

  const fetchMoreData = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await getFaBCardData({ slug, page, pageSize: 12 });
      const newData = response.data.result;
      const totalCards = response.data.total;
      setCardSetTotal(totalCards);
      setCardData((prevData) => [...prevData, ...newData]);

      if (newData.length < 10) {
        setHasMore(false);
      }

      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  const loadLogo = async () => {
    const importedLogo = await importLogo(slug);
    setLogo(importedLogo);
  };

  const handleCardSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams(e.target.value);

    const cardDataResults = await getFaBCardData({
      slug,
      searchQuery: e.target.value,
    });
    const cardData = cardDataResults.data.result;
    const totalCards = cardDataResults.data.total;
    setCardSetTotal(totalCards);
    setCardData(cardData);
  };

  const lastElementRef = useCallback(
    (node: HTMLAnchorElement) => {
      if (loading || searchParams) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchMoreData();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, fetchMoreData]
  );

  useEffect(() => {
    fetchMoreData();
  }, []);

  useEffect(() => {
    if (slug) {
      loadLogo();
      (async () => {
        const cardSet = await getCardSet(slug);
        setCardSet(cardSet);
        if (cardSet?.id) {
          const groupId = await getGroupDataBySet(cardSet.id);
          const cardPriceData = await fetchCardPriceData(groupId);
          setCardsPriceData(cardPriceData);
        }
      })();
    }
  }, [slug]);

  useEffect(() => {
    if (searchParams) return;
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight &&
        hasMore
      ) {
        fetchMoreData();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchMoreData, hasMore, searchParams]);

  return (
    <Container maxWidth="lg">
      <Header logo={logo} />
      <Box sx={{ display: "flex", flexFlow: "row wrap" }}>
        <Typography variant="body2" mr={2}>
          Cards: {cardSetTotal}
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
          marginLeft: "-40px",
          marginTop: "40px",
        }}
      >
        {!!cardData.length &&
          cardSet?.id &&
          cardData?.map((card, i) => {
            const cardImageUrl = getPrintingImageUrl(card, cardSet);
            const data: Printing | undefined = card.printings.find(
              (cardPrinting) => cardPrinting.set_id === cardSet.id
            );

            if (data?.id && !!cardsPriceData.length) {
              const foilingType = convertFoilingLabel(
                data.foiling as "S" | "R" | "C"
              );
              const cardPrice = loadCardPriceData(data, cardsPriceData);

              return (
                <TcgCard
                  ref={cardData.length === i + 1 ? lastElementRef : null}
                  key={card.unique_id + i}
                  image={cardImageUrl}
                  title={card.name}
                  slug={slug}
                  foiling={foilingType}
                  cardPrice={cardPrice?.lowPrice}
                  cardId={data.id || ""}
                />
              );
            }
          })}
      </Box>
    </Container>
  );
};

export default SlugPage;
