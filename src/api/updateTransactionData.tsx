import { BASE_URL } from "@/constants/constants";

const updateTransactionData = async (endPoint, transactionId, updatedData) => {
  try {
    const transactionUrl = `${BASE_URL}/${endPoint}/${transactionId}`;
    console.log(transactionUrl);

    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    };

    const response = await fetch(transactionUrl, requestOptions);

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(
        `Failed to update transaction: ${response.status} - ${errorMessage}`
      );
    }

    const responseData = await response.json();
    return { status: 200, data: responseData };
  } catch (error) {
    console.error("Error updating transaction:", error);
    return { status: -1, error: error.message };
  }
};

export default updateTransactionData;
