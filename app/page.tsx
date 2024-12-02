"use client";
import fabSetData from "@/app/jsonData/FaBSet.json";
import { Box, Container, Typography } from "@mui/material";
import FeaturedCards from "./components/cardUi/FeaturedCards";
import AddToPortfolioModal from "./components/modals/AddToPortfolioModal";
import useAuthProviders from "./hooks/useAuthProviders";
import SetCard from "./components/cardUi/SetCard";

export default function Home() {
  const { providers, handleLogin } = useAuthProviders();

  return (
    <main>
      <Container maxWidth="lg">
        <Box>
          <FeaturedCards />
        </Box>
        <div>
          <Typography variant="h2">Sets</Typography>
          <Box sx={{ display: "flex", flexFlow: "row wrap" }}>
            {fabSetData.map((set) => {
              const { formatted_name, printings } = set;
              return printings.map((printing) => (
                <SetCard
                  key={printing.unique_id}
                  edition={printing.edition}
                  assetFilePath={
                    !formatted_name.includes("crucible")
                      ? `/Fab_assets/key_art/${formatted_name}.jpg`
                      : `/Fab_assets/key_art/${formatted_name}.png`
                  }
                  logo={`/Fab_assets/logos/${formatted_name}.png`}
                  title={set.name}
                />
              ));
            })}
          </Box>
        </div>
        <AddToPortfolioModal providers={providers} handleLogin={handleLogin} />
      </Container>
    </main>
  );
}
