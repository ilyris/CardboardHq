import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";
import Link from "next/link";
import React, { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

interface TcgCardProps {
  image: string | undefined;
  title: string;
  slug: string;
  cardId: string;
}

const TcgCard: React.FC<TcgCardProps> = ({ image, title, slug, cardId }) => {
  const [hasImageLoaded, setHasImageLoaded] = useState<boolean>(false);
  return (
    <Link href={`/sets/${slug}/${cardId}`}>
      <Card
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
                  {"9.99"}
                </Typography>
              </Box>
            </CardContent>
          )}
        </CardActionArea>
      </Card>
    </Link>
  );
};

export default TcgCard;
