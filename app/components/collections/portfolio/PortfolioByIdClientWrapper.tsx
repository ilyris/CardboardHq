"use client";
import { Portfolio } from "@/app/lib/db";
import { getPortfolioById } from "@/helpers/getPortfolioById";
import { Box, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface PortfolioByIdClientWrapper {
  userEmail: string | null | undefined;
}

const PortfolioByIdClientWrapper: React.FC<PortfolioByIdClientWrapper> = ({
  userEmail,
}) => {
  const params = useParams<{ pid: string }>();
  const pid = params.pid;

  const [portfolioData, setPortfolioData] = useState<Portfolio | null>(null);

  useEffect(() => {
    (async () => {
      if (userEmail && !portfolioData) {
        const portfolioDataById = await getPortfolioById(pid, userEmail);
        setPortfolioData(portfolioDataById);
      }
    })();
  }, [userEmail, pid]);

  if (!userEmail && !portfolioData) {
    return (
      <Box display="flex">
        <Typography>No Data or User Found</Typography>
      </Box>
    );
  }
  console.log({ portfolioData });

  return (
    <Box display="flex">
      <Typography>Portfolio: {portfolioData?.name}</Typography>
    </Box>
  );
};
export default PortfolioByIdClientWrapper;
