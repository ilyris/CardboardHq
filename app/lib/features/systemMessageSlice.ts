"use client";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Message {
  text: string;
  severity: "error" | "info" | "success" | "warning";
}

interface SystemMessageState {
  message: Message;
  isMessageOpen: boolean;
}

const initialState: SystemMessageState = {
  message: {
    text: "",
    severity: "warning",
  },
  isMessageOpen: false,
};

export const systemMessageSlice = createSlice({
  name: "systemMessage",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      const { text, severity } = action.payload;
      state.message.text = text;
      state.message.severity = severity;
    },
    handleOpenMessage: (state) => {
      state.isMessageOpen = true;
    },
    handleCloseMessage: (state) => {
      state.isMessageOpen = false;
    },
    resetState: () => initialState,
  },
});

export const { addMessage, handleCloseMessage, handleOpenMessage, resetState } =
  systemMessageSlice.actions;
export default systemMessageSlice.reducer;
