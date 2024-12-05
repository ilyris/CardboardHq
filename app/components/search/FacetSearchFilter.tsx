"use client";
import * as React from "react";
import {
  Box,
  Button,
  FormGroup,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import theme from "@/app/theme";
import artists from "@/app/jsonData/artist.json";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/app/lib/hooks";
import { setArtist, setClass } from "@/app/lib/features/facetSearchSlice";

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
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [classValue, setClassValue] = React.useState<string>("");
  const [artistValue, setArtistValue] = React.useState<string>("");

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setClassValue(event.target.value as string);
    dispatch(setClass(event.target.value));
  };

  const handleArtistChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setArtistValue(event.target.value as string);
    dispatch(setArtist(event.target.value));
  };

  const handleSubmit = async () => {
    router.push(
      `/search/cards?query=%20&artist=${artistValue}&class=${classValue}`
    );
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
      <Box display={"flex"} justifyContent={"space-between"} mb={5}>
        <Typography variant="h4">Search Filters</Typography>
        <Box>
          <Button variant="contained" color="secondary" sx={{ marginRight: 5 }}>
            Reset
          </Button>
          <Button variant="contained" color="success" onClick={handleSubmit}>
            Search
          </Button>
        </Box>
      </Box>
      <Box sx={{ display: "flex", gap: 2, justifyContent: "space-between" }}>
        <FormGroup sx={{ width: "50%" }}>
          <TextField
            sx={{
              mb: 2,
              backgroundColor: "#fff",
              minWidth: "250px",

              "& .MuiSelect-select": {
                color: theme.palette.background.default,
                paddingRight: 4,
                paddingLeft: 2,
                paddingTop: 1,
                paddingBottom: 1,
                fontSize: "1rem",
                height: "35px",
              },
            }}
            onChange={(e) => handleChange(e)}
            select
            label="Class"
            value={classValue}
            defaultValue={classValue}
            SelectProps={{
              MenuProps: {
                sx: { maxHeight: "40%" },
              },
            }}
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
        <FormGroup sx={{ width: "50%" }}>
          <TextField
            sx={{
              backgroundColor: "#fff",
              minWidth: "250px",

              "& .MuiSelect-select": {
                color: theme.palette.background.default,
                paddingRight: 4,
                paddingLeft: 2,
                paddingTop: 1,
                paddingBottom: 1,
                fontSize: "1rem",
                height: "35px",
              },
            }}
            onChange={(e) => handleArtistChange(e)}
            select
            label="Artist"
            value={artistValue}
            defaultValue={null}
            SelectProps={{
              MenuProps: {
                sx: { maxHeight: "40%" },
              },
            }}
          >
            <MenuItem
              sx={{ padding: 1, color: theme.palette.background.default }}
              key={"Search By Artist"}
              data-value={"Search By Artist"}
              value={"Search By Artist"}
            >
              Artist
            </MenuItem>
            {artists.map((artist) => (
              <MenuItem
                sx={{ padding: 1, color: theme.palette.background.default }}
                key={artist.name}
                data-value={artist.name}
                value={artist.name}
              >
                {artist.name}
              </MenuItem>
            ))}
          </TextField>
        </FormGroup>
      </Box>
    </Box>
  );
}
