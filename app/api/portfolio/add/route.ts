import { db } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Adding Portfolio Route
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const portfolio_result = await db
      .insertInto("portfolio_card")
      .values({
        ...body,
      })
      .executeTakeFirst();

    const portfolio_cards = await db
      .selectFrom("portfolio_card")
      .select([
        "printing_unique_id",
        "quantity",
        "unit_price",
        "portfolio_unique_id",
      ])
      .where("portfolio_unique_id", "=", body.portfolio_unique_id)
      .execute();

    // Step 5: Calculate the total portfolio value
    let portfolioValue = 0;
    portfolio_cards.forEach((card) => {
      const unit_price = card.unit_price as number;
      portfolioValue += unit_price * card.quantity;
    });

    const timestamp = new Date();

    const portfolio_prices_response = await db
      .insertInto("portfolio_prices")
      .values({
        portfolio_id: body.portfolio_unique_id,
        price_timestamp: timestamp,
        price: portfolioValue,
      })
      .execute();

    if (portfolio_result && portfolio_prices_response) {
      return NextResponse.json({
        message: `Card was added to your portfolio`,
      });
    }
    return NextResponse.json(
      { error: "Failed to add the portfolio" },
      { status: 500 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
