import React, { useState, useEffect, useContext } from "react";
import { useAuth } from "./AuthContext";
import fetchDataApi from "@/api/fetchDataApi";

const CategoryContext = React.createContext();

export function useCategory() {
  return useContext(CategoryContext);
}

export function CategoryProvider(props) {
  const [contextCategories, setContextCategories] = useState([]);
  const { authUser } = useAuth(); // Ensure useAuth provides correct authUser and remove setAuthUser if not used

  useEffect(() => {
    // Fetch contextCategories data on component mount or when authUser changes
    const fetchData = async () => {
      if (authUser) {
        // Ensure authUser is not null or undefined
        try {
          // Perform your API call to fetch contextCategories
          const response = await fetchDataApi("categories", authUser);
          if (response.status === 200 || response.status === 201) {
            setContextCategories(response.data);
          } else {
            console.error("Failed to fetch contextCategories:", response.error);
          }
        } catch (error) {
          console.error("Error fetching contextCategories:", error);
        }
      }
    };

    fetchData();
  }, [authUser]); // Adding authUser as a dependency

  const value = {
    contextCategories,
    setContextCategories,
  };

  return (
    <CategoryContext.Provider value={value}>
      {props.children}
    </CategoryContext.Provider>
  );
}
