import fabSetData from "@/app/jsonData/FaBSet.json";
import { CardSet } from "@/typings/FaBSet";
import { NextRequest } from "next/server";

// Named export for the POST method
export async function GET(req: NextRequest) {
  const FaBSetDataJson: CardSet[] = fabSetData as CardSet[];
  const setName = req.nextUrl.searchParams.get("setName");

  if (!setName) {
    return new Response(JSON.stringify({ error: "Failed to find Set Name" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const filteredFabSet = FaBSetDataJson.find(
    (set) =>
      set.formatted_name.toUpperCase() ===
      setName.toUpperCase().replace(/-to-|-of-/gi, "-")
  );

  if (filteredFabSet) {
    return new Response(JSON.stringify({ result: filteredFabSet }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}
