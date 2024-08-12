import { Container, Typography } from "@mui/material";
import { getPortfolioWithCardsList } from "@/helpers/getPortfolioWithCardsList";
import CollectionClientWrapper from "../components/collections/CollectionClientWrapper";
import { TransformedPortfolioData } from "@/typings/Portfolios";
import { cookies } from "next/headers";

export default async function CollectionPage() {
  const cookieStore = cookies();

  // Log both possible cookie names
  const secureSessionToken = cookieStore.get(
    "__Secure-next-auth.session-token"
  );
  const sessionToken = cookieStore.get("next-auth.session-token");

  console.log("Secure Session Token:", secureSessionToken?.value);
  console.log("Session Token:", sessionToken?.value);

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
