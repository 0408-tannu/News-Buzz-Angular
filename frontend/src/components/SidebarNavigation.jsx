import React, { useContext, useEffect } from "react";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, useLocation } from "react-router-dom";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ThemeContext } from "../context/ThemeContext";
import feedImgDark from "../images/feed_dark.png";
import feedImgLight from "../images/feed_light.png";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import following_light from "../images/following_light.png";
import following_dark from "../images/following_dark.png";

const SidebarNavigation = ({ open, setOpen }) => {
  const { mode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [loggedIn, setLoggedIn] = React.useState(false);

  const toggleDrawer = (state) => () => setOpen(state);
  const feedImg = mode === "light" ? feedImgDark : feedImgLight;
  const followingImg = mode === "light" ? following_light : following_dark;

  useEffect(() => {
    if (window.localStorage.getItem("token") === null) {
      setLoggedIn(false);
    } else {
      setLoggedIn(true);
    }
  }, []);

  const loginPage = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    window.localStorage.removeItem("token");
    navigate("/login");
  };

  const NAVIGATION = [
    { title: "Home", icon: <HomeRoundedIcon />, path: "/" },
    { title: "Feed", icon: "feedImg", path: "/myfeed" },
    { title: "Following", icon: "followingImg", path: "/providers/following" },
    { title: "Bookmark", icon: <BookmarkRoundedIcon />, path: "/bookmark" },
    { title: "History", icon: <HistoryRoundedIcon />, path: "/history" },
    { kind: "divider" },
  ];

  const iconSize = 28;

  return (
    <>
      <Toolbar>
        <IconButton
          onClick={toggleDrawer(!open)}
          sx={{
            position: "fixed",
            top: 10,
            left: 10,
            zIndex: 1300,
            backgroundColor: mode === "dark" ? "#333" : "#fff",
            color: mode === "dark" ? "#fff" : "#333",
            "&:hover": {
              backgroundColor: mode === "dark" ? "#555" : "#eee",
            },
            transition: "background-color 0.3s ease",
          }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      <Drawer
        variant="permanent"
        open={true}
        sx={{
          width: open ? 220 : 64,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? 220 : 64,
            boxSizing: "border-box",
            background: mode === "dark" ? "#1a1a1a" : "#ffffff",
            color: mode === "dark" ? "#fff" : "#000",
            borderRight: `1px solid ${mode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
            transition: "width 0.3s ease",
            overflowX: "hidden",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Toolbar />

        {/* Main navigation items */}
        <List sx={{ flex: 1, px: open ? 1 : 0.5, pt: 1 }}>
          {NAVIGATION.map((item, index) =>
            item.kind === "divider" ? (
              <Divider
                key={index}
                sx={{ borderColor: mode === "dark" ? "#444" : "#ddd", my: 1 }}
              />
            ) : (
              <ListItemButton
                key={item.title}
                onClick={loggedIn ? () => navigate(item.path) : loginPage}
                selected={location.pathname === item.path}
                sx={{
                  "&:hover": {
                    backgroundColor: mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)",
                  },
                  "&.Mui-selected": {
                    backgroundColor: mode === "dark" ? "rgba(30,144,255,0.15)" : "rgba(30,144,255,0.1)",
                    borderRight: "3px solid rgb(30,144,255)",
                    "&:hover": {
                      backgroundColor: mode === "dark" ? "rgba(30,144,255,0.2)" : "rgba(30,144,255,0.15)",
                    },
                  },
                  py: 1.2,
                  px: open ? 2 : 0,
                  mb: 0.5,
                  borderRadius: "8px",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: open ? "flex-start" : "center",
                }}
              >
                <Tooltip title={!open ? item.title : ""} placement="right">
                  <ListItemIcon
                    sx={{
                      color: mode === "dark" ? "#fff" : "#000",
                      minWidth: 0,
                      width: iconSize + 8,
                      mr: open ? 2 : 0,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {item.icon === "feedImg" ? (
                      <img
                        src={feedImg}
                        alt="feed icon"
                        style={{ width: iconSize, height: iconSize, display: "block" }}
                      />
                    ) : item.icon === "followingImg" ? (
                      <img
                        src={followingImg}
                        alt="following icon"
                        style={{ width: iconSize, height: iconSize, display: "block" }}
                      />
                    ) : (
                      React.cloneElement(item.icon, {
                        sx: { fontSize: iconSize },
                      })
                    )}
                  </ListItemIcon>
                </Tooltip>
                {open && (
                  <ListItemText
                    primary={item.title}
                    primaryTypographyProps={{
                      sx: {
                        fontWeight: 500,
                        fontSize: "0.95rem",
                        whiteSpace: "nowrap",
                      },
                    }}
                    sx={{
                      color: mode === "dark" ? "#fff" : "#000",
                      m: 0,
                    }}
                  />
                )}
              </ListItemButton>
            )
          )}
        </List>

        {/* Bottom section: Settings (theme toggle) & Logout */}
        <Box sx={{ px: open ? 1 : 0.5, pb: 2 }}>
          <Divider sx={{ borderColor: mode === "dark" ? "#444" : "#ddd", mb: 1 }} />

          {/* Theme Toggle */}
          <ListItemButton
            onClick={toggleTheme}
            sx={{
              "&:hover": {
                backgroundColor: mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)",
              },
              py: 1.2,
              px: open ? 2 : 0,
              mb: 0.5,
              borderRadius: "8px",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: open ? "flex-start" : "center",
            }}
          >
            <Tooltip title={!open ? (mode === "dark" ? "Light Mode" : "Dark Mode") : ""} placement="right">
              <ListItemIcon
                sx={{
                  color: mode === "dark" ? "#fff" : "#000",
                  minWidth: 0,
                  width: iconSize + 8,
                  mr: open ? 2 : 0,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {mode === "dark" ? (
                  <Brightness7Icon sx={{ fontSize: iconSize }} />
                ) : (
                  <Brightness4Icon sx={{ fontSize: iconSize }} />
                )}
              </ListItemIcon>
            </Tooltip>
            {open && (
              <ListItemText
                primary={mode === "dark" ? "Light Mode" : "Dark Mode"}
                primaryTypographyProps={{
                  sx: {
                    fontWeight: 500,
                    fontSize: "0.95rem",
                    whiteSpace: "nowrap",
                  },
                }}
                sx={{
                  color: mode === "dark" ? "#fff" : "#000",
                  m: 0,
                }}
              />
            )}
          </ListItemButton>

          {/* Logout */}
          <ListItemButton
            onClick={handleLogout}
            sx={{
              "&:hover": {
                backgroundColor: mode === "dark" ? "rgba(255,107,107,0.1)" : "rgba(211,47,47,0.06)",
              },
              py: 1.2,
              px: open ? 2 : 0,
              mb: 0.5,
              borderRadius: "8px",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: open ? "flex-start" : "center",
            }}
          >
            <Tooltip title={!open ? "Logout" : ""} placement="right">
              <ListItemIcon
                sx={{
                  color: mode === "dark" ? "#ff6b6b" : "#d32f2f",
                  minWidth: 0,
                  width: iconSize + 8,
                  mr: open ? 2 : 0,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <LogoutRoundedIcon sx={{ fontSize: iconSize }} />
              </ListItemIcon>
            </Tooltip>
            {open && (
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{
                  sx: {
                    fontWeight: 500,
                    fontSize: "0.95rem",
                    whiteSpace: "nowrap",
                    color: mode === "dark" ? "#ff6b6b" : "#d32f2f",
                  },
                }}
                sx={{ m: 0 }}
              />
            )}
          </ListItemButton>
        </Box>
      </Drawer>
    </>
  );
};

export default SidebarNavigation;