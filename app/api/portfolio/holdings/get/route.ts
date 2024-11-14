import { db } from "@/app/lib/db";
import { PortfolioHoldingAdjustment } from "@/typings/Portfolios";
import { NextRequest, NextResponse } from "next/server";

// Adding Portfolio Route
export async function GET(req: NextRequest) {
  try {
    const portfolioId = req.nextUrl.searchParams.get("portfolioId");

    // fetch all cards by pid
    const portfolioCards = await db
      .selectFrom("portfolio_card")
      .select(["printing_unique_id", "quantity", "unit_price"])
      .where("portfolio_unique_id", "=", portfolioId)
      .execute();

    // fetch cards printing_id & quantities
    const cardPrintingIdsAndQuantity = portfolioCards.map(
      ({ printing_unique_id, quantity, unit_price }) => ({
        printing_unique_id,
        quantity,
        unit_price,
      })
    );

    // Calculate portfolio value by latest pricing of cards
    const initialPortfolioValue = cardPrintingIdsAndQuantity.reduce(
      (total, card) => {
        if (card.unit_price !== null) {
          return total + card.unit_price * card.quantity;
        } else {
          return total;
        }
      },
      0
    );

    const lastTwoPortfolioPrices = await db
      .selectFrom("portfolio_prices")
      .select(["price"])
      .where("portfolio_id", "=", portfolioId)
      .orderBy("price_timestamp", "desc")
      .limit(2)
      .execute();

    if (!!lastTwoPortfolioPrices.length && initialPortfolioValue) {
      const todaysPercentageDiff =
        ((lastTwoPortfolioPrices[0].price - lastTwoPortfolioPrices[1].price) /
          lastTwoPortfolioPrices[1].price) *
        100;
      const todaysPriceDiff =
        lastTwoPortfolioPrices[0].price - lastTwoPortfolioPrices[1].price;
      const totalPercentageDiff =
        ((lastTwoPortfolioPrices[0].price - initialPortfolioValue) /
          initialPortfolioValue) *
        100;
      const totalPriceDiff =
        lastTwoPortfolioPrices[0].price - initialPortfolioValue;

      const portfolioHoldingAdjustment: PortfolioHoldingAdjustment = {
        todaysReturn: {
          usd: todaysPriceDiff,
          percentage: todaysPercentageDiff.toFixed(2),
        },
        totalReturn: {
          usd: totalPriceDiff,
          percentage: totalPercentageDiff.toFixed(2),
        },
      };

      return NextResponse.json({
        message: `Retrieved portfolio price change data`,
        results: portfolioHoldingAdjustment,
      });
    }

    // Response based on success
  } catch (err) {
    console.error("Error processing request:", err);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
