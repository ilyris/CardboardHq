import { configureStore } from "@reduxjs/toolkit";
import addToPortfolioSlice from "./features/addToPortfolioSlice";
import systemMessageSlice from "./features/systemMessageSlice";
import updatePortfolioCardSlice from "./features/updatePortfolioCard";

export const makeStore = () => {
  return configureStore({
    reducer: {
      addToPortfolio: addToPortfolioSlice,
      systemMessage: systemMessageSlice,
      portfolioCardToUpdate: updatePortfolioCardSlice,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
