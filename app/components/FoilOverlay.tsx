import { Box } from "@mui/material";

interface FoilOverlayProps {
  foiling?: string;
}
const FoilOverlay: React.FC<FoilOverlayProps> = ({ foiling }) => {
  const styleObject = {
    width: "100%",
    height: "99.5%",
    position: "absolute",
    top: "-1px",
    ...(foiling === "Cold Foil"
      ? { backgroundColor: "silver" }
      : foiling === "Rainbow Foil"
      ? {
          background:
            "linear-gradient(to right, rgba(63, 218, 216, 1) 0%, rgba(47, 201, 226, 1) 25%, rgba(28, 127, 238, 1) 50%, rgba(95, 21, 242, 1) 75%, rgba(186, 12, 248, 1) 100%)",
        }
      : { backgroundColor: "none" }),

    opacity: 0.4,
    borderRadius: "20px",
  };

  return <Box sx={styleObject}></Box>;
};
export default FoilOverlay;
