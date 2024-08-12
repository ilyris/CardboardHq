import { db } from "@/app/lib/db";
import { findUserByEmail } from "@/helpers/api/findUserByEmail";
import { auth } from "@/auth";
import { successResponse } from "@/helpers/successResponse";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  const session = await auth();
  try {
    if (!!session && session.user.email) {
      const user = await findUserByEmail(session.user.email);
      if (user) {
        const portfolios_with_prices = await db
          .selectFrom("portfolio_with_latest_prices")
          .select([
            "price",
            "portfolio_name",
            "description",
            "portfolio_unique_id",
          ])
          .where("user_id", "=", user.id)
          .execute();

        if (portfolios_with_prices) {
          return successResponse(portfolios_with_prices);
        }
      }
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
    const session = await auth();
    const newPortfolioId = uuidv4();

    if (!!session && session.user.email) {
      const user = await findUserByEmail(session.user.email);
      if (user) {
        const result = await db
          .insertInto("portfolio")
          .values({
            name: portfolioName,
            description: portfolioDescription,
            unique_id: newPortfolioId,
            user_id: user.id,
          })
          .executeTakeFirst();
        if (result) {
          return NextResponse.json({ message: " Portfolio was added" });
        }
      }
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
