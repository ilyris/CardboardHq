import { db } from "@/app/lib/db";
import { isNegativeNumber } from "@/helpers/isNegativeNumber";
import { successResponse } from "@/helpers/successResponse";
import { NextRequest, NextResponse } from "next/server";

// Adding Portfolio Route
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { portfolioId, printingId, edition, foiling, title, quantity } =
      body.data;

    const portfolioCard = await db
      .selectFrom("portfolio_card")
      .select(["printing_unique_id", "unique_id", "quantity"])
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

    const timestamp = new Date();
    const lowPrice = Number(portfolioCardWithLatestPrice[0]?.low_price ?? 0);

    if (
      portfolioCard &&
      lastAddedPortfolioPrice &&
      !!portfolioCardWithLatestPrice.length &&
      lowPrice
    ) {
      const isAddingQuantity = portfolioCard[0].quantity < quantity;
      const quantityDifference = quantity - portfolioCard[0].quantity;
      const totalCostOfCards = quantityDifference * lowPrice;

      const updatedPortfolioPrice = isAddingQuantity
        ? Number(lastAddedPortfolioPrice!.price) + totalCostOfCards
        : Number(lastAddedPortfolioPrice!.price) - Math.abs(totalCostOfCards);

      await db
        .updateTable("portfolio_card")
        .set({ quantity: quantity })
        .where("portfolio_unique_id", "=", portfolioId)
        .where("printing_unique_id", "=", printingId)
        .execute();

      await db
        .updateTable("portfolio_prices")
        .set({ price_timestamp: timestamp, price: updatedPortfolioPrice })
        .where("portfolio_id", "=", portfolioId)
        .where(
          "price_timestamp",
          "=",
          db
            .selectFrom("portfolio_prices")
            .select("price_timestamp")
            .where("portfolio_id", "=", portfolioId)
            .orderBy("price_timestamp", "desc")
            .limit(1)
        )
        .execute();
    }

    return successResponse({
      message: `Successfully updated ${title} for your portfolio`,
      updatedQuantity: quantity,
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
