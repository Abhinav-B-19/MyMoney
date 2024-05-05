import { BASE_URL } from "@/constants/constants";

const deleteTransData = async (userId, transactionId) => {
  console.log(userId, transactionId);
  try {
    // Construct the URL dynamically
    // const userUrl = `${BASE_URL}/transactions?userId=${userId}`;
    // const userDataRes = await fetch(userUrl);
    // const userTransactions = await userDataRes.json()
    // const filteredTransaction = userTransactions.filter((transaction) => transaction.id === transactionId)
    // if(filteredTransaction.length === 0) {
    //   console.log('No transaction found');
    //   return
    // } else
    const deleteUrl = `${BASE_URL}/transactions/${transactionId}`;
    console.log(deleteUrl);
    const deleteResponse = await fetch(deleteUrl, {
      method: "DELETE",
    });

    console.log(deleteResponse.ok);

    if (deleteResponse.ok) {
      console.log("Task deleted successfully.");
      return { status: 200 };
    } else {
      console.error("Failed to delete task:", deleteResponse.statusText);
      return null;
    }

    // // Prepare the request body with userId and transactionId
    // const requestBody = JSON.stringify({ userId, transactionId });

    // // Make the DELETE request
    // const deleteRes = await fetch(deleteUrl, {
    //   method: "DELETE",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: requestBody,
    // });

    // // Check if the request is successful
    // if (!deleteRes.ok) {
    //   const errorMessage = await deleteRes.text();
    //   throw new Error(
    //     `Failed to delete transaction: ${deleteRes.status} - ${errorMessage}`
    //   );
    // }

    // // Parse response body as JSON
    // const response = await deleteRes.json();
    // // Return the response with status 200
    // return { status: 200, data: deleteResponse.ok };
  } catch (error) {
    console.error("Error deleting transaction:", error);
    // Return error status and message
    return { status: -1, error: error.message };
  }
};

export default deleteTransData;
