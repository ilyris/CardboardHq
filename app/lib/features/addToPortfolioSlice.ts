"use client";

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CardToAdd {
  cardTitle: string | null;
  cardImageUrl: string | null;
  cardUniqueId: string | null;
  printingUniqueId: string | null;
  lowPrice: null | number;
  marketPrice?: null | number;
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
    lowPrice: null,
    marketPrice: null,
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
        (state.cardToAdd.lowPrice = action.payload.lowPrice ?? null),
          (state.cardToAdd.marketPrice = action.payload.marketPrice ?? null);
      } else {
        state.cardToAdd.cardTitle = null;
        state.cardToAdd.cardImageUrl = null;
        state.cardToAdd.cardUniqueId = null;
        state.cardToAdd.printingUniqueId = null;
        (state.cardToAdd.lowPrice = null), (state.cardToAdd.marketPrice = null);
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
