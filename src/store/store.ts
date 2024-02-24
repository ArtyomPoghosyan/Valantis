import {  Action, ThunkAction, configureStore } from '@reduxjs/toolkit';
import valentinesSlice  from "./valantines/index"

export const store = configureStore({
    reducer:{
      valentinesSlice:valentinesSlice
    }
})
export default store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>>
