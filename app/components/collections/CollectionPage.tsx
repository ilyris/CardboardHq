import { Box, Typography } from "@mui/material";
import PortfolioCard from "../portfolio/PortfolioCard";
import AddPortfolioModal from "../modals/AddPortfolioModal";
import { TransformedPortfolioData } from "@/typings/Portfolios";

interface CollectionClientProps {
  portfolioList: TransformedPortfolioData[];
  isPortfolioModalOpen: boolean;
  toggleIsPortfolioModalOpen: () => void;
}

const CollectionClient: React.FC<CollectionClientProps> = ({
  portfolioList,
  isPortfolioModalOpen,
  toggleIsPortfolioModalOpen,
}) => {
  return (
    <>
      {!!portfolioList?.length ? (
        <Box display="flex">
          {portfolioList.map((portfolio) => {
            const totalCards = portfolio.cards.reduce(
              (sum, card) => sum + card.quantity,
              0
            );
            const portfolioSum = parseFloat(
              portfolio.recentPortfolioCostChange.toFixed(2)
            );
            const percentageChange =
              ((portfolio.recentPortfolioCostChange -
                portfolio.initialPortfolioCost) /
                portfolio.initialPortfolioCost) *
              100;

            return (
              <Box key={portfolio.id}>
                <PortfolioCard
                  portfolioName={portfolio.name}
                  portfolioId={portfolio.id}
                  portfolioCards={totalCards}
                  portfolioSum={portfolioSum}
                  portfolioPercentageChange={percentageChange}
                />
              </Box>
            );
          })}
        </Box>
      ) : (
        <Box>
          <Typography variant="h6">No Portfolios Currently</Typography>
        </Box>
      )}
      <AddPortfolioModal
        isOpen={isPortfolioModalOpen}
        isModalOpenCb={toggleIsPortfolioModalOpen}
      />
    </>
  );
};

export default CollectionClient;
