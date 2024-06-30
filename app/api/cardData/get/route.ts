import fabSetData from "@/app/jsonData/FaBSet.json";
import newFabCardData from "@/app/jsonData/newFabCardData.json";
import { Card } from "@/typings/FaBCard";
import { CardSet } from "@/typings/FaBSet";
import { NextRequest } from "next/server";

// Named export for the POST method
export async function GET(req: NextRequest) {
  try {
    const page = req.nextUrl.searchParams.get("page");
    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(req.nextUrl.searchParams.get("pageSize")) || 10;

    const newFabCardDataJson: Card[] = newFabCardData as Card[];
    const FaBSetDataJson: CardSet[] = fabSetData as CardSet[];

    const setName = req.nextUrl.searchParams.get("setName");
    const searchQuery = req.nextUrl.searchParams.get("searchQuery");
    const cardId = req.nextUrl.searchParams.get("cardId");

    const setId = FaBSetDataJson.find(
      (set) => set.formatted_name.toUpperCase() === setName?.toUpperCase()
    )?.id;

    if (!setName) {
      return new Response(JSON.stringify({ error: "Failed to fit Set Name" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // our individual card data
    const cardsBySetId = newFabCardDataJson[setId];
    const paginatedData = cardsBySetId.slice(
      (pageNumber - 1) * pageSize,
      pageNumber * pageSize
    );

    if (!!searchQuery?.length) {
      const searchedCards = cardsBySetId.filter((card: Card) =>
        card.name.toUpperCase().includes(searchQuery.toUpperCase())
      );
      return new Response(JSON.stringify({ result: searchedCards }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!!cardId?.length) {
      const searchedCards = paginatedData.find((card: Card) =>
        card.printings.some((j) => j.id === cardId)
      );

      if (searchedCards)
        return new Response(JSON.stringify({ result: searchedCards }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
    }

    // Return JSON response
    return new Response(JSON.stringify({ result: paginatedData }), {
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
