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

const ForgotPassword = ({ theme }) => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Step 1: Verify if the email exists in Firebase
  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://doctalk-31u3.onrender.com/verify-email",
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEmailVerified(true);
      setSuccess("Email verified. Please enter your new password.");
      console.log(response.data);
    } catch (error) {
      setError("Email not found. Please check your email.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Handle password reset once email is verified
  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://doctalk-31u3.onrender.com/forgot-password",
        { email, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess("Password updated successfully.");
      navigate("/login");
    } catch (error) {
      setError("Failed to update password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleNewPasswordVisibility = () => {
    setShowNewPassword((prev) => !prev);
  };

  const handleToggleConfirmNewPasswordVisibility = () => {
    setShowConfirmNewPassword((prev) => !prev);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "3rem",
        backgroundColor: theme === "dark" ? "#1e1e1e" : "#f5f5f5",
        transition: "background-color 0.3s ease",
      }}
    >
      <Box
        sx={{
          maxWidth: "400px",
          width: "100%",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          backgroundColor: theme === "dark" ? "#333" : "white",
          color: theme === "dark" ? "white" : "black",
          transition: "background-color 0.3s ease, color 0.3s ease",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            marginBottom: "1.5rem",
            textAlign: "center",
            color: "#AB47BC",
            font: "inherit",
            fontWeight: 600,
            fontSize: "30px",
          }}
        >
          Forgot Password
        </Typography>

        {/* Error and Success Alerts */}
        {error && (
          <Alert
            severity="error"
            sx={{ marginBottom: "1.5rem", font: "inherit" }}
          >
            {error}
          </Alert>
        )}
        {success && (
          <Alert
            severity="success"
            sx={{ marginBottom: "1.5rem", font: "inherit" }}
          >
            {success}
          </Alert>
        )}

        {/* Email Input */}
        {!emailVerified && (
          <form onSubmit={handleVerifyEmail}>
            <TextField
              label="Enter your email"
              type="email"
              fullWidth
              required
              sx={{
                marginBottom: "1.5rem",
                backgroundColor: theme === "dark" ? "#555" : "#fff",
                borderRadius: "8px",
                font: "inherit",
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              inputProps={{
                style: {
                  fontFamily: "Poppins, sans-serif",
                  color: theme === "dark" ? "white" : "black",
                },
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
                backgroundColor: "#AB47BC",
                color: "white",
                font: "inherit",
                padding: "0.75rem",
                "&:hover": {
                  backgroundColor: "#7B1FA2",
                },
              }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Verify Email"
              )}
            </Button>
          </form>
        )}

        {/* Show Password Fields Only After Email is Verified */}
        {emailVerified && (
          <form onSubmit={handleUpdatePassword}>
            <TextField
              label="New Password"
              type={showNewPassword ? "text" : "password"}
              fullWidth
              required
              sx={{
                marginBottom: "1.5rem",
                backgroundColor: theme === "dark" ? "#555" : "#fff",
                borderRadius: "8px",
                font: "inherit",
              }}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleToggleNewPasswordVisibility}
                      edge="end"
                      sx={{ color: theme === "dark" ? "white" : "#333" }}
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                style: {
                  fontFamily: "Poppins, sans-serif",
                  color: theme === "dark" ? "white" : "black",
                },
              }}
              InputLabelProps={{
                style: {
                  fontFamily: "Poppins, sans-serif",
                  color: theme === "dark" ? "white" : "black",
                },
              }}
            />

            <TextField
              label="Confirm New Password"
              type={showConfirmNewPassword ? "text" : "password"}
              fullWidth
              required
              sx={{
                marginBottom: "1.5rem",
                backgroundColor: theme === "dark" ? "#555" : "#fff",
                borderRadius: "8px",
                font: "inherit",
              }}
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={handleToggleConfirmNewPasswordVisibility}
                      edge="end"
                      sx={{ color: theme === "dark" ? "white" : "#333" }}
                    >
                      {showConfirmNewPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
                style: {
                  fontFamily: "Poppins, sans-serif",
                  color: theme === "dark" ? "white" : "black",
                },
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
                backgroundColor: "#AB47BC",
                color: "white",
                font: "inherit",
                padding: "0.75rem",
                "&:hover": {
                  backgroundColor: "#7B1FA2",
                },
              }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Update Password"
              )}
            </Button>
          </form>
        )}
      </Box>
    </Box>
  );
};

export default ForgotPassword;
