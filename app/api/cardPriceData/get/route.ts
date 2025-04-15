export const dynamicParams = true;
import { NextRequest } from "next/server";
import { db } from "../../../lib/db";
import redis from "../../../lib/redis"; // adjust path to your redis.ts

const convertEditionFoilString = (edition: string, foiling: string) => {
  if (edition === "N") {
    if (foiling === "S") return "Normal";
    if (foiling === "C") return "Cold Foil";
    if (foiling === "R") return "Rainbow Foil";
  } else if (edition === "F" || edition === "A") {
    if (foiling === "S") return "1st Edition Normal";
    if (foiling === "C") return "1st Edition Cold Foil";
    if (foiling === "R") return "1st Edition Rainbow Foil";
  } else if (edition === "U") {
    if (foiling === "S") return "Unlimited Edition Normal";
    if (foiling === "C") return "Unlimited Edition Cold Foil";
    if (foiling === "R") return "Unlimited Edition Rainbow Foil";
  }
  return "Normal";
};

export async function GET(req: NextRequest) {
  const foiling = req.nextUrl.searchParams.get("foiling");
  const productId = req.nextUrl.searchParams.get("productId");
  const edition = req.nextUrl.searchParams.get("edition");
  const dayInterval = Number(req.nextUrl.searchParams.get("dayInterval")) || 7;

  if (!productId) {
    return new Response(JSON.stringify({ message: "Missing productId" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const cacheKey = `card:${productId}-${foiling}-${edition}`;

  try {
    //  Try Redis cache first
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return new Response(cachedData, {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    //  If not cached, fetch from DB
    const tableName =
      dayInterval === 7
        ? "all_printings_with_card_prices_weekly_new"
        : "product_prices";

    const cardPriceQuery = await db
      .selectFrom(tableName)
      .selectAll()
      .where(
        tableName === "all_printings_with_card_prices_weekly_new"
          ? "all_printings_with_card_prices_weekly_new.tcgplayer_product_id"
          : "product_prices.product_id",
        "=",
        productId
      )
      .where(
        `${tableName}.sub_type_name`,
        "ilike",
        `%${convertEditionFoilString(edition as string, foiling as string)}%`
      )
      .where(
        tableName === "all_printings_with_card_prices_weekly_new"
          ? "price_date"
          : "date",
        ">=",
        new Date(Date.now() - dayInterval * 24 * 60 * 60 * 1000).toISOString()
      )
      .execute();

    const formattedPriceData = cardPriceQuery.map((priceObj) => {
      const UTCDate = new Date(
        tableName === "product_prices" && priceObj.date
          ? priceObj.date
          : priceObj.price_date || Date.now()
      );

      const formattedDate = UTCDate.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
      });
      return {
        date: formattedDate,
        low_price: priceObj.low_price,
      };
    });

    const resultPayload = JSON.stringify({ results: formattedPriceData });
    await redis.set(cacheKey, resultPayload, "EX", 10800); // 3 Hour TTL

    return new Response(resultPayload, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        result: { message: "Failed to fetch card pricing data" },
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
