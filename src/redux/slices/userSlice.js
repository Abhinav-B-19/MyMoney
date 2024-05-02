import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userId: null,
    firstName: null,
    lastName: null,
    userName: null,
    email: null,
    passWord: null,
  },
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setUserName: (state, action) => {
      state.userName = action.payload;
    },
    setUserFirstName: (state, action) => {
      state.firstName = action.payload;
    },
    setUserLastName: (state, action) => {
      state.lastName = action.payload;
    },
    setUserEmail: (state, action) => {
      state.email = action.payload;
    },
    setUserPassword: (state, action) => {
      state.passWord = action.payload;
    },
  },
});

export const {
  setUserId,
  setUserName,
  setUserFirstName,
  setUserLastName,
  setUserEmail,
  setUserPassword,
} = userSlice.actions;

export default userSlice.reducer;
