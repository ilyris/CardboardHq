import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const data = await req.json();

  // return new Response(JSON.stringify({ error: "Failed to fetch response from Ebay" })
  const { username, password } = data;
  const saltRounds = 10;

  try {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        new Response(JSON.stringify({ error: "Internal server error" }), {
          status: 500,
        });
      } else {
        console.log("Username:", username);
        console.log("Hash:", hash);
        new Response(JSON.stringify({ message: "Account created" }), {
          status: 200,
        });
      }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Account couldn't be created" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
