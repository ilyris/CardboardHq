import fabSetData from "@/app/jsonData/FaBSet.json";
import FabCardData from "@/app/jsonData/card.json";
import getFabSetIdBySetName from "@/helpers/getFabSetIdBySetName";
import replaceHyphenWithWhiteSpace from "@/helpers/replaceHyperWithWhiteSpace";
import { Card, Printing } from "@/typings/FaBCard";
import { CardSet } from "@/typings/FaBSet";
import { NextRequest } from "next/server";

// Named export for the POST method
export async function GET(req: NextRequest) {
  try {
    const FabCardDataJson: Card[] = FabCardData as Card[];
    const FaBSetDataJson: CardSet[] = fabSetData as CardSet[];

    const setName = req.nextUrl.searchParams.get("setName");
    const searchQuery = req.nextUrl.searchParams.get("searchQuery");
    const cardId = req.nextUrl.searchParams.get("cardId");

    if (!setName) {
      return new Response(JSON.stringify({ error: "Failed to fit Set Name" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
    // linear search, need to update this.
    const setFilteredCards = FabCardDataJson.filter((card) =>
      card.printings.find(
        (printing: Printing) =>
          printing.set_id ===
          getFabSetIdBySetName(
            replaceHyphenWithWhiteSpace(setName),
            FaBSetDataJson
          )
      )
    );

    if (!!searchQuery?.length) {
      const searchedCards = setFilteredCards.filter((card) =>
        card.name.toUpperCase().includes(searchQuery.toUpperCase())
      );
      return new Response(JSON.stringify({ result: searchedCards }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!!cardId?.length) {
      const searchedCards = setFilteredCards.find((card) =>
        card.printings.some((j) => j.id === cardId)
      );

      if (searchedCards)
        return new Response(JSON.stringify({ result: searchedCards }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
    }

    // Return JSON response
    return new Response(JSON.stringify({ result: setFilteredCards }), {
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
