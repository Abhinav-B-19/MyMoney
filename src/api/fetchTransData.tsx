import { BASE_URL } from "@/constants/constants";

const fetchTransData = async (userId) => {
  try {
    // Delay execution by 6 seconds
    // await new Promise((resolve) => setTimeout(resolve, 4000));

    // Construct the URL dynamically
    const userUrl = `${BASE_URL}/transactions?userId=${userId}`;
    console.log(userUrl);
    // Fetch user data from the endpoint
    const userDataRes = await fetch(userUrl);

    // Check if the request is successful
    if (!userDataRes.ok) {
      const errorMessage = await userDataRes.text();
      throw new Error(
        `Failed to fetch transactions: ${userDataRes.status} - ${errorMessage}`
      );
    }

    // Parse response body as JSON
    const userData = await userDataRes.json();
    // Return the user data with status 200
    return { status: 200, data: userData };
  } catch (error) {
    console.error("Error fetching transactions:", error);
    // Return error status and message
    return { status: -1, error: error.message };
  }
};

export default fetchTransData;
