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

function Register() {

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // 🔹 Validation
  const validate = () => {
    const newErrors = {};

    if (!form.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Confirm your password";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {

    if (!validate()) return;

    setLoading(true);

    try {

      await api.post("/auth/signup", {
        username: form.username,
        email: form.email,
        password: form.password
      });

      setSuccessOpen(true);

      setTimeout(() => {
        navigate("/login");
      }, 2000);

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
            Register
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
              label="Email"
              fullWidth
              value={form.email}
              error={!!errors.email}
              helperText={errors.email}
              onChange={e =>
                setForm({ ...form, email: e.target.value })
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

            <TextField
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              value={form.confirmPassword}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              onChange={e =>
                setForm({
                  ...form,
                  confirmPassword: e.target.value
                })
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRegister();
              }}
            />

            <Button
              variant="contained"
              size="large"
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Register"
              )}
            </Button>

            <Typography align="center">
              Already have account?{" "}
              <Link to="/login">Login</Link>
            </Typography>

          </Stack>
        </Paper>
      </Box>

      {/* SUCCESS SNACKBAR */}
      <Snackbar
        open={successOpen}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled">
          Registration successful! Redirecting to login...
        </Alert>
      </Snackbar>

      {/* ERROR SNACKBAR */}
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
          Registration failed. Try again.
        </Alert>
      </Snackbar>
    </>
  );
}

export default Register;