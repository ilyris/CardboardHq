"use client";
import fabSetData from "@/app/jsonData/FaBSet.json";
import SetCard from "./components/SetCard";
import { Container } from "@mui/material";

export default function Home() {
  return (
    <main>
      <Container maxWidth="lg">
        <div style={{ display: "flex", flexFlow: "row wrap" }}>
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
        </div>
      </Container>
    </main>
  );
}
