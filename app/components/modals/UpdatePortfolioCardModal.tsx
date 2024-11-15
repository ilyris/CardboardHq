import React, { FormEvent, useEffect, useState } from "react";
import { Box, Button, Dialog, TextField, Typography } from "@mui/material";
import theme from "../../theme";
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  resetState,
  togglePortfolioCardToUpdateModal,
} from "../../lib/features/updatePortfolioCard";
import useHandleSystemMessage from "@/app/hooks/useHandleSystemMessage";
import { useSession } from "next-auth/react";
import LoginForm from "../login/LoginForm";
import { deleteCardFromPortfolio } from "@/helpers/deleteCardFromPortfolio";
import { updateCardFromPortfolio } from "@/helpers/updateCardFromPortfolio";
import { isNegativeNumber } from "@/helpers/isNegativeNumber";

interface UpdatePortfolioCardModalProps {
  handleLogin: (provider: string) => Promise<void>;
  providers?: any;
  onCloseCb?: () => void;
}
const UpdatePortfolioCardModal: React.FC<UpdatePortfolioCardModalProps> = ({
  handleLogin,
  providers,
  onCloseCb,
}) => {
  const session = useSession();
  const isAuthenticationed = session.status === "authenticated";
  const dispatch = useAppDispatch();

  const {
    handleApiErrorMessage,
    handleApiResponseMessage,
    handleOpeningSystemMessage,
  } = useHandleSystemMessage();

  const isModdalOpen = useAppSelector(
    (state) => state.portfolioCardToUpdate.isModalOpen
  );
  const portfolioId = useAppSelector(
    (state) => state.portfolioCardToUpdate.portfolioCard.portfolioId
  );
  const portfolioCardToUpdate = useAppSelector(
    (state) => state.portfolioCardToUpdate.portfolioCard
  );
  const [quantity, setQuantity] = useState<number | null>(
    portfolioCardToUpdate.quantity
  );

  const handleDialogClose = () => {
    dispatch(togglePortfolioCardToUpdateModal());
    dispatch(resetState());
    onCloseCb && onCloseCb();
  };

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<any>>) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setter(Number(value));
    };

  const handleDelete = async () => {
    if (
      portfolioId &&
      portfolioCardToUpdate.printingUniqueId &&
      portfolioCardToUpdate.edition &&
      portfolioCardToUpdate.foiling &&
      portfolioCardToUpdate.cardTitle
    ) {
      const response = await deleteCardFromPortfolio({
        portfolioId,
        printingId: portfolioCardToUpdate.printingUniqueId,
        edition: portfolioCardToUpdate.edition,
        foiling: portfolioCardToUpdate.foiling,
        title: portfolioCardToUpdate.cardTitle,
      });

      try {
        handleApiResponseMessage(response);
      } catch (err) {
        handleApiErrorMessage(err);
      } finally {
        handleDialogClose();
        handleOpeningSystemMessage();
      }
    }
  };
  const handleUpdate = async () => {
    if (Number(quantity) === portfolioCardToUpdate.quantity) return;
    if (
      portfolioId &&
      portfolioCardToUpdate.printingUniqueId &&
      portfolioCardToUpdate.edition &&
      portfolioCardToUpdate.foiling &&
      portfolioCardToUpdate.cardTitle &&
      !isNegativeNumber(Number(quantity)) &&
      !!quantity
    ) {
      const response = await updateCardFromPortfolio({
        portfolioId,
        printingId: portfolioCardToUpdate.printingUniqueId,
        edition: portfolioCardToUpdate.edition,
        foiling: portfolioCardToUpdate.foiling,
        title: portfolioCardToUpdate.cardTitle,
        quantity,
      });
      try {
        handleApiResponseMessage(response);
      } catch (err) {
        handleApiErrorMessage(err);
      } finally {
        handleDialogClose();
        handleOpeningSystemMessage();
      }
    }
  };
  return (
    <Dialog
      sx={{
        color: "#fff",
        zIndex: theme.zIndex.drawer + 1,
        overflow: "visible",
      }}
      PaperProps={{
        sx: {
          overflow: "visible",
        },
      }}
      open={isModdalOpen}
      onClose={handleDialogClose}
    >
      <Box p={5} overflow="visible">
        {portfolioCardToUpdate.cardTitle &&
          portfolioCardToUpdate.cardImageUrl && (
            <Box mb={5} position="relative">
              <Typography variant="h6" color={theme.palette.background.default}>
                {portfolioCardToUpdate.cardTitle}
              </Typography>
              <LazyLoadImage
                alt={portfolioCardToUpdate.cardTitle}
                height={"auto"}
                src={portfolioCardToUpdate.cardImageUrl}
                width={"125px"}
                style={{ position: "absolute", top: "-125px", right: 0 }}
              />
            </Box>
          )}
        {isAuthenticationed ? (
          <Box sx={{ display: "flex", flexFlow: "row wrap", mt: 3 }}>
            <Box display="flex" justifyContent="space-between" width="100%">
              <TextField
                id="quantity"
                label="Quantity"
                variant="outlined"
                value={quantity || ""}
                defaultValue={1}
                onChange={handleInputChange(setQuantity)}
                sx={{ flexBasis: "50%" }}
              />
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              width="100%"
              mt={3}
            ></Box>
            <Box width={"100%"} display="flex" justifyContent="space-between">
              <Button
                type="button"
                variant="contained"
                color="success"
                disabled={Number(quantity) === portfolioCardToUpdate.quantity}
                onClick={handleUpdate}
              >
                Update
              </Button>
              <Button
                type="button"
                variant="contained"
                color="error"
                onClick={handleDelete}
              >
                Delete All
              </Button>
            </Box>
          </Box>
        ) : (
          <Box
            m={5}
            p={2}
            width={350}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
          >
            <Typography
              variant={"h6"}
              textAlign={"center"}
              color={theme.palette.text.secondary}
            >
              {" "}
              Login to add this card to your portfolio
            </Typography>
            <LoginForm providers={providers} handleLoginCb={handleLogin} />
          </Box>
        )}
      </Box>
    </Dialog>
  );
};

export default UpdatePortfolioCardModal;
