import NextAuth from "next-auth";
import { config } from "@/helpers/auth";
import { NextApiRequest, NextApiResponse } from "next";

// Named export for the GET method
export async function GET(req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(req, res, config);
}

// Named export for the POST method
export async function POST(req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(req, res, config);
}

// You can also export handlers for other HTTP methods (PUT, DELETE, etc.) if needed.
