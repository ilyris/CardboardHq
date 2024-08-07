import { db, PortfolioAggregate } from "@/app/lib/db";
import { successResponse } from "@/helpers/successResponse";
import { NextRequest, NextResponse } from "next/server";

// Return Portfolios
// Adding Portfolio Route
export interface TransformedPortfolioData {
  id: string;
  name: string;
  cards: any[];
}

const transformData = (
  rows: PortfolioAggregate[]
): TransformedPortfolioData[] => {
  const portfolios: { [key: string]: TransformedPortfolioData } = {};

  rows.forEach((row) => {
    if (!portfolios[row.portfolio_id]) {
      portfolios[row.portfolio_id] = {
        id: row.portfolio_id,
        name: row.portfolio_name,
        cards: [],
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
  });

  return Object.values(portfolios);
};

export async function GET() {
  try {
    const portfolios = await db
      .selectFrom("portfolio_aggregate")
      .selectAll()
      .execute();

    if (portfolios) {
      const portfolioData = transformData(portfolios);
      return successResponse(portfolioData);
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

export async function DELETE(req: NextRequest) {
  const body = await req.json();

  try {
    const portfolioRow = await db
      .selectFrom("portfolio")
      .selectAll()
      .where("unique_id", "=", body.portfolioId)
      .executeTakeFirst();

    if (portfolioRow) {
      // Perform the delete operation on the base table
      await db
        .deleteFrom("portfolio_card")
        .where("portfolio_unique_id", "=", body.portfolioId)
        .execute();

      // Optionally, delete from the 'portfolio' table if needed
      await db
        .deleteFrom("portfolio")
        .where("unique_id", "=", body.portfolioId)
        .execute();

      return NextResponse.json(
        { error: "Portfolio has been deleted" },
        { status: 200 }
      );
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
