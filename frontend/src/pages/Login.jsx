import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  Stack,
  CircularProgress,
  IconButton,
  InputAdornment
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function Login() {

  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // 🔹 Validate Fields
  const validate = () => {
    const newErrors = {};

    if (!form.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 4) {
      newErrors.password = "Password must be at least 4 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", form.username);

      navigate("/chat");

    } catch {
      setErrorOpen(true);
    }

    setLoading(false);
  };

  return (
    <>
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
            p: 5,
            width: 400,
            borderRadius: 3
          }}
        >
          <Typography variant="h4" mb={3} align="center">
            Login
          </Typography>

          <Stack spacing={2}>

            <TextField
              label="Username"
              fullWidth
              value={form.username}
              error={!!errors.username}
              helperText={errors.username}
              onChange={e =>
                setForm({ ...form, username: e.target.value })
              }
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              value={form.password}
              error={!!errors.password}
              helperText={errors.password}
              onChange={e =>
                setForm({ ...form, password: e.target.value })
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") handleLogin();
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowPassword(prev => !prev)
                      }
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Button
              variant="contained"
              size="large"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Login"
              )}
            </Button>

            <Typography align="center">
              Don't have account?{" "}
              <Link to="/register">Register</Link>
            </Typography>

          </Stack>
        </Paper>
      </Box>

      {/* Error Snackbar */}
      <Snackbar
        open={errorOpen}
        autoHideDuration={3000}
        onClose={() => setErrorOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="error"
          variant="filled"
          onClose={() => setErrorOpen(false)}
        >
          Invalid username or password
        </Alert>
      </Snackbar>
    </>
  );
}

export default Login;