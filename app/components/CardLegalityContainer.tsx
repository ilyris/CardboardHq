import { getCardInformation } from "@/helpers/getCardInformation";
import { Box, Chip, Paper, Skeleton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { CardInformation } from "../lib/db";
import theme from "../theme";

interface CardLegalityContainerProps {
  cardUniqueId: string | null;
}

const isLegal = (legal: boolean) => (legal ? "LEGAL" : "NOT LEGAL");

const CardLegalityContainer: React.FC<CardLegalityContainerProps> = ({
  cardUniqueId,
}) => {
  const [cardInfo, setCardInfo] = useState<CardInformation | null>(null);

  useEffect(() => {
    if (!cardUniqueId) return;

    (async () => {
      const response = await getCardInformation(cardUniqueId);
      setCardInfo(response);
    })();
  }, [cardUniqueId]);

  if (!cardInfo) return <Skeleton width="45%" height="1100px" />;
  return (
    <Paper
      sx={{
        width: "45%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.palette.secondary.main,
        padding: 5,
      }}
    >
      <Box>
        <Typography variant="h6">Type</Typography>
        <Typography variant="body1">{cardInfo.type_text}</Typography>
      </Box>
      <Box mt={3}>
        <Typography variant="h6">Text</Typography>
        <Typography variant="body1">
          {cardInfo.functional_text_plain}
        </Typography>
      </Box>
      <Box mt={3}>
        <Typography variant="h6">Legalities</Typography>
        {cardInfo.hasOwnProperty("blitz_legal") &&
          cardInfo.hasOwnProperty("cc_legal") &&
          cardInfo.hasOwnProperty("commoner_legal") && (
            <>
              <Box p={1} display="flex" justifyContent={"space-between"}>
                <Box display="flex">
                  <Typography mr={2} variant="body2">
                    Blitz
                  </Typography>
                  <Chip
                    color="success"
                    variant="filled"
                    size="small"
                    label={isLegal(!!cardInfo.blitz_legal)}
                  />
                </Box>
                <Box display="flex">
                  <Typography mr={2} variant="body2">
                    Classic Constructed
                  </Typography>
                  <Chip
                    color="success"
                    variant="filled"
                    size="small"
                    label={isLegal(!!cardInfo.cc_legal)}
                  />
                </Box>
              </Box>

              <Box p={1} display="flex" justifyContent={"space-between"}>
                <Box display="flex">
                  <Typography mr={2} variant="body2">
                    Commoner
                  </Typography>
                  <Chip
                    color="success"
                    variant="filled"
                    size="small"
                    label={isLegal(!!cardInfo.commoner_legal)}
                  />
                </Box>
              </Box>
            </>
          )}
      </Box>
    </Paper>
  );
};
export default CardLegalityContainer;
