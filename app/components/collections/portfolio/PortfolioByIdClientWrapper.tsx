"use client";
import { getPortfolioById } from "@/helpers/getPortfolioById";
import { TransformedPortfolioData } from "@/typings/Portfolios";
import { Box, Typography, Divider } from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import TCGLineChart from "../../TCGLineChart";
import { getPortfolioHistoryPriceData } from "@/helpers/getPortfolioHistoryPriceData";
import { DateString } from "@/typings/Dates";
import { CardSet } from "@/typings/FaBSet";
import FaBSetJson from "@/app/jsonData/FaBSet.json";
import theme from "../../../theme";
import SearchBar from "../../search/SearchBar";
import PortfolioReturnHeader from "./PortfolioReturnHeader";
import UpdatePortfolioCardModal from "../../modals/UpdatePortfolioCardModal";
import useAuthProviders from "@/app/hooks/useAuthProviders";
import TcgCard from "../../cardUi/TcgCard";

interface PortfolioByIdClientWrapper {
  userEmail: string | null | undefined;
}

const PortfolioByIdClientWrapper: React.FC<PortfolioByIdClientWrapper> = ({
  userEmail,
}) => {
  const { providers, handleLogin } = useAuthProviders();
  const FaBSetDataJson: CardSet[] = FaBSetJson as CardSet[];
  const params = useParams<{ pid: string }>();
  const pid = params.pid;

  const [portfolioData, setPortfolioData] =
    useState<TransformedPortfolioData | null>(null);

  const [historicPriceData, setHistoricPriceData] = useState<
    { low_price: number; date: DateString }[] | null
  >(null);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredCards, setFilteredCards] = useState<any[]>([]);

  const setPortfolioState = async () => {
    console.log({ portfolioData, userEmail });
    if (userEmail) {
      const portfolioDataById = await getPortfolioById(pid, userEmail);
      setPortfolioData(portfolioDataById);

      const historicPriceData = await getPortfolioHistoryPriceData(pid);
      setHistoricPriceData(historicPriceData);
    }
  };
  useEffect(() => {
    setPortfolioState();
  }, [userEmail, pid]);

  const totalCardQty = portfolioData?.cards.reduce(
    (acc, cardObj) => acc + cardObj.quantity,
    0
  );

  const fetchPortfolioPriceDataByDayInterval = async (dayInterval: string) => {
    const historicPriceData = await getPortfolioHistoryPriceData(
      pid,
      dayInterval
    );
    setHistoricPriceData(historicPriceData);
  };

  const handleSearchChange = (e: React.FormEvent<HTMLInputElement>) => {
    setSearchQuery(e.currentTarget.value);
    if (e.currentTarget.value !== "" && !!portfolioData?.cards.length) {
      const searchedCards = portfolioData?.cards.filter((card) =>
        card.card_name
          .toLowerCase()
          .includes(e.currentTarget.value.toLowerCase())
      );
      setFilteredCards(searchedCards);
    }
  };

  if (!userEmail && !portfolioData) {
    return (
      <Box display="flex">
        <Typography>No Data or User Found</Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" sx={{ flexFlow: "row wrap" }}>
      <Box
        width={"100%"}
        display={"flex"}
        justifyContent={"space-between"}
        borderBottom={`1px solid ${theme.palette.secondary.main}`}
        pb={1}
        mb={1}
      >
        <Typography variant="h4">{portfolioData?.name}</Typography>
        <Typography
          variant="h4"
          sx={{
            display: "flex",
            alignItems: "center",
            color: theme.palette.success.light,
          }}
        >
          ${portfolioData?.recentPortfolioCostChange.toFixed(2)}
        </Typography>
      </Box>
      <PortfolioReturnHeader portfolioId={pid} />
      <Box mt={10} width={"100%"}>
        <TCGLineChart
          data={historicPriceData}
          width={1100}
          height={500}
          historicDataCb={fetchPortfolioPriceDataByDayInterval}
        />
      </Box>
      <Box width={"100%"} display={"flex"} mt={5}>
        <Typography variant="h6">Total Cards:</Typography>
        <Typography
          ml={1}
          variant="body1"
          sx={{
            borderRadius: "50%",
            backgroundColor: theme.palette.primary.main,
            height: "35px",
            width: "35px",
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: "bold",
          }}
        >
          {totalCardQty}
        </Typography>
      </Box>
      <Box mt={2}>
        <SearchBar
          value={searchQuery}
          placeholder={"Search your collection"}
          onChange={(e) => handleSearchChange(e)}
        />
      </Box>
      <Box display="flex" mt={10} width={"100%"} sx={{ flexFlow: "row wrap" }}>
        {(searchQuery ? filteredCards : portfolioData?.cards || []).map(
          (card) => {
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
              printing_unique_id,
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
                slug={formattedSetName || "na"}
                cardId={printing_id}
                cardPrice={cardSumCost}
                foiling={foiling}
                edition={edition}
                quantity={quantity}
                canDelete
                portfolioId={pid}
                uniquePrintingId={printing_unique_id}
              />
            );
          }
        )}
      </Box>
      <UpdatePortfolioCardModal
        providers={providers}
        handleLogin={handleLogin}
        onCloseCb={setPortfolioState}
      />
    </Box>
  );
};
export default PortfolioByIdClientWrapper;
