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
import { LazyLoadImage } from "react-lazy-load-image-component";
import Image from "next/image";
import TCGLineChart from "@/app/components/TCGLineChart";
import data from "@/helpers/mockChartData"; // We need to now pull in the market data.
import LinkButton from "@/app/components/LinkButton";
import getFaBCardData from "@/helpers/getFaBCardData";
import FoilOverlay from "@/app/components/FoilOverlay";
import { CardPrintingPriceView } from "@/app/lib/db";

const CardPage = () => {
  const params = useParams<{ slug: string; cardId: string }>();
  const { slug, cardId } = params;
  const searchParams = useSearchParams();
  const foiling = searchParams.get("foiling");
  const isFoiled = foiling !== "Normal";

  const [logo, setLogo] = useState<string | null>(null);
  const [cardData, setCardData] = useState<CardPrintingPriceView | null>(null);

  const loadLogo = async () => {
    const importedLogo = await importLogo(slug);
    setLogo(importedLogo);
  };

  useEffect(() => {
    if (cardId) {
      loadLogo();
      (async () => {
        const cardDataResults = await getFaBCardData({ slug, cardId });
        const cardData: CardPrintingPriceView = cardDataResults.data.result[0];
        setCardData(cardData);
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
          <Typography variant="h2">{cardData?.card_name}</Typography>
          <Box
            mt={3}
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
                <Typography variant="body2">
                  ${cardData.low_price ?? "Price Not Found"}
                </Typography>
              )}
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
                alt={cardData.card_name}
                height={"auto"}
                src={cardData.image_url ?? ""}
                width={400}
              />
              {isFoiled && <FoilOverlay foiling={foiling ?? undefined} />}
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
