import { Container } from "@mui/material";
import PortfolioByIdClientWrapper from "../../components/collections/portfolio/PortfolioByIdClientWrapper";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function PortfolioPageById() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return (
    <Container>
      <PortfolioByIdClientWrapper userEmail={session.user.email} />
    </Container>
  );
}
