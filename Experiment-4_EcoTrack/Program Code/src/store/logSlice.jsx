import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import logs from "../data/logs.js";

export const fetchLogs = createAsyncThunk(
    "logs/fetchLogs",
    async() => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return logs;
    }
)

const logsSlice = createSlice({
    name : "logs",
    initialState : {
        data : [],
        status : "idle",
        error : null,
    },
    reducers : {},
    extraReducers : (builder) => {
        builder
        .addCase(fetchLogs.pending, (state, action) =>{
            state.status = "loading";
        })
        .addCase(fetchLogs.fulfilled, (state, action) =>{
            state.status = "success";
            state.data = action.payload;
        })
        .addCase(fetchLogs.rejected, (state, action) =>{
            state.status = "failed";
            state.error = action.error.message;
        })
    }
})

export default logsSlice.reducer;