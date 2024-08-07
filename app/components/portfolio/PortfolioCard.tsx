import theme from "@/app/theme";
import { Box, Card, CardContent, Divider, Typography } from "@mui/material";
import Link from "next/link";
import StyleIcon from "@mui/icons-material/Style";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

interface PortfolioCardProps {
  portfolioName: string;
  portfolioCards: number;
  portfolioSum: number | string;
  portfolioId: string;
}
const PortfolioCard: React.FC<PortfolioCardProps> = ({
  portfolioName,
  portfolioCards,
  portfolioSum,
  portfolioId,
}) => {
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const response = await axios.delete("/api/portfolio", {
      data: { portfolioId },
      headers: { Authorization: "***" },
    });
  };

  return (
    <Link href={`/collection/${portfolioId}`}>
      <Card
        sx={{
          margin: 2,
          color: theme.palette.background.default,
          minWidth: 200,
        }}
      >
        <CardContent>
          <Box
            display={"flex"}
            justifyContent={"flex-end"}
            sx={{ color: theme.palette.error.main }}
          >
            <DeleteIcon onClick={(event) => handleDelete(event)} />
          </Box>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {portfolioName}
          </Typography>
          <Typography variant="h6" component="div">
            ${portfolioSum}
          </Typography>
          <Divider />
          <Box display="flex" justifyItems={"center"} alignItems={"center"}>
            <Typography variant="h6">{portfolioCards}</Typography>
            <StyleIcon sx={{ marginLeft: 1 }} />
          </Box>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PortfolioCard;
