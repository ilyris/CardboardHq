import {
  addMessage,
  handleOpenMessage,
} from "@/app/lib/features/systemMessageSlice";
import { useAppDispatch } from "../lib/hooks";

const useHandleSystemMessage = () => {
  const dispatch = useAppDispatch();

  const handleApiResponseMessage = (response: any) => {
    const message =
      response.data?.results?.message || response.results?.message;

    if (response.status === 200) {
      dispatch(addMessage({ text: message, severity: "success" }));
    } else {
      dispatch(addMessage({ text: message, severity: "error" }));
    }
  };

  const handleApiErrorMessage = (error: any) => {
    const message =
      error.response.data?.message || error.response.results?.message;

    dispatch(
      addMessage({
        text: message || "An error occurred. Please try again.",
        severity: "error",
      })
    );
  };

  const handleOpeningSystemMessage = () => {
    dispatch(handleOpenMessage());
  };

  return {
    handleApiResponseMessage,
    handleApiErrorMessage,
    handleOpeningSystemMessage,
  };
};

export default useHandleSystemMessage;
