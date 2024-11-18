"use client";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Box, Container, Typography, CardActionArea } from "@mui/material";
import importLogo from "@/helpers/importLogo";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Image from "next/image";
import TCGLineChart from "@/app/components/TCGLineChart";
import LinkButton from "@/app/components/LinkButton";
import getFaBCardData from "@/helpers/getFaBCardData";
import FoilOverlay from "@/app/components/FoilOverlay";
import { fetchCardPriceData } from "@/helpers/getFaBCardPriceData";
import { CardPrintingPriceViewWithPercentage } from "@/app/api/cardData/get/route";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import isNegativePriceChange from "@/helpers/isNegativePriceChange";
import { DateString } from "@/typings/Dates";
import CardLegalityContainer from "@/app/components/CardLegalityContainer";

const dayIntervalTranslation = (dayInterval: string) => {
  switch (dayInterval) {
    case "7d":
      return "Weekly";
    case "1m":
      return "Last Month";
    case "6m":
      return "Half Year";
    default:
      return "Weekly";
  }
};

const CardPage = () => {
  const params = useParams<{ slug: string; cardId: string }>();
  const { slug, cardId } = params;
  const searchParams = useSearchParams();
  const foiling = searchParams.get("foiling") as string;
  const edition = searchParams.get("edition") as string;
  const isFoiled = foiling !== "S";

  const [logo, setLogo] = useState<string | null>(null);
  const [cardData, setCardData] =
    useState<CardPrintingPriceViewWithPercentage | null>(null);
  const [cardPriceHistoryData, setCardPriceHistoryData] = useState<
    | {
        date: DateString;
        low_price: number;
      }[]
    | null
  >(null);
  const [dayInterval, setDayInterval] = useState("7d");
  const loadLogo = async () => {
    const importedLogo = await importLogo(slug);
    setLogo(importedLogo);
  };

  const fetchPortfolioPriceDataByDayInterval = async (dayInterval: string) => {
    if (!!cardData) {
      const historicPriceData = await fetchCardPriceData(
        cardData.tcgplayer_product_id,
        foiling,
        edition,
        dayInterval
      );
      setDayInterval(dayInterval);
      setCardPriceHistoryData(historicPriceData);
    }
  };

  useEffect(() => {
    if (cardId) {
      loadLogo();
      (async () => {
        const cardDataResults = await getFaBCardData({ slug, cardId, edition });
        const cardData: CardPrintingPriceViewWithPercentage =
          cardDataResults.data.result.find(
            (card: CardPrintingPriceViewWithPercentage) =>
              foiling?.replace(/\+/g, " ") === card.foiling
          );
        setCardData(cardData);

        if (foiling) {
          const cardPriceData = await fetchCardPriceData(
            cardData.tcgplayer_product_id,
            foiling,
            edition
          );
          setCardPriceHistoryData(cardPriceData);
        }
      })();
    }
  }, [cardId, slug, foiling]);

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: "flex",
          flexFlow: "row wrap",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ width: "100%" }} mr={2}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {logo && (
              <Image src={logo ? logo : ""} alt={`${slug} logo`} width={150} />
            )}
            <Typography variant="body2" ml={3}>
              {cardId}
            </Typography>
          </Box>
          <Typography variant="h2" mt={3} mb={3}>
            {cardData?.card_name}
          </Typography>
          <Box
            mt={3}
            mb={3}
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box mr={3}>
              <LinkButton
                hrefUrl={cardData?.tcgplayer_url}
                text={"TCGPlayer"}
              />
              {cardData?.low_price && (
                <Typography variant="h6" color={"#98ff65"}>
                  $
                  {cardData.prices[cardData.prices.length - 1].price ??
                    "Price Not Found"}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
        <Box mt={3} width={"65%"}>
          <TCGLineChart
            data={cardPriceHistoryData}
            historicDataCb={fetchPortfolioPriceDataByDayInterval}
          />
        </Box>
        <Box
          sx={{
            width: "auto",
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
          }}
        >
          {!!cardPriceHistoryData && cardData && (
            <>
              <CardActionArea>
                <LazyLoadImage
                  alt={cardData.card_name}
                  height={"auto"}
                  src={cardData.image_url ?? ""}
                  width={400}
                />
                {isFoiled && <FoilOverlay foiling={foiling ?? undefined} />}
              </CardActionArea>
              <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <Typography variant="h4">
                  {dayIntervalTranslation(dayInterval)}:
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    color: !isNegativePriceChange(
                      Math.round(
                        ((cardPriceHistoryData[cardPriceHistoryData.length - 1]
                          .low_price -
                          cardPriceHistoryData[0].low_price) /
                          cardPriceHistoryData[0].low_price +
                          Number.EPSILON) *
                          10000
                      ) / 100
                    )
                      ? "#98ff65"
                      : "red",
                    marginLeft: 10,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {Math.round(
                    ((cardPriceHistoryData[cardPriceHistoryData.length - 1]
                      .low_price -
                      cardPriceHistoryData[0].low_price) /
                      cardPriceHistoryData[0].low_price +
                      Number.EPSILON) *
                      10000
                  ) / 100}
                  %
                  {!isNegativePriceChange(
                    Math.round(
                      ((cardPriceHistoryData[cardPriceHistoryData.length - 1]
                        .low_price -
                        cardPriceHistoryData[0].low_price) /
                        cardPriceHistoryData[0].low_price +
                        Number.EPSILON) *
                        10000
                    ) / 100
                  ) ? (
                    <TrendingUpIcon fontSize="large" />
                  ) : (
                    <TrendingDownIcon fontSize="large" />
                  )}
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexFlow: "row wrap",
          justifyContent: "space-between",
        }}
        mt={3}
        mb={5}
      >
        {!!cardData && (
          <CardLegalityContainer cardUniqueId={cardData.card_unique_id} />
        )}
      </Box>
    </Container>
  );
};

export default CardPage;
