import { BASE_URL } from "@/constants/constants";

const fetchDataApi = async (endPoint: string, userId: string) => {
  try {
    const userUrl = `${BASE_URL}/${endPoint}?userId=${userId}`;
    console.log(userUrl);

    // Promise that resolves after 30 seconds
    const timeoutPromise: Promise<{ timeout: boolean }> = new Promise(
      (resolve) => setTimeout(() => resolve({ timeout: true }), 30000)
    );

    const userDataRes = await fetch(userUrl);

    // Use Promise.race to wait for either the fetch or the timeout
    const result = await Promise.race([userDataRes, timeoutPromise]);

    if ("timeout" in result && result.timeout) {
      throw new Error("Request timed out");
    }

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

export default fetchDataApi;
