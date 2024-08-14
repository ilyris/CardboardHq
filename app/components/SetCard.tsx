import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Box, CardActionArea, Link, Skeleton } from "@mui/material";
import { LazyLoadImage } from "react-lazy-load-image-component";
import theme from "../theme";
import { useEffect, useState } from "react";
import { checkImageExists } from "@/helpers/checkImageExists";

interface SetCardProps {
  assetFilePath: string;
  logo: string;
  title: string;
  edition: string;
}

const SetCard: React.FC<SetCardProps> = ({
  assetFilePath,
  logo,
  title,
  edition,
}) => {
  const [hasImageLoaded, setHasImageLoaded] = useState<boolean>(false);
  const [imageExists, setImageExists] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const exists = await checkImageExists(logo);
      if (exists) setImageExists(true);
    })();
  }, [logo]);

  return (
    <Link
      underline="none"
      href={`/sets/${title.replace(/\s+/g, "-")}?edition=${edition}`}
      sx={{ margin: 0 }}
    >
      <Card
        sx={{
          width: 405,
          height: 300,
          m: 2,
          backgroundColor: "transparent",
          boxShadow: "unset",
        }}
      >
        <CardActionArea sx={{ position: "relative" }}>
          <Box
            sx={{
              backgroundColor: theme.palette.background.default,
              position: "absolute",
              width: "100px",
              top: 0,
              fontSize: "20px",
              textAlign: "center",
              fontWeight: "bold",
              right: 0,
              zIndex: 10,
              padding: 1,
              display: "flex",
              borderBottomLeftRadius: "10px",
            }}
          >
            {edition === "F" || edition === "A" ? "1st Ed" : "Unlimited"}
          </Box>
          <div style={{ position: "relative" }}>
            <CardMedia
              component="img"
              image={assetFilePath}
              sx={{ borderRadius: "15px", maxHeight: 225 }}
            />
            <div
              style={{
                zIndex: 1000,
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-36%, -50%)",
                width: "75%",
              }}
            >
              {hasImageLoaded && (
                <LazyLoadImage
                  alt={title}
                  height={"auto"}
                  src={logo ?? ""}
                  width={"100%"}
                />
              )}

              <CardMedia
                component="img"
                image={imageExists ? logo : ""}
                sx={{
                  filter: "drop-shadow(5px 5px 5px rgba(0, 0, 0, 0.5))",
                  width: "75%",
                }}
              />
            </div>
          </div>

          <CardContent>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              align="center"
            >
              {title}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
};

export default SetCard;
