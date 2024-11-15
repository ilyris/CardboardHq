"use client";

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CardToUpdate {
  cardTitle: string | null;
  cardImageUrl: string | null;
  printingUniqueId: string | null;
  quantity: number | null;
  portfolioId: string | null;
  edition: string | null;
  foiling: string | null;
}

export interface PortfolioCardToUpdate {
  portfolioCard: CardToUpdate;
  isModalOpen: boolean;
}

const initialState: PortfolioCardToUpdate = {
  portfolioCard: {
    cardTitle: null,
    cardImageUrl: null,
    printingUniqueId: null,
    quantity: null,
    portfolioId: null,
    edition: null,
    foiling: null,
  },
  isModalOpen: false,
};

export const updatePortfolioCardSlice = createSlice({
  name: "UpdatePortfolioCardState",
  initialState,
  reducers: {
    cardToUpdate: (state, action: PayloadAction<CardToUpdate | undefined>) => {
      if (action.payload) {
        state.portfolioCard.cardTitle = action.payload.cardTitle;
        state.portfolioCard.portfolioId = action.payload.portfolioId;
        state.portfolioCard.cardImageUrl = action.payload.cardImageUrl;
        state.portfolioCard.printingUniqueId = action.payload.printingUniqueId;
        state.portfolioCard.quantity = action.payload.quantity;
        state.portfolioCard.edition = action.payload.edition;
        state.portfolioCard.foiling = action.payload.foiling;
      } else {
        state.portfolioCard.cardTitle = null;
        state.portfolioCard.cardImageUrl = null;
        state.portfolioCard.printingUniqueId = null;
        state.portfolioCard.quantity = null;
        state.portfolioCard.quantity = null;
      }
    },

    togglePortfolioCardToUpdateModal: (state) => {
      state.isModalOpen = !state.isModalOpen;
    },
    resetState: () => initialState,
  },
});

export const { cardToUpdate, togglePortfolioCardToUpdateModal, resetState } =
  updatePortfolioCardSlice.actions;
export default updatePortfolioCardSlice.reducer;
