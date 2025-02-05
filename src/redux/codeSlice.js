import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../constants";

// Fetch all codes
export const fetchCodes = createAsyncThunk(
    "codes/fetchCodes",
    async ({ token }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/api/code`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data.allcodes; // Expected: Array of codes
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// Delete a code
export const deleteCode = createAsyncThunk(
    "codes/deleteCode",
    async ({ token, codeId }, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/api/code/deletecode/${codeId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return codeId; // Return deleted code's ID for state update
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const initialState = {
    codes: [],
    loading: false,
    error: null,
};

const codeSlice = createSlice({
    name: "codes",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCodes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCodes.fulfilled, (state, action) => {
                state.loading = false;
                state.codes = action.payload;
            })
            .addCase(fetchCodes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteCode.fulfilled, (state, action) => {
                state.codes = state.codes.filter((code) => code.id !== action.payload);
            })
            .addCase(deleteCode.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export default codeSlice.reducer;
