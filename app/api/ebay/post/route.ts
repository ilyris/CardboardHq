import axios from "axios";
import { NextRequest } from "next/server";

// Named export for the POST method
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { query } = data;

    const url = `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(
      query
    )}&category_ids=2536`;

    const headers = {
      Authorization: "Bearer", // Replace with your actual OAuth token
      "Content-Type": "application/json",
      "X-EBAY-C-MARKETPLACE-ID": "EBAY_US",
      "X-EBAY-C-ENDUSERCTX":
        "affiliateCampaignId=<ePNCampaignId>,affiliateReferenceId=<referenceId>",
    };

    const response = await axios.get(url, { headers });
    // Return JSON response
    return new Response(
      JSON.stringify({ result: response.data.itemSummaries }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch response from Ebay" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
