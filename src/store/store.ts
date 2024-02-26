import {  Action, ThunkAction, configureStore } from '@reduxjs/toolkit';
import valantisSlice  from "./valantis/index"

export const store = configureStore({
    reducer:{
      valantisSlice:valantisSlice
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
