import { db } from "@/app/lib/db";
import { successResponse } from "@/helpers/successResponse";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  try {
    const portfolios_with_prices = await db
      .selectFrom("portfolio_with_latest_prices")
      .selectAll()
      .execute();

    if (portfolios_with_prices) {
      return successResponse(portfolios_with_prices);
    }
    return NextResponse.json(
      { error: "Failed find portfolios" },
      { status: 500 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

// Adding Portfolio Route
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { portfolioName, portfolioDescription } = body;
    const newPortfolioId = uuidv4();

    const result = await db
      .insertInto("portfolio")
      .values({
        name: portfolioName,
        description: portfolioDescription,
        unique_id: newPortfolioId,
      })
      .executeTakeFirst();
    if (result) {
      return NextResponse.json({ message: " Portfolio was added" });
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
