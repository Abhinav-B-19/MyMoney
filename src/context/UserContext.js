import React, { useState, useContext } from "react";

const UserContext = React.createContext();

export function useUserContext() {
  return useContext(UserContext);
}

export function UserProvider(props) {
  const [userCountry, setUserCountry] = useState(null);
  const [userCurrency, setUserCurrency] = useState(null);

  const value = {
    userCountry,
    setUserCountry,
    userCurrency,
    setUserCurrency,
  };

  return (
    <UserContext.Provider value={value}>{props.children}</UserContext.Provider>
  );
}
