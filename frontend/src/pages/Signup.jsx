import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import config from '../config';
import CryptoJS from 'crypto-js';
import PersonIcon from "@mui/icons-material/Person";
import VpnKeyRoundedIcon from "@mui/icons-material/VpnKeyRounded";
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import {
  InputAdornment,
  IconButton,
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InfoIcon from "@mui/icons-material/Info";
import { POST } from "../api";
import { Modal } from "react-bootstrap";
import VerifyEmail from "../components/VerifyEmail.jsx";
import Logo from "../components/Logo";

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: '14px',
    fontWeight: 600,
    fontFamily: "'Quicksand', sans-serif",
    fontSize: '15px',
    "& fieldset": { borderColor: "rgba(30,144,255,0.2)" },
    "&:hover fieldset": { borderColor: "rgba(30,144,255,0.4)" },
    "&.Mui-focused fieldset": { borderColor: "#1E90FF", borderWidth: "2px" },
  },
  "& label": { fontFamily: "'Quicksand', sans-serif", fontWeight: 500 },
  "& .MuiInputBase-input": { fontFamily: "'Quicksand', sans-serif" },
};

export default function Register() {
  const [loading, setloading] = useState(false);
  const [justVerify, setJustVerify] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [hasUpperCase, setHasUpperCase] = useState(false);
  const [hasLowerCase, setHasLowerCase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);
  const [isValidLength, setIsValidLength] = useState(false);

  const handlePasswordChange = (e) => {
    const input = e.target.value;
    setPassword(input);

    const lengthValid = input.length >= 8;
    setIsValidLength(lengthValid);
    const upperCaseValid = /[A-Z]/.test(input);
    setHasUpperCase(upperCaseValid);
    const lowerCaseValid = /[a-z]/.test(input);
    setHasLowerCase(lowerCaseValid);
    const numberValid = /[0-9]/.test(input);
    setHasNumber(numberValid);
    const specialCharValid = /[!@#$%^&*(),.?":{}|<>]/.test(input);
    setHasSpecialChar(specialCharValid);

    setValidPassword(lengthValid && upperCaseValid && lowerCaseValid && numberValid && specialCharValid);
  };

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorEmailId, setErrorEmailId] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const modalResponseRef = useRef(null);

  const handleModalResponse = (value) => {
    modalResponseRef.current = value;
  };

  const passwordsMatch = password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setJustVerify(true);

    if (
      errorEmailId ||
      username === "" ||
      email === "" ||
      !validPassword ||
      !passwordsMatch ||
      confirmPassword === "" ||
      username.length >= 255 ||
      email.length >= 255 ||
      password.length >= 255
    ) {
      toast("Please fill out all fields correctly.", {
        icon: <InfoIcon />,
      });
      return;
    }

    const data = new FormData();
    data.append("username", username);
    data.append("email", email);
    data.append("role", "READER");

    try {
      const result = await POST(`/api/user/isuserexistwhensignup`, { username, email, role: "READER" });
      if (result.data?.success === false) {
        toast.error(result.data.message);
        return;
      }
    } catch (error) {
      toast.error("Signup failed");
      return;
    }

    modalResponseRef.current = null;
    setShowModal(true);

    const response = await new Promise((resolve) => {
      const interval = setInterval(() => {
        if (modalResponseRef.current !== null) {
          clearInterval(interval);
          resolve(modalResponseRef.current);
        }
      }, 100);
    });

    if (!response) {
      toast.error("Invalid code");
      return;
    }

    setloading(true);
    const encryptedPassword = CryptoJS.AES.encrypt(password, config.PWD_SECRET).toString();
    data.append('password', encryptedPassword);

    try {
      const result = await axios.post(`${config.BACKEND_API}/api/user/signup`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          "authorization": "Bearer " + localStorage.getItem("token"),
        },
      });

      if (result.data?.success) {
        window.localStorage.setItem('token', result.data.token);
        toast.success("Signup successful!");
        window.location.href = '/';
      } else {
        toast.error(result.data?.message);
      }
    } catch (error) {
      toast.error("Signup failed");
    } finally {
      setloading(false);
    }
  };

  const getPasswordHelperText = () => {
    if (!justVerify) return "";
    if (password === "") return "This field cannot be empty.";
    if (!isValidLength) return "At least 8 characters required.";
    if (!hasUpperCase) return "Must contain an uppercase letter.";
    if (!hasLowerCase) return "Must contain a lowercase letter.";
    if (!hasNumber) return "Must contain a number.";
    if (!hasSpecialChar) return "Must contain a special character.";
    return "";
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #0a1628 0%, #0d2137 40%, #0f2b46 100%)',
        zIndex: 10,
        overflowY: 'auto',
        py: 4,
      }}
    >
      {/* Background decoration */}
      <Box sx={{
        position: 'absolute',
        top: '5%',
        left: '20%',
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(30,144,255,0.08) 0%, transparent 70%)',
        filter: 'blur(40px)',
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: '10%',
        right: '15%',
        width: 250,
        height: 250,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(30,144,255,0.06) 0%, transparent 70%)',
        filter: 'blur(40px)',
      }} />

      <Box
        sx={{
          width: '100%',
          maxWidth: 420,
          mx: 2,
          p: { xs: 3, sm: 4 },
          borderRadius: '24px',
          backgroundColor: 'rgba(255,255,255,0.97)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Logo height={48} />
        </Box>

        <Typography sx={{
          fontFamily: "'Quicksand', sans-serif",
          fontWeight: 800,
          fontSize: '1.6rem',
          color: '#1a1a2e',
          mb: 0.5,
        }}>
          Create Account
        </Typography>

        <Typography sx={{
          fontFamily: "'Quicksand', sans-serif",
          fontWeight: 500,
          fontSize: '0.9rem',
          color: 'rgba(0,0,0,0.45)',
          mb: 3,
        }}>
          Join NewsBuzz and stay informed
        </Typography>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              label="Username"
              placeholder="johndoe"
              variant="outlined"
              fullWidth
              required
              size="small"
              error={justVerify && (username === "" || username.length >= 255)}
              helperText={justVerify && username === "" ? "This field cannot be empty." : ""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: '#1E90FF', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={inputSx}
            />

            <TextField
              value={email}
              onChange={(e) => {
                const value = e.target.value;
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                setEmail(value);
                setErrorEmailId(!emailRegex.test(value));
              }}
              label="Email Address"
              placeholder="you@example.com"
              variant="outlined"
              fullWidth
              required
              size="small"
              error={justVerify && (email === "" || email.length >= 255 || errorEmailId)}
              helperText={
                justVerify && (email === ""
                  ? "This field cannot be empty."
                  : errorEmailId ? "Please enter a valid email." : "")
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailRoundedIcon sx={{ color: '#1E90FF', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={inputSx}
            />

            <TextField
              value={password}
              onChange={handlePasswordChange}
              label="Password"
              placeholder="Min. 8 characters"
              variant="outlined"
              name="password"
              type={showPassword ? "text" : "password"}
              fullWidth
              required
              size="small"
              error={justVerify && (!validPassword || password === "" || password.length >= 255)}
              helperText={getPasswordHelperText()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <VpnKeyRoundedIcon sx={{ color: '#1E90FF', fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? (
                        <Visibility sx={{ color: '#1E90FF', fontSize: 20 }} />
                      ) : (
                        <VisibilityOff sx={{ color: 'rgba(0,0,0,0.3)', fontSize: 20 }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={inputSx}
            />

            <TextField
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              label="Confirm Password"
              placeholder="Re-enter your password"
              variant="outlined"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              fullWidth
              required
              size="small"
              error={justVerify && (confirmPassword === "" || !passwordsMatch)}
              helperText={
                justVerify && (confirmPassword === ""
                  ? "Please confirm your password."
                  : !passwordsMatch ? "Passwords do not match." : "")
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <VpnKeyRoundedIcon sx={{ color: '#1E90FF', fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={() => setShowConfirmPassword((show) => !show)}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="small"
                    >
                      {showConfirmPassword ? (
                        <Visibility sx={{ color: '#1E90FF', fontSize: 20 }} />
                      ) : (
                        <VisibilityOff sx={{ color: 'rgba(0,0,0,0.3)', fontSize: 20 }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={inputSx}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                fontFamily: "'Quicksand', sans-serif",
                fontWeight: 700,
                fontSize: '15px',
                borderRadius: '14px',
                py: 1.3,
                mt: 0.5,
                textTransform: 'none',
                background: 'linear-gradient(135deg, #1E90FF 0%, #0055CC 100%)',
                boxShadow: '0 4px 16px rgba(30,144,255,0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4DA8FF 0%, #1E90FF 100%)',
                  boxShadow: '0 6px 24px rgba(30,144,255,0.4)',
                  transform: 'translateY(-1px)',
                },
                '&:disabled': {
                  background: 'rgba(30,144,255,0.5)',
                  color: 'white',
                },
                transition: 'all 0.25s ease',
              }}
            >
              {loading ? (
                <CircularProgress size={22} sx={{ color: "white" }} />
              ) : (
                "Create Account"
              )}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 1 }}>
              <Typography component="span" sx={{
                fontFamily: "'Quicksand', sans-serif",
                fontWeight: 500,
                fontSize: '0.88rem',
                color: 'rgba(0,0,0,0.45)',
              }}>
                Already have an account?{' '}
              </Typography>
              <Button
                variant="text"
                onClick={() => navigate("/login")}
                sx={{
                  fontFamily: "'Quicksand', sans-serif",
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  color: '#1E90FF',
                  textTransform: 'none',
                  p: 0,
                  minWidth: 'auto',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    color: '#0055CC',
                  },
                }}
              >
                Log In
              </Button>
            </Box>
          </Box>
        </form>
      </Box>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Verify Email
          </Typography>
        </Modal.Header>
        <Modal.Body>
          <VerifyEmail setShowModal={setShowModal} setModalResponse={handleModalResponse} email={email} username={username} mode={"signup"} />
        </Modal.Body>
      </Modal>
    </Box>
  );
}
