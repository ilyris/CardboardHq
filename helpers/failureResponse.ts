export const failureResponse = (message?: string) => {
  return new Response(
    JSON.stringify({
      result: { message: message ?? "Failed to fetch card pricing data" },
    }),
    {
      status: 500,
      headers: { "Content-Type": "application/json" },
    }
  );
};
