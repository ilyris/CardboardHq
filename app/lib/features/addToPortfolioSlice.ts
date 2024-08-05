"use client";

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CardToAdd {
  cardTitle: string | null;
  cardImageUrl: string | null;
  cardUniqueId: string | null;
  printingUniqueId: string | null;
}

export interface AddToPortfolioState {
  cardToAdd: CardToAdd;
  isModalOpen: boolean;
}

const initialState: AddToPortfolioState = {
  cardToAdd: {
    cardTitle: null,
    cardImageUrl: null,
    cardUniqueId: null,
    printingUniqueId: null,
  },
  isModalOpen: false,
};

export const addToPortfolioSlice = createSlice({
  name: "AddToPortfolioState",
  initialState,
  reducers: {
    addToPortfolio: (state, action: PayloadAction<CardToAdd | undefined>) => {
      if (action.payload) {
        state.cardToAdd.cardTitle = action.payload.cardTitle;
        state.cardToAdd.cardImageUrl = action.payload.cardImageUrl;
        state.cardToAdd.cardUniqueId = action.payload.cardUniqueId;
        state.cardToAdd.printingUniqueId = action.payload.printingUniqueId;
      } else {
        state.cardToAdd.cardTitle = null;
        state.cardToAdd.cardImageUrl = null;
        state.cardToAdd.cardUniqueId = null;
        state.cardToAdd.printingUniqueId = null;
      }
    },

    toggleModalIsOpen: (state) => {
      state.isModalOpen = !state.isModalOpen;
    },
    resetState: () => initialState,
  },
});

export const { addToPortfolio, toggleModalIsOpen, resetState } =
  addToPortfolioSlice.actions;
export default addToPortfolioSlice.reducer;
