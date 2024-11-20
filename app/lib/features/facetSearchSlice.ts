"use client";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface FacetSearchState {
  class: string | null;
  artist: string | null;
  isFacetSearchOpen: boolean;
}

const initialState: FacetSearchState = {
  class: null,
  artist: null,
  isFacetSearchOpen: false,
};

export const facetSearchSlice = createSlice({
  name: "facetSearch",
  initialState,
  reducers: {
    setArtist: (state, action: PayloadAction<string>) => {
      state.artist = action.payload;
    },
    setClass: (state, action: PayloadAction<string>) => {
      state.class = action.payload;
    },
    toggleModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isFacetSearchOpen = action.payload;
    },
    resetState: () => initialState,
  },
});

export const { resetState, setArtist, setClass, toggleModalOpen } =
  facetSearchSlice.actions;
export default facetSearchSlice.reducer;
