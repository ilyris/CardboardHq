import React, { useEffect, useState } from "react";
import axios from "axios";
import TcgCard from "./TcgCard";
import fabSetData from "@/app/jsonData/FaBSet.json";
import { Box, Skeleton, styled, Typography } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import theme from "../theme";

const BoxFirstNoPadding = styled(Box)(`
    padding-left: 40px;
    &:first-child {
      padding-left: 0;
    }
  `);
const SkeletonFirstNoMargin = styled(Skeleton)(`
    margin-left: 40px;
    &:first-child {
      margin-left: 0;
    }
  `);
const FeaturedCards: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cardPercentagePriceData, setCardPercentagePriceData] = useState<any>(
    []
  );
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("api/cardsPrice/get");
        console.log({ response });
        setCardPercentagePriceData(response.data.results);
      } catch (error) {
        console.error("Error fetching price movements:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Box mb={5}>
      <Typography variant="h2">Market Movers</Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "row wrap",
          alignItems: "center",
          height: 400,
        }}
      >
        {!isLoading &&
          !!cardPercentagePriceData.length &&
          cardPercentagePriceData.map((card) => {
            const setName = fabSetData.find(
              (set) => set.id === card.set_id
            )?.formatted_name;
            return (
              <BoxFirstNoPadding position={"relative"}>
                <TcgCard
                  image={card.image_url}
                  title={card.card_name}
                  slug={setName}
                  cardId={card.printing_id}
                  cardPrice={card.low_price}
                  edition={card.edition}
                  foiling={card.foiling}
                  featured
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    zIndex: 10,
                    backgroundColor: theme.palette.background.default,
                    padding: 1,
                    paddingLeft: "10px",
                    display: "flex",
                    borderBottomLeftRadius: "10px",
                  }}
                >
                  <Typography
                    variant="body1"
                    color={"#34e334"}
                    mr={1}
                    fontWeight={"900"}
                  >{`${Math.round(card.percentage_change)}%`}</Typography>
                  <TrendingUpIcon sx={{ color: "#34e334" }} />
                </Box>
              </BoxFirstNoPadding>
            );
          })}
        {isLoading &&
          [1, 2, 3, 4, 5].map(() => (
            <SkeletonFirstNoMargin width={230} height={400} />
          ))}
      </Box>
    </Box>
  );
};

export default FeaturedCards;
