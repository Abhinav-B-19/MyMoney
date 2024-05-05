import { BASE_URL } from "@/constants/constants";

const postNewData = async (newData) => {
  try {
    // Construct the URL for posting data
    const postUrl = `${BASE_URL}/transactions`;

    // Make a POST request to the endpoint
    const response = await fetch(postUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Set the content type to JSON
      },
      body: JSON.stringify(newData), // Convert the data to JSON format
    });

    // Check if the request is successful
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(
        `Failed to post data: ${response.status} - ${errorMessage}`
      );
    }

    // Parse response body as JSON if needed
    // const responseData = await response.json();

    // Return success status
    return { status: 200, message: "Data posted successfully" };
  } catch (error) {
    console.error("Error posting data:", error);
    // Return error status and message
    return { status: -1, error: error.message };
  }
};

export default postNewData;
