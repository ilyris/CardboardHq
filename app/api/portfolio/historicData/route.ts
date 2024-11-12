import { db } from "@/app/lib/db";
import { findUserByEmail } from "@/helpers/api/findUserByEmail";
import { auth } from "@/auth";
import { successResponse } from "@/helpers/successResponse";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const portfolioId = req.nextUrl.searchParams.get("portfolioId");
  const dayInterval = req.nextUrl.searchParams.get("dayInterval") || 7;

  const session = await auth();
  try {
    if (!!session && session.user.email) {
      const user = await findUserByEmail(session.user.email);
      if (user) {
        const portfolio_with_historic_data = await db
          .selectFrom("portfolio_prices")
          .select(["price", "price_timestamp"])
          .where("portfolio_id", "=", portfolioId)
          .where(
            "price_timestamp",
            ">=",
            new Date(Date.now() - Number(dayInterval) * 24 * 60 * 60 * 1000)
          )
          .execute();

        if (portfolio_with_historic_data) {
          portfolio_with_historic_data.sort((a, b) => {
            return (
              new Date(a.price_timestamp).getTime() -
              new Date(b.price_timestamp).getTime()
            );
          });

          const formattedHistoricDataDate = portfolio_with_historic_data.map(
            (row) => {
              return {
                low_price: row.price,
                date: new Date(row.price_timestamp).toLocaleDateString(
                  "en-US",
                  {
                    month: "2-digit",
                    day: "2-digit",
                  }
                ),
              };
            }
          );

          if (!!formattedHistoricDataDate.length)
            return successResponse(formattedHistoricDataDate);
          return successResponse(portfolio_with_historic_data);
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
