 import { Platform } from "react-native"; // Import Platform from react-native

// Define BASE_URL based on the platform
// export const BASE_URL = Platform.select({
//   ios: "http://localhost:3000", // For iOS, assuming your backend server is running locally on port 3000
//   android: "http://10.0.2.2:3000", // For Android emulator, use 10.0.2.2 to refer to localhost
//   default: "http://localhost:3000", // Default URL for other platforms (not recommended for production)
// });

export const BASE_URL = 'https://mymoneybackend.onrender.com'