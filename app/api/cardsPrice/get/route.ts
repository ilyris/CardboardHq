export const dynamicParams = true;

import { NextRequest } from "next/server";
import { AllCardPrintingView, db } from "../../../lib/db";
import redis from "../../../lib/redis";

interface AllCardPrintingViewWithPricePercentage extends AllCardPrintingView {
  prices: { date: string; price: number }[];
  percentage_change?: number;
}

const fetchProductPrices = async () => {
  try {
    // Fetch data from the view
    const data = await db
      .selectFrom("all_high_rarity_printings_with_card_prices_weekly")
      .selectAll()
      .where("low_price", ">", 1.5)
      .execute();

    // Process data to calculate percentage changes
    const movements: {
      [key: string]: AllCardPrintingViewWithPricePercentage;
    } = {};

    data.forEach((item) => {
      if (item.low_price === null) return;

      const key = `${item.tcgplayer_product_id}-${item.foiling}-${item.edition}`;
      if (!movements[key]) {
        movements[key] = {
          ...item,
          prices: [],
        };
      }
      movements[key].prices.push({
        date: item.price_date,
        price: item.low_price,
      });
    });

    const result = Object.values(movements).map((item) => {
      item.prices.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      const oldPrice = item.prices[0].price;
      const newPrice = item.prices[item.prices.length - 1].price;
      const percentage_change = oldPrice
        ? ((newPrice - oldPrice) / oldPrice) * 100
        : 0;

      return {
        ...item,
        percentage_change,
      };
    });

    result.sort((a, b) => b.percentage_change! - a.percentage_change!);

    // Return the top 5 results
    return result.slice(3, 8);
  } catch (error) {
    console.error("Error fetching product prices:", error);
    return [];
  }
};

export async function GET(req: NextRequest) {
  const cacheKey = "highRarityPriceMovements:top5";

  try {
    let resultPayload: string | undefined;

    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        resultPayload = cached;
      }
    } catch (err) {
      console.error("[REDIS ERROR - get]", err);
    }

    if (!resultPayload) {
      const data = await fetchProductPrices();
      resultPayload = JSON.stringify({ results: data });

      try {
        await redis.set(cacheKey, resultPayload, "EX", 10800); // 3 Hour TTL
      } catch (err) {
        console.error("[REDIS ERROR - set]", err);
      }
    }

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
