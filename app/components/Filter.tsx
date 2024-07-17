import React, { useState, FC } from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { MenuItem } from "@mui/material";
import theme from "../theme";

interface FilterProps {
  options: { text: string; option: string }[];
  onCallback: (value: string) => void;
}

const Filter: FC<FilterProps> = ({ options, onCallback }) => {
  const [selectListValue, setSelectListValue] = useState<string>("");

  const handleChange = (event: SelectChangeEvent) => {
    setSelectListValue(event.target.value as string);
    onCallback(event.target.value);
  };

  return (
    <Select
      sx={{
        backgroundColor: "#fff",
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
      onChange={handleChange}
      value={selectListValue || options[0].option}
      defaultValue={options[0].option}
    >
      {options.map((option) => (
        <MenuItem
          sx={{ padding: 1, color: theme.palette.background.default }}
          key={option.option}
          data-value={option.option}
          value={option.option}
        >
          {option.text}
        </MenuItem>
      ))}
    </Select>
  );
};

export default Filter;
