import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../constants";

export const getEditRequestsNumber = createAsyncThunk(
    "editrequests/getEditRequestsNumber", // ✅ Corrected action type
    async (token, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/api/edits/editrequestnumber`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data; // ✅ API response { Message: "Success", usersCount: 3 }
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);
export const getEditRequests = createAsyncThunk(
    "editRequests/getEditRequests",
    async ({ token, page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/api/edits`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { page, limit },
            });
            return response.data; // { message: "Success", requests: [], totalPages: X, currentPage: Y }
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// 🔹 Accept an edit request
export const acceptEditRequest = createAsyncThunk(
    "editRequests/acceptEditRequest",
    async ({ token, requestId }, { rejectWithValue }) => {
        try {
            

            await axios.put(`${API_URL}/api/edits/accept/${requestId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return requestId; // Return the accepted request ID
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// 🔹 Reject an edit request
export const rejectEditRequest = createAsyncThunk(
    "editRequests/rejectEditRequest",
    async ({ token, requestId }, { rejectWithValue }) => {
        try {
            console.log("Token From Reject", token);
            await axios.put(`${API_URL}/api/edits/reject/${requestId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return requestId; // Return the rejected request ID
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);
const initialState = {
    editRequestsCount: 0, // ✅ Fixed property name
    editRequestsList: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1, loading: false,
    error: null,
};

const editRequestsSlice = createSlice({
    name: "editrequests",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getEditRequestsNumber.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getEditRequestsNumber.fulfilled, (state, action) => {
                state.loading = false;
                state.editRequestsCount = action.payload.count; // ✅ Corrected assignment
            })
            .addCase(getEditRequestsNumber.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getEditRequests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getEditRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.editRequestsList = action.payload.requests;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(getEditRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(acceptEditRequest.fulfilled, (state, action) => {
                state.editRequestsList = state.editRequestsList.filter(
                    (request) => request.id !== action.payload
                );
            })
            .addCase(rejectEditRequest.fulfilled, (state, action) => {
                state.editRequestsList = state.editRequestsList.filter(
                    (request) => request.id !== action.payload
                );
            });
    },
});
export const { setEditPage } = editRequestsSlice.actions;
export default editRequestsSlice.reducer;
