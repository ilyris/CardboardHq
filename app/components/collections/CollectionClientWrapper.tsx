"use client";
import { TransformedPortfolioData } from "@/typings/Portfolios";
import CollectionClient from "./CollectionPage";
import CollectionPageHeader from "./CollectionPageHeader";
import { useState } from "react";

interface CollectionClientProps {
  portfolioList: TransformedPortfolioData[];
}

const CollectionClientWrapper: React.FC<CollectionClientProps> = ({
  portfolioList,
}) => {
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] =
    useState<boolean>(false);

  const toggleIsPortfolioModalOpen = () => {
    setIsPortfolioModalOpen(!isPortfolioModalOpen);
  };
  return (
    <>
      <CollectionPageHeader
        toggleIsPortfolioModalOpen={toggleIsPortfolioModalOpen}
      />
      <CollectionClient
        portfolioList={portfolioList}
        isPortfolioModalOpen={isPortfolioModalOpen}
        toggleIsPortfolioModalOpen={toggleIsPortfolioModalOpen}
      />
    </>
  );
};
export default CollectionClientWrapper;
