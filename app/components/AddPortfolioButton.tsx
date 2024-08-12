"use client"; // This makes the component a Client Component
import { Button } from "@mui/material";

interface AddPortfolioButtonProps {
  handleClickCb: () => void;
}

const AddPortfolioButton: React.FC<AddPortfolioButtonProps> = ({
  handleClickCb,
}) => {
  return (
    <Button variant="contained" sx={{ mb: 1 }} onClick={handleClickCb}>
      Add Portfolio
    </Button>
  );
};

export default AddPortfolioButton;
