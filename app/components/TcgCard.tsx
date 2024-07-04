import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";
import Link from "next/link";
import React, { forwardRef, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import CardFoilingChip from "./CardFoilingChip";
import FoilOverlay from "./FoilOverlay";

interface TcgCardProps {
  image: string | undefined;
  title: string;
  slug: string;
  cardId: string;
  cardPrice?: number;
  foiling?: string;
}

const TcgCard = forwardRef<HTMLAnchorElement, TcgCardProps>(
  ({ image, title, slug, cardId, cardPrice, foiling }, ref) => {
    const [hasImageLoaded, setHasImageLoaded] = useState<boolean>(false);
    const isFoiled = foiling !== "Normal";
    return (
      <Link
        href={{
          pathname: `/sets/${slug}/${cardId}`,
          query: {
            foiling,
          },
        }}
        passHref
        style={{ flex: "1 0 auto", maxWidth: "20%" }}
      >
        <Card
          component="div"
          ref={ref}
          sx={{
            backgroundColor: "transparent",
            boxShadow: "unset",
            paddingLeft: 5,
          }}
        >
          <CardActionArea>
            <Box sx={{ position: "relative" }}>
              <LazyLoadImage
                alt={title}
                height={"auto"}
                src={image ?? ""}
                width={"100%"}
                onLoad={() => setHasImageLoaded(true)}
              />
              {isFoiled && <FoilOverlay />}
            </Box>

            {hasImageLoaded && (
              <CardContent sx={{ padding: 0, paddingTop: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography gutterBottom variant="body1">
                    {title}
                  </Typography>
                  {foiling && <CardFoilingChip foiling={foiling} />}
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderTop: "1px solid #b1afaf",
                    marginTop: 1,
                  }}
                >
                  <Typography gutterBottom variant="body1">
                    Raw
                  </Typography>
                  {cardPrice ?? (
                    <Typography gutterBottom variant="body1">
                      {cardPrice}
                    </Typography>
                  )}
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
