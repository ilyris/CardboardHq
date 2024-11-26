import { failureResponse } from "@/helpers/failureResponse";
import { NextRequest } from "next/server";
import { db } from "@/app/lib/db";
import { successResponse } from "@/helpers/successResponse";
import { sql } from "kysely";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;

  // Convert query parameters into an object
  const queryParams: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    queryParams[key] = value.trim();
  });

  const page = Number(queryParams.page || 1); // Default to page 1
  const pageSize = 25; // Page size
  const startIndex = (page - 1) * pageSize;

  try {
    let queryBuilder = db
      .selectFrom("printing_with_card_and_latest_pricing")
      .innerJoin(
        "card",
        "card.unique_id",
        "printing_with_card_and_latest_pricing.card_unique_id"
      )
      .selectAll();

    // Add filters dynamically
    if (queryParams.searchQuery) {
      console.log("Cards by name");
      queryBuilder = queryBuilder.where(
        "printing_with_card_and_latest_pricing.card_name",
        "ilike",
        `%${queryParams.searchQuery}%`
      );
    }

    if (queryParams.artist) {
      queryBuilder = queryBuilder.where(
        sql`printing_with_card_and_latest_pricing.artist_array`,
        "@>",
        sql`ARRAY[${queryParams.artist}]::VARCHAR[]`
      );
    }
    if (queryParams.className) {
      queryBuilder = queryBuilder.where(
        "card.type_text",
        "ilike",
        `%${queryParams.className}%`
      );
    }

    // Add ordering and pagination
    const results = await queryBuilder
      .orderBy(sql`low_price DESC NULLS LAST`)
      .offset(startIndex)
      .limit(pageSize)
      .execute();

    const totalResults = await queryBuilder.execute();

    const paginatedResults = { results, total: totalResults.length };
    return successResponse(paginatedResults);
  } catch (err) {
    return failureResponse("Failed to find cards!");
  }
}

export const dynamicParams = true;
