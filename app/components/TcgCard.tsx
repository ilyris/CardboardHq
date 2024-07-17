import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  styled,
  Typography,
} from "@mui/material";
import Link from "next/link";
import React, { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import CardFoilingChip from "./CardFoilingChip";
import FoilOverlay from "./FoilOverlay";
import convertFoilingLabel from "@/helpers/convertFoilingLabel";

interface TcgCardProps {
  image: string | undefined;
  title: string;
  slug: string;
  cardId: string;
  cardPrice: number | null;
  foiling: "S" | "C" | "R";
  edition: string;
  featured?: boolean;
}

const TcgCard: React.FC<TcgCardProps> = ({
  image,
  title,
  slug,
  cardId,
  cardPrice,
  foiling,
  edition,
  featured,
}) => {
  const [hasImageLoaded, setHasImageLoaded] = useState<boolean>(false);
  const formattedFoiling = convertFoilingLabel(foiling);
  const isFoiled = formattedFoiling !== "Normal";

  return (
    <Link
      href={{
        pathname: `/sets/${slug}/${cardId}`,
        query: {
          foiling,
          edition,
        },
      }}
      passHref
      style={{
        flex: "1 0 auto",
        maxWidth: "20%",
        marginBottom: featured ? 0 : 20,
      }}
    >
      <Card
        sx={{
          backgroundColor: "transparent",
          boxShadow: "unset",
          paddingLeft: featured ? 0 : 5,
        }}
      >
        <CardActionArea>
          <Box sx={{ position: "relative" }}>
            <LazyLoadImage
              alt={title}
              height={"auto"}
              src={image ?? ""}
              width={featured ? 230 : "100%"}
              onLoad={() => setHasImageLoaded(true)}
            />
            {isFoiled && <FoilOverlay foiling={formattedFoiling} />}
          </Box>

          {hasImageLoaded && (
            <CardContent sx={{ padding: 0, paddingTop: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography gutterBottom variant="body1">
                  {title}
                </Typography>
                {formattedFoiling && (
                  <CardFoilingChip foiling={formattedFoiling} />
                )}
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
                <Typography gutterBottom variant="body1">
                  {cardPrice ?? "Price Not Found"}
                </Typography>
              </Box>
            </CardContent>
          )}
        </CardActionArea>
      </Card>
    </Link>
  );
};

TcgCard.displayName = "TcgCard";

export default TcgCard;
