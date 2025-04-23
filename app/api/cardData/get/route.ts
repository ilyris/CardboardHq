export const dynamicParams = true;

import fabSetData from "@/app/jsonData/FaBSet.json";
import { CardSet } from "@/typings/FaBSet";
import { NextRequest } from "next/server";
import { AllCardPrintingView, db } from "../../../lib/db";
import { sql } from "kysely";
import redis from "../../../lib/redis";
import { withRedisCache } from "../../../lib/withRedisCache";

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
  const rarity = req.nextUrl.searchParams.get("rarity");

  const pageSize = 25;
  const startIndex = (Number(page) - 1) * pageSize;

  const cacheKey = [
    "setCards",
    setName,
    edition,
    page,
    sort,
    foiling,
    searchQuery,
    cardId,
    rarity,
  ]
    .filter(Boolean)
    .join(":");

  try {
    const responsePayload = await withRedisCache(cacheKey, 10800, async () => {
      if (!setName) throw new Error("Missing set name");

      const setId = FaBSetDataJson.find(
        (set) =>
          set.formatted_name.toUpperCase() ===
          setName?.toUpperCase().replace(/-to-|-of-/gi, "-")
      )?.id;

      if (!setId) throw new Error("Set ID not found");

      let totalCountQueryBuilder = db
        .selectFrom("printing_with_card_and_latest_pricing")
        .select(db.fn.count("printing_unique_id").as("count"))
        .where("printing_with_card_and_latest_pricing.set_id", "=", setId)
        .where("printing_with_card_and_latest_pricing.set_id", "=", rarity)
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

      const totalCount = await totalCountQueryBuilder.execute();

      let cardsBySetIdQuery = db
        .selectFrom("printing_with_card_and_latest_pricing")
        .selectAll()
        .limit(pageSize)
        .offset(startIndex)
        .where("printing_with_card_and_latest_pricing.set_id", "=", setId)
        .where("printing_with_card_and_latest_pricing.edition", "=", edition);

      // Apply rarity filter if it's not "all"
      if (typeof rarity === "string" && rarity.toLowerCase() !== "all") {
        cardsBySetIdQuery = cardsBySetIdQuery.where(
          "printing_with_card_and_latest_pricing.rarity",
          "=",
          rarity
        );
      }

      cardsBySetIdQuery = cardsBySetIdQuery.orderBy(
        sql`low_price ${sql.raw(sort)} NULLS LAST`
      );

      if (searchQuery) {
        const searchedCards = await cardsBySetIdQuery
          .where(
            "printing_with_card_and_latest_pricing.card_name",
            "ilike",
            `%${searchQuery}%`
          )
          .execute();

        return {
          result: searchedCards,
          total: searchedCards.length,
        };
      }

      if (cardId) {
        const specificCardByCardId = await db
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
          )
          .execute();

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
          const percentage_change = oldPrice
            ? ((newPrice - oldPrice) / oldPrice) * 100
            : 0;

          return {
            ...item,
            percentage_change,
          };
        });

        return { result };
      }

      const filteredQuery =
        foiling === "all"
          ? cardsBySetIdQuery.where(
              "printing_with_card_and_latest_pricing.foiling",
              "in",
              ["C", "R", "S"]
            )
          : cardsBySetIdQuery.where(
              "printing_with_card_and_latest_pricing.foiling",
              "=",
              foiling
            );

      const allCardsBySetIdDto = await filteredQuery.execute();

      return {
        result: allCardsBySetIdDto,
        total: totalCount[0].count,
      };
    });

    return new Response(JSON.stringify(responsePayload), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
