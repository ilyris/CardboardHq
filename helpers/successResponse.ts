import { NextResponse } from "next/server";

export const successResponse = (data: any) => {
  return NextResponse.json({ results: data }, { status: 200 });
};
