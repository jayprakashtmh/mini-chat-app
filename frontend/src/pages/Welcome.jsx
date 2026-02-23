import {
  Box,
  Paper,
  Typography,
  Button,
  Stack
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import { useNavigate } from "react-router-dom";

function Welcome() {

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #1976d2, #42a5f5)"
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 6,
          borderRadius: 4,
          textAlign: "center",
          width: 400
        }}
      >
        <ChatIcon
          sx={{ fontSize: 60, color: "#1976d2", mb: 2 }}
        />

        <Typography variant="h4" gutterBottom>
          Mini Chat
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          Secure real-time chat built with
          React & Spring Boot.
        </Typography>

        {!token ? (
          <Stack spacing={2}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/register")}
            >
              Register
            </Button>
          </Stack>
        ) : (
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/chat")}
          >
            Go to Chat
          </Button>
        )}
      </Paper>
    </Box>
  );
}

export default Welcome;