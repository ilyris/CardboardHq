import { Container, Typography } from "@mui/material";
import { getPortfolioWithCardsList } from "@/helpers/getPortfolioWithCardsList";
import CollectionClientWrapper from "../components/collections/CollectionClientWrapper";
import { TransformedPortfolioData } from "@/typings/Portfolios";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function CollectionPage() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }
  const portfolioList: TransformedPortfolioData[] =
    await getPortfolioWithCardsList(session?.user.email);

  return (
    <Container>
      <Typography mb={4} variant="h3">
        Your Collections
      </Typography>
      <CollectionClientWrapper portfolioList={portfolioList} />
    </Container>
  );
}
