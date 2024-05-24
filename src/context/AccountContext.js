import React, { useState, useEffect, useContext } from "react";
import { useAuth } from "./AuthContext";
import fetchDataApi from "@/api/fetchDataApi";

const AccountContext = React.createContext();

export function useAccount() {
  return useContext(AccountContext);
}

export function AccountProvider(props) {
  const [contextAccounts, setContextAccounts] = useState([]);
  const { authUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (authUser) {
        try {
          const response = await fetchDataApi("accounts", authUser);
          if (response.status === 200 || response.status === 201) {
            setContextAccounts(response.data);
          } else {
            console.error("Failed to fetch accounts:", response.error);
          }
        } catch (error) {
          console.error("Error fetching accounts:", error);
        }
      }
    };

    fetchData();
  }, [authUser]);

  const value = {
    contextAccounts,
    setContextAccounts,
  };

  return (
    <AccountContext.Provider value={value}>
      {props.children}
    </AccountContext.Provider>
  );
}
