import React, { FormEvent, useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  FormControlLabel,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import theme from "../../theme";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  resetState,
  toggleModalIsOpen,
} from "../../lib/features/addToPortfolioSlice";
import { getPortfolioList } from "@/helpers/getPortfolioList";
import { Portfolio, PortfolioCard } from "@/app/lib/db";
import { addCardToPortfolio } from "@/helpers/addCardToPortfolio";
import { v4 as uuidv4 } from "uuid";
import useHandleSystemMessage from "@/app/hooks/useHandleSystemMessage";

const gradeOptions = [
  { text: "PSA", value: "psa" },
  { text: "CGC", value: "cgc" },
  { text: "BECKETT", value: "beckett" },
  { text: "PCG", value: "pcg" },
];

const AddToPortfolioModal = () => {
  const dispatch = useAppDispatch();
  const {
    handleApiErrorMessage,
    handleApiResponseMessage,
    handleOpeningSystemMessage,
  } = useHandleSystemMessage();

  const cardToAddToPortfolio = useAppSelector(
    (state) => state.addToPortfolio.cardToAdd
  );
  const isModdalOpen = useAppSelector(
    (state) => state.addToPortfolio.isModalOpen
  );
  const [gradeValue, setGradeValue] = useState<string>("Raw");
  const [quantity, setQuantity] = useState<number | null>(null);
  const [unitPrice, setUnitPrice] = useState<number | "">("");
  const [isLowestPriceChecked, setIsLowestPriceChecked] =
    useState<boolean>(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState<string | null>(
    null
  );
  const [portfolios, setPortfolios] = useState<Portfolio[] | null>(null);
  const handleDialogClose = () => {
    dispatch(toggleModalIsOpen());
    dispatch(resetState());
  };

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<any>>, isCheckbox = false) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = isCheckbox
        ? (e.target as HTMLInputElement).checked
        : e.target.value;
      setter(value);
    };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const portfolioUniqueId = portfolios?.find(
      (portfolio) => portfolio.portfolio_name === selectedPortfolio
    )?.portfolio_unique_id;
    const newPortfolioId = uuidv4();

    if (
      !selectedPortfolio ||
      !cardToAddToPortfolio.cardUniqueId ||
      !cardToAddToPortfolio.printingUniqueId ||
      !portfolioUniqueId ||
      !quantity ||
      !unitPrice
    )
      return;

    const cardObj: PortfolioCard = {
      unique_id: newPortfolioId,
      card_unique_id: cardToAddToPortfolio.cardUniqueId,
      printing_unique_id: cardToAddToPortfolio.printingUniqueId,
      quantity: quantity,
      grade: gradeValue,
      unit_price: unitPrice,
      use_market_price: isLowestPriceChecked,
      date_added: new Date(),
      portfolio_unique_id: portfolioUniqueId,
    };

    try {
      const response = await addCardToPortfolio(cardObj);
      handleApiResponseMessage(response);
    } catch (err) {
      handleApiErrorMessage(err);
    } finally {
      handleDialogClose();
      handleOpeningSystemMessage();
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await getPortfolioList();
        setPortfolios(data);
      } catch (error) {
        console.error("Error fetching the portfolio list", error);
      }
    })();
  }, [cardToAddToPortfolio.cardUniqueId]);

  useEffect(() => {
    if (isLowestPriceChecked && cardToAddToPortfolio.lowPrice) {
      setUnitPrice(cardToAddToPortfolio.lowPrice);
    } else {
      setUnitPrice("");
    }
  }, [isLowestPriceChecked]);
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
        {cardToAddToPortfolio.cardTitle &&
          cardToAddToPortfolio.cardImageUrl && (
            <Box mb={5} position="relative">
              <Typography variant="h6" color={theme.palette.background.default}>
                {cardToAddToPortfolio.cardTitle}
              </Typography>
              <LazyLoadImage
                alt={cardToAddToPortfolio.cardTitle}
                height={"auto"}
                src={cardToAddToPortfolio.cardImageUrl}
                width={"125px"}
                style={{ position: "absolute", top: "-125px", right: 0 }}
              />
            </Box>
          )}

        <Box
          component="form"
          sx={{ display: "flex", flexFlow: "row wrap", mt: 3 }}
          onSubmit={(e) => handleSubmit(e)}
        >
          <Box display="flex" justifyContent="space-between" width="100%">
            <TextField
              id="quantity"
              label="Quantity"
              variant="outlined"
              value={quantity || ""}
              defaultValue={1}
              onChange={handleInputChange(setQuantity)}
              sx={{ flexBasis: "30%" }}
            />
            <TextField
              sx={{
                backgroundColor: "#fff",
                flexBasis: "55%",
                "& .MuiSelect-select": {
                  color: theme.palette.background.default,
                  paddingRight: 4,
                  paddingLeft: 2,
                  paddingTop: 1,
                  paddingBottom: 1,
                  fontSize: "1.2rem",
                  height: "20px",
                },
              }}
              onChange={handleInputChange(setGradeValue)}
              select
              label="Grade"
              value={gradeValue}
            >
              <MenuItem
                sx={{ padding: 1, color: theme.palette.background.default }}
                value="Raw"
              >
                Raw
              </MenuItem>
              {gradeOptions.map(({ value, text }) => (
                <MenuItem
                  sx={{ padding: 1, color: theme.palette.background.default }}
                  key={value}
                  value={value}
                >
                  {text}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            width="100%"
            mt={3}
          >
            <TextField
              id="unit-price"
              label="Unit Price (USD)"
              variant="outlined"
              InputLabelProps={{ shrink: !isLowestPriceChecked ? false : true }}
              value={
                !isLowestPriceChecked
                  ? unitPrice
                  : cardToAddToPortfolio.lowPrice
              }
              disabled={isLowestPriceChecked}
              onChange={handleInputChange(setUnitPrice)}
              sx={{
                input: { color: theme.palette.background.default },
                flexBasis: "45%",
              }}
            />
            <FormControlLabel
              sx={{ color: theme.palette.background.default }}
              control={
                <Checkbox
                  checked={isLowestPriceChecked}
                  onChange={() =>
                    setIsLowestPriceChecked(!isLowestPriceChecked)
                  }
                />
              }
              label="Use Lowest Price"
              labelPlacement="start"
            />
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            width="100%"
            mt={3}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker defaultValue={dayjs()} label="Date" />
            </LocalizationProvider>
            <TextField
              sx={{
                backgroundColor: "#fff",
                flexBasis: "55%",
                "& .MuiSelect-select": {
                  color: theme.palette.background.default,
                  paddingRight: 4,
                  paddingLeft: 2,
                  paddingTop: 1,
                  paddingBottom: 1,
                  fontSize: "1.2rem",
                  height: "20px",
                },
              }}
              onChange={handleInputChange(setSelectedPortfolio)}
              select
              label="Portfolio"
              value={selectedPortfolio}
            >
              <MenuItem
                sx={{ padding: 1, color: theme.palette.background.default }}
                value="Raw"
              >
                Select a portfolio
              </MenuItem>
              {portfolios?.map(({ portfolio_name, unique_id }) => (
                <MenuItem
                  sx={{ padding: 1, color: theme.palette.background.default }}
                  key={unique_id}
                  value={portfolio_name}
                >
                  {portfolio_name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box width={"100%"} display="flex" justifyContent="flex-end">
            <Button type="submit" variant="contained" color="success">
              Add Card
            </Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default AddToPortfolioModal;
