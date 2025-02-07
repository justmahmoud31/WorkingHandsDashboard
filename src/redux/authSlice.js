import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { API_URL } from './../../constants';

// Async thunk for login
export const loginUser = createAsyncThunk("auth/loginUser", async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/api/users/login`, userData);
        const { token, user } = response.data;

        // Store token in localStorage
        localStorage.setItem("token", token);

        return { token, user };
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Login failed");
    }
});

// Async thunk for logout
export const logoutUser = createAsyncThunk("auth/logoutUser", async ({ token }, { rejectWithValue }) => {
    try {
        console.log(token);

        await axios.post(`${API_URL}/api/users/logout`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }); // Call the backend logout route

        // Clear token from local storage
        localStorage.removeItem("token");

        return true;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        token: localStorage.getItem("token") || null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = action.payload.user;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                state.token = null;
                state.user = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});


export default authSlice.reducer;
