export const dynamicParams = true;
import { NextRequest } from "next/server";
import { db } from "../../../lib/db";

export async function GET(req: NextRequest) {
  const uniqueId = req.nextUrl.searchParams.get("uniqueId");
  try {
    const cardInformationQuery = await db
      .selectFrom("card")
      .selectAll()
      .where("card.unique_id", "=", uniqueId)
      .execute();

    return new Response(
      JSON.stringify({
        results: cardInformationQuery,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        result: { message: "Failed to fetch card information" },
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
