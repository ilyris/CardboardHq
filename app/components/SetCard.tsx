import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea, Link, Skeleton } from "@mui/material";
import { LazyLoadImage } from "react-lazy-load-image-component";

interface SetCardProps {
  assetFilePath: string;
  logo: string;
  title: string;
}

const SetCard: React.FC<SetCardProps> = ({ assetFilePath, logo, title }) => {
  const [hasImageLoaded, setHasImageLoaded] = React.useState<boolean>(false);

  return (
    <Link underline="none" href={`/sets/${title.replace(/\s+/g, "-")}`}>
      <Card
        sx={{
          width: 300,
          m: 2,
          backgroundColor: "transparent",
          boxShadow: "unset",
        }}
      >
        <CardActionArea>
          <div style={{ position: "relative" }}>
            {/* {!hasImageLoaded && <Skeleton height={300} width={"100%"} />} */}
            {/* <LazyLoadImage
              alt={title}
              height={"auto"}
              src={assetFilePath ?? ""}
              width={"100%"}
              onLoad={() => setHasImageLoaded(true)}
            /> */}
            <CardMedia
              component="img"
              image={assetFilePath}
              sx={{ borderRadius: "15px", height: "150px" }}
            />
            <div
              style={{
                zIndex: 1000,
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
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
                image={logo}
                sx={{ filter: "drop-shadow(5px 5px 5px rgba(0, 0, 0, 0.5))" }}
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
