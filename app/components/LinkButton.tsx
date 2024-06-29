import * as React from "react";
import Button from "@mui/material/Button/Button";
import { Link } from "@mui/material";

interface ButtonProps {
  text: string;
  hrefUrl?: string;
}
const LinkButton: React.FC<ButtonProps> = ({ text, hrefUrl }) => {
  return (
    <Link href={hrefUrl || "/"} target="_blank" sx={{ margin: 0 }}>
      <Button variant="contained">{text}</Button>
    </Link>
  );
};
export default LinkButton;
