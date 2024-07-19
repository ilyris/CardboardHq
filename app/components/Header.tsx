import { Box, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import Image from "next/image";
import replaceHyphenWithWhiteSpace from "@/helpers/replaceHyperWithWhiteSpace";
import formatDate from "@/helpers/formatDate";
import fabSetData from "@/app/jsonData/FaBSet.json";
import { CardSet } from "@/typings/FaBSet";
import React from "react";

interface HeaderProps {
  logo: string | null;
}

const Header: React.FC<HeaderProps> = ({ logo }) => {
  const headerStyles = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "50px",
  };
  const FaBSetDataJson: CardSet[] = fabSetData as CardSet[];

  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const set = FaBSetDataJson.find(
    (set) =>
      set.formatted_name ===
      slug.toLocaleLowerCase().replace(/-to-|-of-/gi, "-")
  ) as CardSet;

  const printingReleaseDate = set.printings[0].initial_release_date;
  return (
    <Box component="header" sx={{ ...headerStyles }}>
      <Box>
        {logo && (
          <Image src={logo ? logo : ""} alt={`${slug} logo`} width={400} />
        )}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h6" pl={1}>
            {replaceHyphenWithWhiteSpace(slug)}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="body2" pl={1}>
            {formatDate(printingReleaseDate)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
