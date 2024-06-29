import axios from 'axios';

// Named export for the POST method
export async function POST(req: Request) {
    try {
        const data = await req.json();
        const { query } = data;

        const url = `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(
            query
          )}&category_ids=2536`;

          const headers = {
            Authorization:
              "Bearer v^1.1#i^1#r^0#f^0#I^3#p^1#t^H4sIAAAAAAAAAOVYbWwURRju9QNoCuWHWk1Bem4RI/X2Zm/3vjbcJUd7pcdH7+wVKE0A53Zn26V7u+fOHOUgmtoIxmgCxkJKMEhQgwETEBElUTQGJRKiRhsSgYgSfwhqREIxxQ+cvZZyrQSQXmIT789l3nnnned55n1nZgd0TSidvaFhw29TbBMLd3SBrkKbjSsDpRNKasqLCitLCkCOg21H18yu4u6iH+ZgmNRSYhPCKUPHyL4mqelYzBoDTNrURQNiFYs6TCIsEkmMhxYtFF0sEFOmQQzJ0Bh7pC7A8DwPJRfn5TkEBdkrU6t+LWazEWA8PsEtKH4APS4/SCQA7cc4jSI6JlAnAcYFXIIDeBzA28zxouAXBS/rAp5Wxr4EmVg1dOrCAiaYhStmx5o5WG8OFWKMTEKDMMFIqD4eDUXqwo3Nc5w5sYJDOsQJJGk8slVryMi+BGppdPNpcNZbjKclCWHMOIODM4wMKoaugbkD+Fmp/dDj9ks8LyHg9nByfqSsN8wkJDfHYVlU2aFkXUWkE5VkbqUoVSOxCklkqNVIQ0Tq7Nbfo2moqYqKzAATnhtaForFmGBdRoN6XEUOCZpywoCmI9ZU5/Ait1tR3ILg8PLIw3MeZWiiwWhDMo+aqdbQZdUSDdsbDTIXUdRotDZ8jjbUKapHzZBCLES5fu5hDV2t1qIOrmKatOvWuqIkFcKebd56BYZHE2KqiTRBwxFGd2QlCjAwlVJlZnRnNheH0mcNDjDthKREp7Ozs5Pt5FnDbHO6AOCcLYsWxqV2lIQM9bVqfdBfvfUAh5qlIiE6EqsiyaQoljU0VykAvY0JCn4fcPuGdB8JKzja+g9DDmfnyIrIV4X4ZMBLgG4zMoSKi+fzUSHBoSR1WjhQAmYcSWh2IJLSoETzleZZOolMVRZ5N53SpyCH7PErDsGvKI6EW/Y4OAUhgFAiIfl9/6dCud1UjyPJRCQvuZ63PPc1hwFOr4omI4pcF6lzJeJrI5lFibAeh7GG9lB46bxMR62u18DkssDtVsMNyddqKlWmmc6fDwGsWs+fCA0GJkgeE724ZKRQzNBUKTO+Fpg35Rg0SSaONI0axkQylEpF8rNX543ev9wm7ox3/s6o/+h8uiErbKXs+GJljcc0AEyprHUCsZKRdFq1bkB6/bDMK7Oox8RbpTfXccWakhxkq8qDV042S5fFqyXWRNhIm/S2zUatG1iz0YF0ep4R09A0ZC7hxlzPyWSawISGxlth5yHBVTjODlvOy3m9Hh/n846Jl5Q9SleOty0pH1tx8bw7vFY7R37kBwuyP67b9hHoth0utNnAHPAgVw0emFC0uLhociVWCWJVqLBYbdPpt6uJ2A6USUHVLLyr4OLOzQ21leHoltnrmjNfbDtaMDnnjWHHcnDf8CtDaRFXlvPkAKZf7ynhpt47xSUAD/ByvOAXvK2g+npvMVdRfPe+5wXw7umjkVNTy1ZffLvV9tr6C0fAlGEnm62koLjbViB9EDhZ049eSqI9FdM+EarmPzxQMr3+WGRm38/fbD2zq/y9khZ39aZDlaf2ftiza8GfbzRtunKuZ0FZ2Fbz5YoT+7qf2Hrp3B8D87+bu67g98rpl46gxZTGiy31V9vWffzQk6HPSHnf8vu7wuefbq96boa9Ktr7/uMzAiC6dgDWT8O/9PYGKsixzpbd22as3/zr19sDrwyUb9q4u/fgnr+qzpqpk9MaHjk+0VN0+eILBz2Z08uqQsvV2M7eT/uNXc9cbvl8RfXevntqJjWdqTn52I+valuuPvXVlbdef7N/Y6xn56wFW86+89Oh7ZN6evv7Dnx/4dmBlhM8e+X84d7GiqrS/QeO7+eXznqZ2fvt4Fr+Df07ypD9EQAA", // Replace with your actual OAuth token
            "Content-Type": "application/json",
            "X-EBAY-C-MARKETPLACE-ID": "EBAY_US",
            "X-EBAY-C-ENDUSERCTX": "affiliateCampaignId=<ePNCampaignId>,affiliateReferenceId=<referenceId>"
          };

          const response = await axios.get(url, { headers });
        // Return JSON response
        return new Response(JSON.stringify({ result: response.data.itemSummaries }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Failed to fetch response from Ebay" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}