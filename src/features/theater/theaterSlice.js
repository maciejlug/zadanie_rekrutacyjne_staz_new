import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  windowSize: 0,
  dataList: [],
  seatsList: [],
  bookingList: [],
  rowsCols: { cols: 0, rows: 0 },
  proposedSeatsList: [],
};

const theaterSlice = createSlice({
  name: "seatsNumber",
  initialState,
  reducers: {
    saveSize: (state, action) => {
      state.windowSize = action.payload;
    },
    saveData: (state, action) => {
      state.dataList = action.payload;
    },
    saveSeats: (state, action) => {
      state.seatsList.push(action.payload);
    },
    saveBooking: (state, action) => {
      state.bookingList.push(action.payload);
    },
    saveRowsCols: (state, action) => {
      state.rowsCols = action.payload;
    },
    saveProposedSeats: (state, action) => {
      state.proposedSeatsList = action.payload;
    },
  },
});

export const {
  saveSize,
  saveData,
  saveSeats,
  saveBooking,
  saveRowsCols,
  saveProposedSeats,
} = theaterSlice.actions;

export const selectSize = (state) => state.theater.windowSize;
export const selectDataList = (state) => state.theater.dataList;
export const selectSeatList = (state) => state.theater.seatsList;
export const selectBookingList = (state) => state.theater.bookingList;
export const selectRowsCols = (state) => state.theater.rowsCols;
export const selectProposedSeats = (state) => state.theater.proposedSeatsList;
export default theaterSlice.reducer;
