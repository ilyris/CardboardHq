"use client";
import fabSetData from "@/app/jsonData/FaBSet.json";
import SetCard from "./components/SetCard";
import { Box, Container, Typography } from "@mui/material";
import FeaturedCards from "./components/FeaturedCards";

export default function Home() {
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
      </Container>
    </main>
  );
}
