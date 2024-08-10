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
import CardFoilingChip from "./CardFoilingChip";
import FoilOverlay from "./FoilOverlay";
import convertFoilingLabel from "@/helpers/convertFoilingLabel";
import AddIcon from "@mui/icons-material/Add";
import theme from "../theme";
import {
  addToPortfolio,
  CardToAdd,
  toggleModalIsOpen,
} from "../lib/features/addToPortfolioSlice";
import { useAppDispatch } from "../lib/hooks";

interface TcgCardProps {
  image: string | undefined;
  title: string;
  slug: string;
  cardId: string;
  cardPrice: number | null;
  foiling: "S" | "C" | "R";
  edition: string;
  featured?: boolean;
  uniquePrintingId?: string;
  uniqueCardId?: string;
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
  uniquePrintingId,
  uniqueCardId,
}) => {
  const dispatch = useAppDispatch();
  const [hasImageLoaded, setHasImageLoaded] = useState<boolean>(false);
  const formattedFoiling = convertFoilingLabel(foiling);
  const isFoiled = foiling !== "S";

  const toggleAddToPortfolioIsOpen = (cardData: CardToAdd) => {
    dispatch(toggleModalIsOpen());
    dispatch(
      addToPortfolio({
        cardTitle: cardData.cardTitle,
        cardImageUrl: cardData.cardImageUrl,
        cardUniqueId: cardData.cardUniqueId,
        printingUniqueId: cardData.printingUniqueId,
        lowPrice: cardPrice,
      })
    );
  };

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
        position: "relative",
      }}
    >
      <Card
        sx={{
          backgroundColor: "transparent",
          boxShadow: "unset",
          paddingLeft: featured ? 0 : 5,
          overflow: "visible",
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
            {isFoiled && <FoilOverlay foiling={foiling} />}
          </Box>
          {hasImageLoaded && (
            <CardContent sx={{ padding: 0, paddingTop: 1 }}>
              <Box
                sx={{
                  position: "absolute",
                  top: -20,
                  left: -15,
                }}
              >
                <Box
                  sx={{
                    padding: "3px",
                    boxSizing: "content-box",
                    borderRadius: "50%",
                    backgroundColor: theme.palette.success.main,
                    zIndex: 1,
                    position: "relative",
                    width: "25px",
                    height: "25px",
                    boxShadow: "0px 1px 4px 0px #0000008c",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    if (!!uniqueCardId && !!uniquePrintingId && !!image)
                      toggleAddToPortfolioIsOpen({
                        cardTitle: title,
                        cardImageUrl: image,
                        cardUniqueId: uniqueCardId,
                        printingUniqueId: uniquePrintingId,
                        lowPrice: cardPrice,
                      });
                  }}
                >
                  <AddIcon color="primary" />
                </Box>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  gutterBottom
                  variant="body1"
                  maxWidth={featured ? 100 : "unset"}
                >
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
