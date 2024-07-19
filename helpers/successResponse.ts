export const successResponse = (data: any) => {
  return new Response(
    JSON.stringify({
      results: data,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
};
