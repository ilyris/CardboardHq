import loadCardPriceData from "@/helpers/getFaBCardPriceData";
import { Card as CardType, Printing } from "@/typings/FaBCard";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";
import Link from "next/link";
import React, { forwardRef, useState, useEffect } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

interface TcgCardProps {
  image: string | undefined;
  title: string;
  slug: string;
  cardId: string;
  cardData: Printing;
}

const TcgCard = forwardRef<HTMLAnchorElement, TcgCardProps>(
  ({ image, title, slug, cardId, cardData }, ref) => {
    const [hasImageLoaded, setHasImageLoaded] = useState<boolean>(false);
    const [cardPrice, setCardPrice] = useState<number | null>(null);

    useEffect(() => {
      if (cardId && cardData) {
        (async () => {
          const cardPricing = await loadCardPriceData(cardData);
          console.log({ cardPricing });
          if (cardPricing?.lowPrice) setCardPrice(cardPricing.lowPrice);
        })();
      }
    }, [cardId, cardData]);

    return (
      <Link href={`/sets/${slug}/${cardId}`} passHref>
        <Card
          ref={ref}
          sx={{
            width: 200,
            minHeight: 340,
            m: 2,
            backgroundColor: "transparent",
            boxShadow: "unset",
          }}
        >
          <CardActionArea>
            <LazyLoadImage
              alt={title}
              height={"auto"}
              src={image ?? ""}
              width={200}
              onLoad={() => setHasImageLoaded(true)}
            />
            {hasImageLoaded && (
              <CardContent sx={{ padding: 0, paddingTop: 1 }}>
                <Typography gutterBottom variant="h6">
                  {title}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderTop: "1px solid #b1afaf",
                  }}
                >
                  <Typography gutterBottom variant="body1">
                    Raw
                  </Typography>
                  <Typography gutterBottom variant="body1">
                    {cardPrice}
                  </Typography>
                </Box>
              </CardContent>
            )}
          </CardActionArea>
        </Card>
      </Link>
    );
  }
);

TcgCard.displayName = "TcgCard";

export default TcgCard;
