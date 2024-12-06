export const dynamicParams = true;

import fabSetData from "@/app/jsonData/FaBSet.json";
import { CardSet } from "@/typings/FaBSet";
import { NextRequest } from "next/server";
import { AllCardPrintingView, db } from "../../../lib/db";
import { sql } from "kysely";

export interface CardPrintingPriceViewWithPercentage
  extends AllCardPrintingView {
  percentage_change: number;
  prices: { date: string; price: number }[];
}

export async function GET(req: NextRequest) {
  const FaBSetDataJson: CardSet[] = fabSetData as CardSet[];
  const setName = req.nextUrl.searchParams.get("setName");
  const searchQuery = req.nextUrl.searchParams.get("searchQuery");
  const cardId = req.nextUrl.searchParams.get("cardId");
  const sort = req.nextUrl.searchParams.get("sort") as string;
  const edition = req.nextUrl.searchParams.get("edition");
  const page = req.nextUrl.searchParams.get("page");
  const foiling = req.nextUrl.searchParams.get("foiling");

  const pageSize = 25;
  const startIndex = (Number(page) - 1) * pageSize;

  try {
    let allCardsBySetId;

    if (!setName)
      return new Response(JSON.stringify({ error: "Failed to get Set Name" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });

    const setId = FaBSetDataJson.find(
      (set) =>
        set.formatted_name.toUpperCase() ===
        setName?.toUpperCase().replace(/-to-|-of-/gi, "-")
    )?.id;

    if (setId) {
      let totalCountQueryBuilder = db
        .selectFrom("printing_with_card_and_latest_pricing")
        .select(db.fn.count("printing_unique_id").as("count"))
        .where("printing_with_card_and_latest_pricing.set_id", "=", setId)
        .where("printing_with_card_and_latest_pricing.edition", "=", edition);

      if (foiling === "all") {
        totalCountQueryBuilder = totalCountQueryBuilder.where(
          "printing_with_card_and_latest_pricing.foiling",
          "in",
          ["C", "R", "S"]
        );
      } else {
        totalCountQueryBuilder = totalCountQueryBuilder.where(
          "printing_with_card_and_latest_pricing.foiling",
          "=",
          foiling
        );
      }
      let totalCount = await totalCountQueryBuilder.execute();
      let cardsBySetIdQuery = db
        .selectFrom("printing_with_card_and_latest_pricing")
        .selectAll()
        .limit(pageSize)
        .offset(startIndex)
        .where("printing_with_card_and_latest_pricing.set_id", "=", setId)
        .where("printing_with_card_and_latest_pricing.edition", "=", edition)
        .orderBy(
          sql`low_price ${sql.raw(sort)} NULLS LAST`
        );

      if (searchQuery) {
        const searchedCardQuery = cardsBySetIdQuery.where(
          "printing_with_card_and_latest_pricing.card_name",
          "ilike",
          `%${searchQuery}%`
        );

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

      if (cardId) {
        const specificCardIdQuery = db
          .selectFrom("all_printings_with_card_prices_weekly_new")
          .selectAll()
          .where("all_printings_with_card_prices_weekly_new.set_id", "=", setId)
          .where(
            "all_printings_with_card_prices_weekly_new.edition",
            "=",
            edition
          )
          .where(
            "all_printings_with_card_prices_weekly_new.printing_id",
            "ilike",
            `%${cardId}%`
          );
        const specificCardByCardId = await specificCardIdQuery.execute();

        const movements: {
          [key: string]: CardPrintingPriceViewWithPercentage;
        } = {};

        specificCardByCardId.forEach((item) => {
          if (item.low_price === null) return;

          const key = `${item.tcgplayer_product_id}-${item.foiling}-${item.edition}`;
          if (!movements[key]) {
            movements[key] = {
              ...item,
              percentage_change: 0,
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
        return new Response(
          JSON.stringify({
            result: result,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      // filters
      if (foiling === "all") {
        allCardsBySetId =  cardsBySetIdQuery.where(
          "printing_with_card_and_latest_pricing.foiling",
          "in",
          ["C", "R", "S"]
        );
      } else {
        allCardsBySetId =  cardsBySetIdQuery.where(
          "printing_with_card_and_latest_pricing.foiling",
          "=",
          foiling
        );
      }
      if (!allCardsBySetId) {
        return new Response(
          JSON.stringify({ error: "Failed to fetch cards" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      const allCardsBySetIdDto = await allCardsBySetId.execute();
      return new Response(
        JSON.stringify({
          result: allCardsBySetIdDto,
          total: totalCount[0].count,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
