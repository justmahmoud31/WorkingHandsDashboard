import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../constants";

// Fetch the count of requests
export const getRequestsNumber = createAsyncThunk(
    "requests/getRequestsCount",
    async (token, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/api/requests/requestcount`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data; // Expected { Message: "Success", count: 3 }
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// Fetch all requests
export const getRequests = createAsyncThunk(
    "requests/getRequests",
    async ({ token, page, limit }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/api/requests?page=${page}&limit=${limit}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data.requests; // Expected response: { requests: [], totalPages, currentPage }
        } catch (err) {
            console.log(err);

            return rejectWithValue(err.message);
        }
    }
);
// Accept user request
export const acceptRequest = createAsyncThunk(
    "requests/acceptRequest",
    async ({ token, requestId }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_URL}/api/requests/accept/${requestId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return { requestId, message: response.data.message };
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// Reject user request
export const rejectRequest = createAsyncThunk(
    "requests/rejectRequest",
    async ({ token, requestId }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_URL}/api/requests/reject/${requestId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return { requestId, message: response.data.message };
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);
const initialState = {
    requestsCount: 0,
    requestsList: [],
    totalPages: 1,
    currentPage: 1,
    loading: false,
    error: null,
    successMessage: null,
};

const requestsSlice = createSlice({
    name: "requests",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getRequestsNumber.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getRequestsNumber.fulfilled, (state, action) => {
                state.loading = false;
                state.requestsCount = action.payload.count;
            })
            .addCase(getRequestsNumber.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getRequests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.requestsList = action.payload; // Save requests data
            })
            .addCase(getRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Accept Request
            .addCase(acceptRequest.fulfilled, (state, action) => {
                state.requestsList = state.requestsList.filter((req) => req.id !== action.payload.requestId);
                state.successMessage = action.payload.message;
            })
            .addCase(acceptRequest.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Reject Request
            .addCase(rejectRequest.fulfilled, (state, action) => {
                state.requestsList = state.requestsList.filter((req) => req.id !== action.payload.requestId);
                state.successMessage = action.payload.message;
            })
            .addCase(rejectRequest.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});
export const { setPage } = requestsSlice.actions;
export default requestsSlice.reducer;
