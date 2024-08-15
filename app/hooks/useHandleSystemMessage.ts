import {
  addMessage,
  handleOpenMessage,
} from "@/app/lib/features/systemMessageSlice";
import { useAppDispatch } from "../lib/hooks";

const useHandleSystemMessage = () => {
  const dispatch = useAppDispatch();

  const handleApiResponseMessage = (response: any) => {
    if (response.status === 200) {
      dispatch(
        addMessage({ text: response.data.message, severity: "success" })
      );
    } else {
      dispatch(addMessage({ text: response.data.message, severity: "error" }));
    }
  };

  const handleApiErrorMessage = (error: any) => {
    dispatch(
      addMessage({
        text:
          error.response?.data?.message ||
          "An error occurred. Please try again.",
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
