import { db } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Adding Portfolio Route
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { portfolioId, printingId, edition, foiling, title } = body;
    console.log({ body });

    const portfolioCard = await db
      .selectFrom("portfolio_card")
      .select(["printing_unique_id", "quantity", "unit_price"])
      .where("portfolio_unique_id", "=", portfolioId)
      .where("printing_unique_id", "=", printingId)
      .execute();

    const portfolioCardWithLatestPrice = await db
      .selectFrom("printing_with_card_and_latest_pricing")
      .select(["low_price"])
      .where("foiling", "=", foiling)
      .where("edition", "=", edition)
      .where("printing_unique_id", "=", printingId)
      .execute();

    const lastAddedPortfolioPrice = await db
      .selectFrom("portfolio_prices")
      .select(["price", "price_timestamp"])
      .where("portfolio_id", "=", portfolioId)
      .orderBy("price_timestamp", "desc")
      .limit(1)
      .executeTakeFirst();

    // const removedCardResult = await db
    //   .deleteFrom("portfolio_card")
    //   .where("portfolio_unique_id", "=", portfolioId)
    //   .where("printing_unique_id", "=", printingId)
    //   .executeTakeFirst();

    const timestamp = new Date();
    const lowPrice = portfolioCardWithLatestPrice[0]?.low_price ?? null;

    if (
      portfolioCard &&
      lastAddedPortfolioPrice &&
      !!portfolioCardWithLatestPrice.length &&
      lowPrice
    ) {
      const { quantity } = portfolioCard[0];
      const totalCostOfCards = quantity * lowPrice;
      const updatedPortfolioPrice =
        lastAddedPortfolioPrice!.price - totalCostOfCards;
      console.log({ updatedPortfolioPrice });

      // await db
      //   .updateTable("portfolio_prices")
      //   .set({ price_timestamp: timestamp, price: updatedPortfolioPrice })
      //   .where("portfolio_id", "=", portfolioId)
      //   .where("price_timestamp", "=", lastAddedPortfolioPrice.price_timestamp)
      //   .execute();
    }

    return NextResponse.json({
      message: `Deleted your ${title}`,
    });
  } catch (err) {
    // Response based on success
    console.error("Error processing request:", err);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}