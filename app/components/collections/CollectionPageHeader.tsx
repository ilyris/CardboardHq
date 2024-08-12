import { Box, Typography } from "@mui/material";
import AddPortfolioButton from "../AddPortfolioButton";

interface CollectionPageHeaderProps {
  toggleIsPortfolioModalOpen: () => void;
}
const CollectionPageHeader: React.FC<CollectionPageHeaderProps> = ({
  toggleIsPortfolioModalOpen,
}) => {
  return (
    <Box
      display="flex"
      justifyContent={"space-between"}
      borderBottom={"1px solid #fff"}
    >
      <Typography variant="h5">Portfolios</Typography>
      <AddPortfolioButton handleClickCb={toggleIsPortfolioModalOpen} />
    </Box>
  );
};
export default CollectionPageHeader;
