import { failureResponse } from "@/helpers/failureResponse";
import { NextRequest } from "next/server";
import { db } from "@/app/lib/db";
import { successResponse } from "@/helpers/successResponse";

export async function GET(req: NextRequest) {
  try {
    const searchQuery = req.nextUrl.searchParams.get("searchQuery");
    if (searchQuery) {
      const searchedDbQuery = await db
        .selectFrom("printing_with_card_and_latest_pricing")
        .selectAll()
        .where(
          "printing_with_card_and_latest_pricing.card_name",
          "ilike",
          `%${searchQuery}%`
        )
        .execute();
      return successResponse(searchedDbQuery);
    }
    failureResponse("Failued to find searched card");
  } catch (err) {
    console.log(err);
    failureResponse();
  }
}

export const dynamicParams = true;
