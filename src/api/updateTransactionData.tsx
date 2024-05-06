import { BASE_URL } from "@/constants/constants";

const updateTransactionData = async (transactionId, updatedData) => {
  try {
    // Delay execution by 6 seconds (optional)
    await new Promise((resolve) => setTimeout(resolve, 6000));

    // Construct the URL dynamically
    const transactionUrl = `${BASE_URL}/transactions/${transactionId}`;
    console.log(transactionUrl);

    // Construct the request payload
    const requestOptions = {
      method: "PUT", // Use PUT method for updating data
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData), // Convert updatedData to JSON format
    };

    // Send the PUT request to update transaction data
    const response = await fetch(transactionUrl, requestOptions);

    // Check if the request is successful
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(
        `Failed to update transaction: ${response.status} - ${errorMessage}`
      );
    }

    // Parse response body as JSON
    const responseData = await response.json();
    // Return the updated transaction data with status 200
    return { status: 200, data: responseData };
  } catch (error) {
    console.error("Error updating transaction:", error);
    // Return error status and message
    return { status: -1, error: error.message };
  }
};

export default updateTransactionData;
