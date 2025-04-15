export const dynamicParams = true;

import { NextRequest } from "next/server";
import { db } from "../../../lib/db";
import { withRedisCache } from "../../../lib/withRedisCache";

export async function GET(req: NextRequest) {
  const uniqueId = req.nextUrl.searchParams.get("uniqueId");

  if (!uniqueId) {
    return new Response(JSON.stringify({ message: "Missing uniqueId" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const cacheKey = `card:${uniqueId}`;

  try {
    const result = await withRedisCache(cacheKey, 86400, async () => {
      const cardInformationQuery = await db
        .selectFrom("card")
        .selectAll()
        .where("card.unique_id", "=", uniqueId)
        .execute();

      return { results: cardInformationQuery };
    });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
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
