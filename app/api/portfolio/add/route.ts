import { db } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Adding Portfolio Route
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const portfolioResult = await db
      .insertInto("portfolio_card")
      .values(body)
      .executeTakeFirst();

    const portfolioCards = await db
      .selectFrom("portfolio_card")
      .select(["printing_unique_id", "quantity"])
      .where("portfolio_unique_id", "=", body.portfolio_unique_id)
      .execute();

    const cardPrintingIdsAndQuantity = portfolioCards.map(
      ({ printing_unique_id, quantity }) => ({
        printing_unique_id,
        quantity,
      })
    );

    const printingIds = cardPrintingIdsAndQuantity.map(
      (card) => card.printing_unique_id
    );

    const portfolioCardPrices = await db
      .selectFrom("printing_with_card_and_latest_pricing")
      .select(["low_price", "printing_unique_id"])
      .where("printing_unique_id", "in", printingIds)
      .execute();

    // Calculate portfolio value
    const portfolioValue = cardPrintingIdsAndQuantity.reduce((total, card) => {
      const matchedPrice = portfolioCardPrices.find(
        (price) => price.printing_unique_id === card.printing_unique_id
      );

      if (matchedPrice && matchedPrice.low_price !== null) {
        return total + matchedPrice.low_price * card.quantity;
      } else {
        return total;
      }
    }, 0);

    const timestamp = new Date();

    // Get the most recent portfolio price entry for this portfolio
    const latestPrice = await db
      .selectFrom("portfolio_prices")
      .select(["price_timestamp"])
      .where("portfolio_id", "=", body.portfolio_unique_id)
      .orderBy("price_timestamp", "desc")
      .limit(1)
      .executeTakeFirst();

    const isToday =
      latestPrice &&
      new Date(latestPrice.price_timestamp).toDateString() ===
        timestamp.toDateString();

    // Insert or update today's portfolio price
    if (isToday) {
      await db
        .updateTable("portfolio_prices")
        .set({ price_timestamp: timestamp, price: portfolioValue })
        .where("portfolio_id", "=", body.portfolio_unique_id)
        .where("price_timestamp", "=", latestPrice.price_timestamp)
        .execute();
    } else {
      await db
        .insertInto("portfolio_prices")
        .values({
          portfolio_id: body.portfolio_unique_id,
          price_timestamp: timestamp,
          price: portfolioValue,
        })
        .execute();
    }

    // Response based on success
    return portfolioResult
      ? NextResponse.json({ message: `Card was added to your portfolio` })
      : NextResponse.json(
          { error: "Failed to add the portfolio" },
          { status: 500 }
        );
  } catch (err) {
    console.error("Error processing request:", err);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
