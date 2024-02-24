import { AnyAction, createAsyncThunk, createSlice, } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import { getAllData, getAllDataInfo, getAllInfo, searchData } from "../../services";

export interface IInitialState {
    isLoading: boolean,
    isSuccess: boolean,
    data: [],
    isError: [],
    isAllDataInfoLoading: boolean,
    isAllDataInfoSuccess: boolean,
    AllDataInfo: [],
    AllDataError: [],
    isAllInfoLoading: boolean,
    isAllInfoSuccess: boolean,
    allInfoData: [],
    allInfoError: [],
    isSearchDaraLoading: boolean,
    isSearchDataSuccess: boolean,
    searchData: [],
    searchDataError: []
}

const initialState:IInitialState = {
    isLoading: false,
    isSuccess: false,
    data: [],
    isError: [],
    isAllDataInfoLoading: false,
    isAllDataInfoSuccess: false,
    AllDataInfo: [],
    AllDataError: [],
    isAllInfoLoading: false,
    isAllInfoSuccess: false,
    allInfoData: [],
    allInfoError: [],
    isSearchDaraLoading: false,
    isSearchDataSuccess: false,
    searchData: [],
    searchDataError: []
}

export const getAllInfoThunk = createAsyncThunk(
    "getAllinfo",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getAllInfo();

            return Promise.resolve(response?.data)

        } catch (err: unknown) {
            if (isAxiosError(err)) {
                console.log(err.response?.data.message)
                return rejectWithValue(err.response?.data.message)
            }
        }
    }
)

export const getDataThunk = createAsyncThunk(
    "getAllData",
    async (page: number, { rejectWithValue }) => {
        try {
            const response = await getAllData(page);

            return Promise.resolve(response?.data)

        } catch (err: unknown) {
            if (isAxiosError(err)) {
                console.log(err.response?.data.message)
                return rejectWithValue(err.response?.data.message)
            }
        }
    }
)

export const getAllDataInfoThunk = createAsyncThunk(
    "rejectWithValue",
    async (data: string[], { rejectWithValue }) => {
        try {
            const response = await getAllDataInfo(data as string[])
            return Promise.resolve(response?.data)
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                console.log(err.response?.data.message)
                return rejectWithValue(err.response?.data.message)
            }
        }
    }
)

export const searchDataThunk = createAsyncThunk(
    "searchDataThunk",
    async (data: {title:string, value:string | number }, { rejectWithValue, dispatch }) => {
        try {
            const response = await searchData(data)
            if (response?.data?.result) {
                dispatch(getAllDataInfoThunk(response?.data?.result))
            }
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                console.log(err.response?.data.message)
                return rejectWithValue(err.response?.data.message)
            }
        }
    }
)

const valentinesSlice = createSlice({
    name: "getAllValintenesData",
    initialState,
    reducers: {

    }, extraReducers(builder) {
        builder.addCase(getDataThunk.pending, (state: IInitialState) => {
            state.isLoading = true;
        })
        builder.addCase(getDataThunk.fulfilled, (state: IInitialState, action: AnyAction) => {
            state.allInfoData = action.result
            state.isLoading = false;
            state.isSuccess = true;
            state.data = action?.payload?.result
        })
        builder.addCase(getDataThunk.rejected, (state: IInitialState, action: AnyAction) => {
            state.isSuccess = false;
            state.isError = action?.payload
        })
        builder.addCase(getAllDataInfoThunk.pending, (state: IInitialState) => {
            state.isAllDataInfoLoading = true
        })
        builder.addCase(getAllDataInfoThunk.fulfilled, (state:any, action: AnyAction) => {
            state.isAllDataInfoLoading = false;
            state.isAllDataInfoSuccess = true;
            const uniqueId = new Map();
            action?.payload?.result?.forEach((item:any) => {
                uniqueId.set(item?.id, item)
            });
            state.AllDataInfo = [...uniqueId.values()]
        })
        builder.addCase(getAllDataInfoThunk.rejected, (state: IInitialState, action: AnyAction) => {
            state.isAllDataInfoSuccess = false;
            state.AllDataError = action?.payload
        })
        builder.addCase(getAllInfoThunk.pending, (state: IInitialState) => {
            state.isAllInfoLoading = true
        })
        builder.addCase(getAllInfoThunk.fulfilled, (state: IInitialState, action: AnyAction) => {
            state.isAllInfoLoading = false;
            state.isAllInfoSuccess = true;
            state.allInfoData = action?.payload
        })
        builder.addCase(getAllInfoThunk.rejected, (state: IInitialState, action: AnyAction) => {
            state.isAllInfoSuccess = false;
            state.allInfoError = action?.payload
        })
        builder.addCase(searchDataThunk.pending, (state: IInitialState) => {
            state.isSearchDaraLoading = true
        })
        builder.addCase(searchDataThunk.fulfilled, (state: IInitialState, action: AnyAction) => {
            state.isSearchDaraLoading = false;
            state.isSearchDataSuccess = true;
            state.searchData = action?.payload
        })
        builder.addCase(searchDataThunk.rejected, (state: IInitialState, action: AnyAction) => {
            state.isSearchDataSuccess = false;
            state.searchDataError = action?.payload
        })

    },
})

export default valentinesSlice.reducer;
