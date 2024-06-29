"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Skeleton,
  CardActionArea,
  Button,
} from "@mui/material";
import importLogo from "@/helpers/importLogo";
import { Card } from "@/typings/FaBCard";
import { LazyLoadImage } from "react-lazy-load-image-component";
import getPrintingImageUrl from "@/helpers/getCardPrintingImageUrl";
import Image from "next/image";
import TCGLineChart from "@/app/components/TCGLineChart";
import data from "@/helpers/mockChartData";
import LinkButton from "@/app/components/LinkButton";
import loadCardPriceData from "@/helpers/getFaBCardPriceData";
import getFaBCardData from "@/helpers/getFaBCardData";
import getCardSet from "@/helpers/getSetData";

const CardPage = () => {
  const params = useParams<{ slug: string; cardId: string }>();
  const { slug, cardId } = params;

  const [logo, setLogo] = useState<string | null>(null);
  const [cardData, setCardData] = useState<Card | null>(null);
  const [CardPriceData, setCardPriceData] = useState<any | null>(null);
  const [cardImageUrl, setCardImageUrl] = useState<string>("");

  const loadLogo = async () => {
    const importedLogo = await importLogo(slug);
    setLogo(importedLogo);
  };

  useEffect(() => {
    if (cardId) {
      loadLogo();
      (async () => {
        const cardDataResults = await getFaBCardData(slug, cardId);
        const cardData = cardDataResults.data.result;

        const card = cardData?.printings.find((card) => card.id === cardId);
        const cardPricing = await loadCardPriceData(card);
        const cardSet = await getCardSet(slug);

        setCardData(cardData);
        setCardPriceData(cardPricing);
        const imageUrl = getPrintingImageUrl(cardData, cardSet);
        setCardImageUrl(imageUrl ?? "");
      })();
    }
  }, [cardId, slug]);

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: "flex",
          flexFlow: "row wrap",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ width: "62%" }} mr={2}>
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
          <Typography variant="h2">{cardData?.name}</Typography>
          <Box
            mt={3}
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box mr={3}>
              <LinkButton
                hrefUrl={
                  cardData?.printings.find((card) => card.id === cardId)
                    ?.tcgplayer_url
                }
                text={"TCGPlayer"}
              />
              <Typography variant="body2">
                ${CardPriceData?.lowPrice}
              </Typography>
            </Box>

            <Box mr={3}>
              <Button variant="contained">Ebay</Button>
              <Typography variant="body2">$9.99</Typography>
            </Box>
          </Box>
          <Box mt={3}>
            <TCGLineChart data={data} />
          </Box>
        </Box>
        <Box sx={{ width: "auto" }}>
          {!!cardData && (
            <CardActionArea>
              <LazyLoadImage
                alt={cardData.name}
                height={"auto"}
                src={cardImageUrl ?? ""}
                width={400}
              />
            </CardActionArea>
          )}
        </Box>
      </Box>
      <Box sx={{ display: "flex", flexFlow: "row wrap" }}>
        <Skeleton width="100%" height="1100px" />
      </Box>
    </Container>
  );
};

export default CardPage;
