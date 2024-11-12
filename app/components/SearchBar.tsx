import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import theme from "../theme";
import TuneIcon from "@mui/icons-material/Tune";
import { Dialog, Box } from "@mui/material";
import FacetSearchFilter from "./FacetSearchFilter";
import type { DialogProps } from "@mui/material";

interface SearchBarProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const handleFilterOpening = () => {
    setIsFilterOpen(false);
  };

  const handleClose: DialogProps["onClose"] = (event, reason) => {
    if (reason && reason === "backdropClick") handleFilterOpening();
  };

  return (
    <Box sx={{ position: "relative" }}>
      <TextField
        sx={{
          marginRight: "20px",
          borderRadius: "5px",
          backgroundColor: "#fff",
          "& .MuiInputBase-input": {
            fontSize: "1.2rem",
            height: "20px",
            color: theme.palette.background.default,
          },
        }}
        variant="outlined"
        size="small"
        placeholder={placeholder || "Search..."}
        value={value}
        onChange={onChange}
        InputProps={{
          endAdornment: (
            <InputAdornment
              position="start"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <TuneIcon />
            </InputAdornment>
          ),
        }}
      />
      {isFilterOpen && (
        <Dialog
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isFilterOpen}
          onClose={handleClose}
        >
          <FacetSearchFilter />
        </Dialog>
      )}
    </Box>
  );
};

export default SearchBar;
