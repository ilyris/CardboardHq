export const dynamicParams = true;
import { NextRequest } from "next/server";
import { db } from "../../../lib/db";
import redis from "../../../lib/redis"; // adjust path to your redis.ts

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
    //  Try Redis cache first
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return new Response(cachedData, {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    //  If not cached, fetch from DB
    const cardInformationQuery = await db
      .selectFrom("card")
      .selectAll()
      .where("card.unique_id", "=", uniqueId)
      .execute();

    const responseData = JSON.stringify({ results: cardInformationQuery });

    //  Store in Redis for future
    await redis.set(cacheKey, responseData, "EX", 86400); // 1 day TTL

    return new Response(responseData, {
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
