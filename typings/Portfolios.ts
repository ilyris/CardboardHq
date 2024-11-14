export interface TransformedPortfolioData {
  id: string;
  name: string;
  cards: any[];
  initialPortfolioCost: number;
  recentPortfolioCostChange: number;
}
interface ReturnData {
  usd: number;
  percentage: string;
}

export interface PortfolioHoldingAdjustment {
  todaysReturn: ReturnData;
  totalReturn: ReturnData;
}
