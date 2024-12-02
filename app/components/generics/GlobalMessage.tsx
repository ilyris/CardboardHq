"use client";
import React from "react";
import { Snackbar } from "@mui/base/Snackbar";
import { Alert, Box, SnackbarCloseReason } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import {
  handleCloseMessage,
  resetState,
} from "@/app/lib/features/systemMessageSlice";

const SnearBarContainerStyles = {
  position: "fixed",
  top: "70px",
  transform: "translate(-50%, -50%)",
  left: "50%",
  zIndex: "10",
};

const GlobalMessage = () => {
  const dispatch = useAppDispatch();
  const message = useAppSelector((state) => state.systemMessage.message);
  const isMessageOpen = useAppSelector(
    (state) => state.systemMessage.isMessageOpen
  );

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(handleCloseMessage());
    dispatch(resetState());
  };

  return (
    <Box sx={{ ...SnearBarContainerStyles }}>
      <Snackbar
        open={isMessageOpen}
        autoHideDuration={6000}
        onClose={() => {
          dispatch(handleCloseMessage());
          dispatch(resetState());
        }}
      >
        <Alert
          onClose={handleClose}
          severity={message.severity ?? "warning"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message.text}
        </Alert>
      </Snackbar>
    </Box>
  );
};
export default GlobalMessage;
