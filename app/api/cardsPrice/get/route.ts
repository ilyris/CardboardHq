export const dynamicParams = true;

import { NextRequest } from "next/server";
import { AllCardPrintingView, db } from "../../../lib/db";

interface AllCardPrintingViewWithPricePercentage extends AllCardPrintingView {
  prices: { date: string; price: number }[];
}

const fetchProductPrices = async () => {
  try {
    // Fetch data from the view
    const data = await db
      .selectFrom("all_printings_with_card_prices_weekly")
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
      if (!newPrice || !oldPrice) {
        return {
          ...item,
          percentage_change: 0,
        };
      }
      const percentage_change = ((newPrice - oldPrice) / oldPrice) * 100;
      return {
        ...item,
        percentage_change,
      };
    });

    result.sort((a, b) => b.percentage_change - a.percentage_change);

    // Return the top 5 results
    const top5Results = result.slice(3, 8);

    return top5Results;
  } catch (error) {
    console.error("Error fetching product prices:", error);
  }
};

export async function GET(req: NextRequest) {
  try {
    const data = await fetchProductPrices();
    return new Response(
      JSON.stringify({
        results: data,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
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
