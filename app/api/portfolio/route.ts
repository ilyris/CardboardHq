import { db, PortfolioAggregate } from "@/app/lib/db";
import { findUserByEmail } from "@/helpers/api/findUserByEmail";
import { auth } from "@/helpers/auth";
import { successResponse } from "@/helpers/successResponse";
import { TransformedPortfolioData } from "@/typings/Portfolios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// Transform the data to create the portfolio view
const transformData = (
  aggregatePortfolioWithCardsData: PortfolioAggregate[],
  mostRecentCardDataWithPricing: {
    printing_unique_id: string;
    low_price: number | null;
    market_price: number | null;
    price_date: Date;
  }[]
): TransformedPortfolioData[] => {
  const portfolios: { [key: string]: TransformedPortfolioData } = {};

  const priceLookup = mostRecentCardDataWithPricing.reduce((acc, card) => {
    acc[card.printing_unique_id] = card.low_price ?? card.market_price ?? 0;
    return acc;
  }, {} as { [key: string]: number });

  aggregatePortfolioWithCardsData.forEach((row) => {
    if (!portfolios[row.portfolio_id]) {
      portfolios[row.portfolio_id] = {
        id: row.portfolio_id,
        name: row.portfolio_name,
        cards: [],
        initialPortfolioCost: 0,
        recentPortfolioCostChange: 0,
      };
    }

    const card = {
      portfolio_card_id: row.portfolio_card_id,
      card_unique_id: row.card_unique_id,
      printing_unique_id: row.printing_unique_id,
      quantity: row.quantity,
      grade: row.grade,
      unit_price: row.unit_price,
      use_market_price: row.use_market_price,
      date_added: row.date_added,
      card_name: row.card_name,
      set_printing_unique_id: row.set_printing_unique_id,
      printing_id: row.printing_id,
      set_id: row.set_id,
      edition: row.edition,
      foiling: row.foiling,
      image_url: row.image_url,
      tcgplayer_product_id: row.tcgplayer_product_id,
      tcgplayer_url: row.tcgplayer_url,
      low_price: row.low_price,
      market_price: row.market_price,
    };

    if (!!card.card_unique_id) {
      portfolios[row.portfolio_id].cards.push(card);
    }

    // Calculate initialPortfolioCost using unit_price
    const unitPrice = row.unit_price ?? 0;
    portfolios[row.portfolio_id].initialPortfolioCost +=
      unitPrice * row.quantity;

    const recentPrice = priceLookup[row.printing_unique_id] ?? 0;
    portfolios[row.portfolio_id].recentPortfolioCostChange +=
      recentPrice * row.quantity;
  });

  return Object.values(portfolios);
};

export async function GET() {
  const session = await auth();
  const cookieStore = cookies();

  // Log both possible cookie names
  const secureSessionToken = cookieStore.get(
    "__Secure-next-auth.session-token"
  );
  const sessionToken = cookieStore.get("next-auth.session-token");

  console.log("Secure Session Token:", secureSessionToken?.value);
  console.log("Session Token:", sessionToken?.value);

  console.log({ session });
  try {
    if (!session || !session.user.email)
      return NextResponse.json(
        { error: "No session available" },
        { status: 500 }
      );
    if (session?.user.email) {
      const user = await findUserByEmail(session?.user.email);
      if (!user)
        return NextResponse.json(
          { error: "Failed to find user" },
          { status: 500 }
        );
      if (user) {
        const portfolios = await db
          .selectFrom("portfolio_aggregate")
          .selectAll()
          .where("portfolio_user_id", "=", user.id)
          .execute();

        if (portfolios.length === 0) {
          return NextResponse.json(
            { error: `No portfolios found for user: ${user.email}` },
            { status: 404 }
          );
        }

        const printingUniqueIds = portfolios.map(
          (portfolio) => portfolio.printing_unique_id
        );

        const mostRecentCardDataWithPricing = await db
          .selectFrom("printing_with_card_and_latest_pricing")
          .select([
            "printing_unique_id",
            "low_price",
            "market_price",
            "price_date",
          ])
          .where("printing_unique_id", "in", printingUniqueIds)
          .execute();

        const portfolioData = transformData(
          portfolios,
          mostRecentCardDataWithPricing
        );

        return successResponse(portfolioData);
      }
    }
  } catch (err) {
    console.error("Error processing portfolios:", err);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();

  try {
    await db
      .deleteFrom("portfolio_prices")
      .where("portfolio_id", "=", body.portfolioId)
      .execute();

    await db
      .deleteFrom("portfolio_card")
      .where("portfolio_unique_id", "=", body.portfolioId)
      .execute();

    await db
      .deleteFrom("portfolio")
      .where("unique_id", "=", body.portfolioId)
      .execute();

    return NextResponse.json(
      { error: "Portfolio has been deleted" },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
