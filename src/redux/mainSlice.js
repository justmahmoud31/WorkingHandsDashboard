import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../constants";

// Fetch main content
export const fetchMainContent = createAsyncThunk(
    "main/fetchMainContent",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/api/main`);
            return response.data.data[0]; // Assuming only one main content exists
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Update main content (title & description)
export const updateMainContent = createAsyncThunk(
    "main/updateMainContent",
    async ({ id, title, description, token }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${API_URL}/api/main/${id}/details`, // Adjusted endpoint
                { title, description },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Update a main image
export const updateMainImage = createAsyncThunk(
    "main/updateMainImage",
    async ({ id, imageId, formData, token }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${API_URL}/api/main/${id}/images/${imageId}`, // Adjusted endpoint
                formData,
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
            );
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const initialState = {
    id: null,
    title: "",
    description: "",
    images: [],
    loading: false,
    error: null,
};

const mainSlice = createSlice({
    name: "main",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch main content
            .addCase(fetchMainContent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMainContent.fulfilled, (state, action) => {
                state.loading = false;
                state.id = action.payload.id;
                state.title = action.payload.title;
                state.description = action.payload.description;
                state.images = action.payload.MainPictures;
            })
            .addCase(fetchMainContent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update main content
            .addCase(updateMainContent.fulfilled, (state, action) => {
                state.title = action.payload.title;
                state.description = action.payload.description;
            })
            .addCase(updateMainContent.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Update main image
            .addCase(updateMainImage.fulfilled, (state, action) => {
                const updatedImage = action.payload;
                state.images = state.images.map((img) =>
                    img.id === updatedImage.id ? updatedImage : img
                );
            })
            .addCase(updateMainImage.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export default mainSlice.reducer;
