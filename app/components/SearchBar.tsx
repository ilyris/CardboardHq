import React from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import theme from "../theme";

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
  return (
    <TextField
      sx={{
        marginRight: "20px",
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
      inputProps={{
        startAdornment: (
          <InputAdornment position="start" onClick={() => console.log(value)}>
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SearchBar;
