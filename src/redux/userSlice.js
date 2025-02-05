import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../constants";

export const getUsersNumber = createAsyncThunk(
  "users/getUsersCount",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/users/getuserscount`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; // ✅ Returns { Message: "Success", usersCount: 3 }
    } catch (err) {
      return rejectWithValue(err.message); // ✅ Fixes rejectWithValue syntax
    }
  }
);
const initialState = {
    usersCount: 0,
    loading: false,
    error: null,
  };
  
  const usersSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(getUsersNumber.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(getUsersNumber.fulfilled, (state, action) => {
          state.loading = false;
          state.usersCount = action.payload.usersCount; // ✅ Extract usersCount
        })
        .addCase(getUsersNumber.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    },
  });
  
  export default usersSlice.reducer;