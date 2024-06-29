"use client";
import fabSetData from "@/app/jsonData/FaBSet.json";
import SetCard from "./components/SetCard";
import Header from "./components/Header";
import { Container } from "@mui/material";

export default function Home() {
  return (
    <main>
      <Container maxWidth="xl">
        <div style={{ display: "flex", flexFlow: "row wrap" }}>
          {fabSetData.map((set) => (
            <SetCard
              assetFilePath={
                !set.formatted_name.includes("crucible")
                  ? `/Fab_assets/key_art/${set.formatted_name}.jpg`
                  : `/Fab_assets/key_art/${set.formatted_name}.png`
              }
              logo={`/Fab_assets/logos/${set.formatted_name}.png`}
              title={set.name}
            />
          ))}
        </div>
      </Container>
    </main>
  );
}
