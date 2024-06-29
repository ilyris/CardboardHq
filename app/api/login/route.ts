import bcrypt from "bcryptjs";

// Simulating a database user record, replace with your actual database logic
const users = [
  {
    id: "1",
    username: "exampleuser",
    password: "$2a$10$examplebcryptsaltandhashedpw", // This is a bcrypt hashed password
  },
  {
    id: "2",
    username: "dylan.sieren01@gmail.com",
    password: "123123123", // This is a bcrypt hashed password
  },
];

export async function POST(req: Request) {
  const data = await req.json();

  // return new Response(JSON.stringify({ error: "Failed to fetch response from Ebay" })
  const { username, password } = data;
  try {
    // Lookup user in the database
    const user = users.find((user) => user.username === username);

    if (!user)
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });

    // Compare provided password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(bcrypt.compare(password, user.password));
    console.log(password);
    console.log(isMatch);
    if (!isMatch) {
      return new Response(JSON.stringify({ message: "invalid credentials" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Assuming the user is authenticated successfully
    return new Response(
      JSON.stringify({ message: "Login successful", userId: user.id }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
