import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import userReducer from './userSlice';
import requestReducer from './requestsSlice';
import editRequest from './editRequests';
import mainSlice from './mainSlice';
import codeSlice from './codeSlice';
const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        request: requestReducer,
        edits: editRequest,
        main: mainSlice,
        code: codeSlice,
    },
});

export default store;
