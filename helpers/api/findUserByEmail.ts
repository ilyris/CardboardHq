import { db } from "@/app/lib/db";

export async function findUserByEmail(email: string) {
  const user = await db
    .selectFrom("users")
    .selectAll()
    .where("email", "=", email)
    .executeTakeFirst();

  return user;
}
