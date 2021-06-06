import { configureStore } from "@reduxjs/toolkit";
import theaterSlice from "../features/theater/theaterSlice";

export const store = configureStore({
  reducer: {
    theater: theaterSlice,
  },
});
