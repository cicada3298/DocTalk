import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = ({ theme }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "https://doctalk-31u3.onrender.com/register",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      setLoading(false);
      setSuccess("User registered successfully! You can now login.");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

      console.log(response.data);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data.error);
      console.log(err.response?.data || err.message);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <Box
      sx={{
        maxWidth: "400px",
        margin: "2rem auto",
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        bgcolor: theme === "dark" ? "#333" : "white",
        color: theme === "dark" ? "white" : "black",
        textAlign: "center",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          color: "#AB47BC",
          font: "inherit",
          fontWeight: "600",
          fontSize: "32px",
        }}
      >
        Register
      </Typography>

      {/* Error Message */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2, font: "inherit", fontSize: "16px" }}
        >
          {error}
        </Alert>
      )}

      {/* Success Message */}
      {success && (
        <Alert
          severity="success"
          sx={{ mb: 2, font: "inherit", fontSize: "16px" }}
        >
          {success}
        </Alert>
      )}

      {/* Registration Form */}
      <form onSubmit={handleRegister}>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            mb: 2,
            fontFamily: "Poppins, sans-serif",
            backgroundColor: theme === "dark" ? "#555" : "#fff",
            borderRadius: "8px",
            input: { color: theme === "dark" ? "white" : "black" },
          }}
          inputProps={{
            style: { fontFamily: "Poppins, sans-serif" },
          }}
          InputLabelProps={{
            style: {
              fontFamily: "Poppins, sans-serif",
              color: theme === "dark" ? "white" : "black",
            },
          }}
        />
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          required
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{
            mb: 2,
            fontFamily: "Poppins, sans-serif",
            backgroundColor: theme === "dark" ? "#555" : "#fff",
            borderRadius: "8px",
            input: { color: theme === "dark" ? "white" : "black" },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleTogglePasswordVisibility}
                  edge="end"
                  sx={{ color: theme === "dark" ? "white" : "#333" }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
            style: { fontFamily: "Poppins, sans-serif" },
          }}
          InputLabelProps={{
            style: {
              fontFamily: "Poppins, sans-serif",
              color: theme === "dark" ? "white" : "black",
            },
          }}
        />
        <TextField
          label="Confirm Password"
          variant="outlined"
          fullWidth
          required
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          sx={{
            mb: 2,
            fontFamily: "Poppins, sans-serif",
            backgroundColor: theme === "dark" ? "#555" : "#fff",
            borderRadius: "8px",
            input: { color: theme === "dark" ? "white" : "black" },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle confirm password visibility"
                  onClick={handleToggleConfirmPasswordVisibility}
                  edge="end"
                  sx={{ color: theme === "dark" ? "white" : "#333" }}
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
            style: { fontFamily: "Poppins, sans-serif" },
          }}
          InputLabelProps={{
            style: {
              fontFamily: "Poppins, sans-serif",
              color: theme === "dark" ? "white" : "black",
            },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            bgcolor: "#AB47BC",
            color: "white",
            fontFamily: "Poppins, sans-serif",
            padding: "0.75rem",
            fontSize: "16px",
            mt: 2,
            "&:hover": {
              bgcolor: "#e65100",
            },
          }}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : (
            "Register"
          )}
        </Button>

        {/* Login Link */}
        <Typography
          variant="body1"
          sx={{
            mt: 3,
            font: "inherit",
            color: theme === "dark" ? "white" : "black",
          }}
        >
          Already have an account?{" "}
          <Button
            color="primary"
            sx={{
              padding: 0,
              font: "inherit",
              "&:hover": {
                bgcolor: "#AB47BC",
                color: "white",
              },
            }}
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </Typography>
      </form>
    </Box>
  );
};

export default Register;
