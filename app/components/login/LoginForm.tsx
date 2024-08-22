"use client";
import { FaGoogle } from "react-icons/fa";
import { Button, Box } from "@mui/material";

interface LoginFormProps {
  handleLoginCb: (provider: string) => Promise<void>;
  providers?: any;
}
const LoginForm: React.FC<LoginFormProps> = ({ handleLoginCb, providers }) => {
  return (
    <Box mt={5} display={"flex"} justifyContent={"center"}>
      {providers && (
        <Button variant="contained" onClick={() => handleLoginCb("google")}>
          <FaGoogle style={{ fontSize: "30px", marginRight: "10px" }} />
          Continue with Google
        </Button>
      )}
    </Box>
  );
};

export default LoginForm;
