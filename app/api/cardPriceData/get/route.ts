import { NextRequest } from "next/server";
import { db } from "../../../lib/db";

export async function GET(req: NextRequest) {
  try {
    const foiling = req.nextUrl.searchParams.get("foiling");
    const productId = req.nextUrl.searchParams.get("productId");
    const edition = req.nextUrl.searchParams.get("edition");
    console.log({ foiling });

    let editionString = "";
    switch (edition) {
      case "F":
        editionString = "1st Edition";
        break;
      case "A":
        editionString = "1st Edition";
        break;
      case "U":
        editionString = "Unlimited Edition";
      case "N":
        editionString = "Unlimited Edition";
        break;
      default:
        break;
    }

    const cardPriceQuery = await db
      .selectFrom("product_prices")
      .selectAll()
      .where("product_prices.product_id", "=", Number(productId))
      .where(
        "product_prices.sub_type_name",
        "ilike",
        `%${editionString} ${foiling}%`
      )
      .execute();

    // need to massage the data to the object structure we need.
    const formattedPriceData = cardPriceQuery.map((priceObj) => {
      const UTCDate = new Date(priceObj.date);
      const month = UTCDate.getMonth() + 1;
      const day = UTCDate.getDate();
      const formattedDate = `${month}/${day}`;
      return {
        date: formattedDate,
        low_price: priceObj.low_price,
      };
    });

    return new Response(
      JSON.stringify({
        results: formattedPriceData,
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
