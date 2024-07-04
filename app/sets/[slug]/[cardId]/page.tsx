"use client";
import { useParams, useSearchParams } from "next/navigation";
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
import { Card, Printing } from "@/typings/FaBCard";
import { LazyLoadImage } from "react-lazy-load-image-component";
import getPrintingImageUrl from "@/helpers/getCardPrintingImageUrl";
import Image from "next/image";
import TCGLineChart from "@/app/components/TCGLineChart";
import data from "@/helpers/mockChartData";
import LinkButton from "@/app/components/LinkButton";
import getFaBCardData from "@/helpers/getFaBCardData";
import {
  ProductPriceData,
  fetchCardPriceData,
  getGroupDataBySet,
  loadCardPriceData,
} from "@/helpers/getFaBCardPriceData";
import invertFoiling from "@/helpers/invertFoiling";
import FoilOverlay from "@/app/components/FoilOverlay";

const CardPage = () => {
  const params = useParams<{ slug: string; cardId: string }>();
  const { slug, cardId } = params;
  const searchParams = useSearchParams();
  const foiling = searchParams.get("foiling");
  const isFoiled = foiling !== "Normal";

  const [logo, setLogo] = useState<string | null>(null);
  const [cardData, setCardData] = useState<Card | null>(null);
  const [cardImageUrl, setCardImageUrl] = useState<string>("");
  const [cardPriceData, setCardPriceData] = useState<ProductPriceData | null>(
    null
  );

  const loadLogo = async () => {
    const importedLogo = await importLogo(slug);
    setLogo(importedLogo);
  };

  useEffect(() => {
    if (cardId) {
      loadLogo();
      (async () => {
        const cardDataResults = await getFaBCardData({ slug, cardId });
        const cardData: Card = cardDataResults.data.result;
        const card: Printing = cardData?.printings.find(
          (card) =>
            card.id === cardId && card.foiling === invertFoiling(foiling)
        );

        const groupId = await getGroupDataBySet(card.set_id);
        const allCardPriceData = await fetchCardPriceData(groupId);
        const cardPricing = await loadCardPriceData(card, allCardPriceData);
        if (cardPricing) setCardPriceData(cardPricing);

        setCardData(cardData);

        const imageUrl = getPrintingImageUrl(
          cardData.printings,
          cardId,
          foiling
        );
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
                ${cardPriceData?.lowPrice}
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
              {isFoiled && <FoilOverlay />}
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
