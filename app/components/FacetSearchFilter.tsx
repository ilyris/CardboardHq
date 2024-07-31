import * as React from "react";
import { Box, Button, FormGroup, MenuItem, TextField } from "@mui/material";
import theme from "../theme";

const classOptions = [
  "Adjudicator",
  "Assassin",
  "Bard",
  "Brute",
  "Generic",
  "Guardian",
  "Illusionist",
  "Mechanologist",
  "Merchant",
  "Ninja",
  "Ranger",
  "Runeblade",
  "Shapeshifter",
  "Warrior",
  "Wizard",
];

export default function FacetSearchFilter() {
  const [classValue, setClassValue] = React.useState<string>("Select a class");

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setClassValue(event.target.value as string);
  };

  return (
    <Box
      sx={{
        color: "#000",
        backgroundColor: "#fff",
        padding: "20px",
        width: "600px",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Box display={"flex"} justifyContent={"flex-end"} mb={5}>
        <Button variant="contained" color="secondary" sx={{ marginRight: 5 }}>
          Reset
        </Button>
        <Button variant="contained" color="success">
          Search
        </Button>
      </Box>
      <FormGroup>
        <TextField
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
          onChange={(e) => handleChange(e)}
          select
          label="Class"
          value={classValue}
          defaultValue={classValue}
        >
          <MenuItem
            sx={{ padding: 1, color: theme.palette.background.default }}
            key={"Select a class"}
            data-value={"Select a class"}
            value={"Select a class"}
          >
            Select a class
          </MenuItem>
          {classOptions.map((option) => (
            <MenuItem
              sx={{ padding: 1, color: theme.palette.background.default }}
              key={option}
              data-value={option}
              value={option}
            >
              {option}
            </MenuItem>
          ))}
        </TextField>
      </FormGroup>
    </Box>
  );
}
