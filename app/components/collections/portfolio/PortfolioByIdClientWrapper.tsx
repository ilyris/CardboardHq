"use client";
import { getPortfolioById } from "@/helpers/getPortfolioById";
import { TransformedPortfolioData } from "@/typings/Portfolios";
import { Box, Typography, Divider } from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import TcgCard from "../../TcgCard";
import TCGLineChart from "../../TCGLineChart";
import { getPortfolioHistoryPriceData } from "@/helpers/getPortfolioHistoryPriceData";
import { DateString } from "@/typings/Dates";
import { CardSet } from "@/typings/FaBSet";
import FaBSetJson from "@/app/jsonData/FaBSet.json";

interface PortfolioByIdClientWrapper {
  userEmail: string | null | undefined;
}

const PortfolioByIdClientWrapper: React.FC<PortfolioByIdClientWrapper> = ({
  userEmail,
}) => {
  const FaBSetDataJson: CardSet[] = FaBSetJson as CardSet[];
  const params = useParams<{ pid: string }>();
  const pid = params.pid;

  const [portfolioData, setPortfolioData] =
    useState<TransformedPortfolioData | null>(null);

  const [historicPriceData, setHistoricPriceData] = useState<
    { low_price: number; date: DateString }[] | null
  >(null);

  useEffect(() => {
    (async () => {
      if (userEmail && !portfolioData) {
        const portfolioDataById = await getPortfolioById(pid, userEmail);
        setPortfolioData(portfolioDataById);

        const historicPriceData = await getPortfolioHistoryPriceData(pid);
        setHistoricPriceData(historicPriceData);
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

  return (
    <Box display="flex" sx={{ flexFlow: "row wrap" }}>
      <Box width={"100%"} display={"flex"} justifyContent={"space-between"}>
        <Typography variant="h4">{portfolioData?.name}</Typography>
        <Typography variant="h4">
          {portfolioData?.recentPortfolioCostChange}
        </Typography>
      </Box>
      <Box mt={10}>
        <TCGLineChart data={historicPriceData} width={1100} />
      </Box>
      {!!portfolioData?.cards.length && (
        <Box display={"flex"} mt={10}>
          {portfolioData?.cards.map((card) => {
            const {
              card_name,
              edition,
              foiling,
              image_url,
              low_price,
              unit_price,
              printing_id,
              quantity,
              set_id,
            } = card;

            const formattedSetName = FaBSetDataJson.find(
              (set) => set.id === set_id
            )?.formatted_name;

            const cardSumCost = low_price || unit_price * quantity;
            return (
              <TcgCard
                key={printing_id}
                image={image_url}
                title={card_name}
                slug={formattedSetName!} // setName EVR should be Everfest
                cardId={printing_id}
                cardPrice={cardSumCost}
                foiling={foiling}
                edition={edition}
                quantity={quantity}
              />
            );
          })}
        </Box>
      )}
    </Box>
  );
};
export default PortfolioByIdClientWrapper;
