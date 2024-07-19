import { NextRequest } from "next/server";
import { db } from "../../../lib/db";

const convertEditionFoilString = (edition: string, foiling: string) => {
  if (edition === "N") {
    if (foiling === "S") return "Normal";
    if (foiling === "C") return "Cold Foil";
    if (foiling === "R") return "Rainbow Foil";
  }

  if (edition === "F" || edition === "A") {
    if (foiling === "S") return "1st Edition Normal";
    if (foiling === "C") return "1st Edition Cold Foil";
    if (foiling === "R") return "1st Edition Rainbow Foil";
  }

  if (edition === "U") {
    if (foiling === "S") return "Unlimited Edition Normal";
    if (foiling === "C") return "Unlimited Edition Cold Foil";
    if (foiling === "R") return "Unlimited Edition Rainbow Foil";
  }
  return "Normal";
};

export async function GET(req: NextRequest) {
  try {
    const foiling = req.nextUrl.searchParams.get("foiling");
    const productId = req.nextUrl.searchParams.get("productId");
    const edition = req.nextUrl.searchParams.get("edition");

    const cardPriceQuery = await db
      .selectFrom("product_prices")
      .selectAll()
      .where("product_prices.product_id", "=", Number(productId))
      .where(
        "product_prices.sub_type_name",
        "ilike",
        `%${convertEditionFoilString(edition as string, foiling as string)}%`
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
export const config = {
  api: {
    bodyParser: false, // Adjust this according to your needs
    externalResolver: true,
  },
};
