import { Container, Typography } from "@mui/material";
import { getPortfolioWithCardsList } from "@/helpers/getPortfolioWithCardsList";
import { TransformedPortfolioData } from "../api/portfolio/route";
import CollectionClientWrapper from "../components/collections/CollectionClientWrapper";

export default async function CollectionPage() {
  const portfolioList: TransformedPortfolioData[] =
    await getPortfolioWithCardsList();

  return (
    <Container>
      <Typography mb={4} variant="h3">
        Your Collections
      </Typography>
      <CollectionClientWrapper portfolioList={portfolioList} />
    </Container>
  );
}
