import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import VpnKeyRoundedIcon from "@mui/icons-material/VpnKeyRounded";
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import config from "../config";
import CryptoJS from 'crypto-js';
import { POST } from '../api';
import { Modal } from 'react-bootstrap';
import ForgotPassword from "../components/ForgotPassword";
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

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [justVerify, setJustVerify] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailUsername, setEmailUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handlePasswordofLogin = (e) => {
    const input = e.target.value;
    setPassword(input);
    setValidPassword(input.length >= 8);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setJustVerify(true);

    if (
      emailUsername === "" ||
      password === "" ||
      emailUsername.length >= 255 ||
      password.length > 255
    ) {
      return;
    }
    setLoading(true);
    const encryptedPassword = CryptoJS.AES.encrypt(password, config.PWD_SECRET).toString();

    const loginDetails = {
      role: "READER",
      email: emailUsername,
      password: encryptedPassword,
    };

    try {
      const result = await POST('/api/user/login', loginDetails);
      if (result.data?.success) {
        window.localStorage.setItem('token', result.data.token);
        toast.success("Logged in successfully");
        window.location.href = '/';
      } else {
        toast.error(result.data?.message);
      }
    } catch (err) {
      toast.error("Error occurred!");
    }
    setLoading(false);
  };

  const [showModal, setShowModal] = useState(false);

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
      }}
    >
      {/* Subtle background decoration */}
      <Box sx={{
        position: 'absolute',
        top: '10%',
        right: '15%',
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(30,144,255,0.08) 0%, transparent 70%)',
        filter: 'blur(40px)',
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: '15%',
        left: '10%',
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
          Welcome back
        </Typography>

        <Typography sx={{
          fontFamily: "'Quicksand', sans-serif",
          fontWeight: 500,
          fontSize: '0.9rem',
          color: 'rgba(0,0,0,0.45)',
          mb: 3,
        }}>
          Sign in to continue to NewsBuzz
        </Typography>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              value={emailUsername}
              onChange={(e) => setEmailUsername(e.target.value)}
              label="Email"
              placeholder="you@example.com"
              variant="outlined"
              fullWidth
              required
              size="small"
              autoComplete="on"
              error={justVerify && (emailUsername === "" || emailUsername.length >= 255)}
              helperText={justVerify && emailUsername === "" ? "This field cannot be empty." : ""}
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
              onChange={handlePasswordofLogin}
              label="Password"
              placeholder="Enter your password"
              variant="outlined"
              name="password"
              type={showPassword ? "text" : "password"}
              fullWidth
              required
              size="small"
              autoComplete="on"
              error={justVerify && (!validPassword || password === "" || password.length >= 255)}
              helperText={
                justVerify && (password === ""
                  ? "This field cannot be empty."
                  : !validPassword
                    ? "Password must be at least 8 characters."
                    : "")
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

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: -1 }}>
              <Button
                variant="text"
                onClick={() => setShowModal(true)}
                sx={{
                  fontFamily: "'Quicksand', sans-serif",
                  fontWeight: 700,
                  fontSize: '0.8rem',
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
                Forgot password?
              </Button>
            </Box>

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
                "Log In"
              )}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 1 }}>
              <Typography component="span" sx={{
                fontFamily: "'Quicksand', sans-serif",
                fontWeight: 500,
                fontSize: '0.88rem',
                color: 'rgba(0,0,0,0.45)',
              }}>
                Don't have an account?{' '}
              </Typography>
              <Button
                variant="text"
                onClick={() => navigate("/signup")}
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
                Sign Up
              </Button>
            </Box>
          </Box>
        </form>
      </Box>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Forgot password
          </Typography>
        </Modal.Header>
        <Modal.Body>
          <ForgotPassword setShowModal={setShowModal} />
        </Modal.Body>
      </Modal>
    </Box>
  );
}
