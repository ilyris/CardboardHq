import { db } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Adding Portfolio Route
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = await db
      .insertInto("portfolio_card")
      .values({
        ...body,
      })
      .executeTakeFirst();

    if (result) {
      return NextResponse.json({
        message: `Card was added to your portfolio`,
      });
    }
    return NextResponse.json(
      { error: "Failed to add the portfolio" },
      { status: 500 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
