import fabSetData from "@/app/jsonData/FaBSet.json";
import { CardSet } from "@/typings/FaBSet";
import { NextRequest } from "next/server";
import { db } from "../../../lib/db";
import { sql } from "kysely";

// Named export for the POST method
export async function GET(req: NextRequest) {
  const FaBSetDataJson: CardSet[] = fabSetData as CardSet[];

  try {
    const setName = req.nextUrl.searchParams.get("setName");
    const searchQuery = req.nextUrl.searchParams.get("searchQuery");
    const cardId = req.nextUrl.searchParams.get("cardId");
    const sort = req.nextUrl.searchParams.get("sort");
    const edition = req.nextUrl.searchParams.get("edition");

    if (!setName)
      return new Response(JSON.stringify({ error: "Failed to fit Set Name" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });

    const setId = FaBSetDataJson.find(
      (set) => set.formatted_name.toUpperCase() === setName?.toUpperCase()
    )?.id;

    if (setId) {
      const cardsBySetIdQuery = db
        .selectFrom("printing_with_card_and_latest_pricing")
        .selectAll()
        .where("printing_with_card_and_latest_pricing.set_id", "=", setId)
        .where("printing_with_card_and_latest_pricing.edition", "=", edition);

      // searched cards
      if (!!searchQuery?.length) {
        const searchedCardQuery = searchQuery
          ? cardsBySetIdQuery.where(
              "printing_with_card_and_latest_pricing.card_name",
              "ilike",
              `%${searchQuery}%`
            )
          : cardsBySetIdQuery;

        const searchedCards = await searchedCardQuery.execute();

        return new Response(
          JSON.stringify({
            result: searchedCards,
            total: searchedCards.length,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      if (!!cardId?.length) {
        const specificCardIdQuery = cardId.length
          ? cardsBySetIdQuery.where(
              "printing_with_card_and_latest_pricing.printing_id",
              "ilike",
              `%${cardId}%`
            )
          : cardsBySetIdQuery;

        const specificCardByCardId = await specificCardIdQuery.execute();

        if (specificCardByCardId)
          return new Response(
            JSON.stringify({
              result: specificCardByCardId,
              total: specificCardByCardId.length,
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            }
          );
      }

      if (!!sort?.length) {
        let orderQuery = cardsBySetIdQuery.orderBy(
          sql`low_price DESC NULLS LAST`
        );

        if (sort === "low to high") {
          orderQuery = cardsBySetIdQuery.orderBy(sql`low_price ASC NULLS LAST`);
        }
        const allCardsBySetId = await orderQuery.execute();

        // Return JSON response
        return new Response(
          JSON.stringify({
            result: allCardsBySetId,
            total: allCardsBySetId.length,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
