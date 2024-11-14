import theme from "@/app/theme";
import { getPortfolioHoldingAdjustments } from "@/helpers/getPortfolioHoldingAdjustments";
import { isNegativeNumber } from "@/helpers/isNegativeNumber";
import { PortfolioHoldingAdjustment } from "@/typings/Portfolios";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";

interface PortfolioReturnHeader {
  portfolioId: string;
}
const PortfolioReturnHeader: React.FC<PortfolioReturnHeader> = ({
  portfolioId,
}) => {
  const [portfolioHoldingAdjustments, setPortfolioHoldingAdjustments] =
    useState<PortfolioHoldingAdjustment | null>(null);
  const handleFetchingHoldingAdjustments = async (portfolioId: string) => {
    const d = await getPortfolioHoldingAdjustments(portfolioId);
    setPortfolioHoldingAdjustments(d);
  };

  useEffect(() => {
    handleFetchingHoldingAdjustments(portfolioId);
  }, []);

  return (
    <Box width={"100%"} display={"flex"} justifyContent={"space-between"}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="h5" fontWeight={100}>
          Todays Return:
        </Typography>
        <Typography
          variant="h5"
          ml={1}
          fontWeight={100}
          color={
            !isNegativeNumber(
              portfolioHoldingAdjustments?.todaysReturn.usd || 0
            )
              ? theme.palette.success.light
              : theme.palette.error.light
          }
        >
          {!isNegativeNumber(portfolioHoldingAdjustments?.todaysReturn.usd || 0)
            ? "+"
            : "-"}
          ${portfolioHoldingAdjustments?.todaysReturn.usd} (
          {portfolioHoldingAdjustments?.todaysReturn.percentage}%)
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifySelf: "flex-end",
        }}
      >
        <Typography variant="h5" fontWeight={100}>
          Total Return:
        </Typography>
        <Typography
          variant="h5"
          ml={1}
          fontWeight={100}
          color={
            !isNegativeNumber(
              portfolioHoldingAdjustments?.todaysReturn.usd || 0
            )
              ? theme.palette.success.light
              : theme.palette.error.light
          }
        >
          {!isNegativeNumber(portfolioHoldingAdjustments?.todaysReturn.usd || 0)
            ? "+"
            : "-"}
          ${portfolioHoldingAdjustments?.totalReturn.usd} (
          {portfolioHoldingAdjustments?.totalReturn.percentage}%)
        </Typography>
      </Box>
    </Box>
  );
};

export default PortfolioReturnHeader;
