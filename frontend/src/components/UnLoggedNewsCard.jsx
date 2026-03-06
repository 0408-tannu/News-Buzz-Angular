import React, { useEffect, useRef, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Tooltip,
  Zoom,
  IconButton,
} from "@mui/material";
import { ThemeContext } from "../context/ThemeContext";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import HeartBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareButton from "@mui/icons-material/Share";
import CommentIcon from "@mui/icons-material/Comment";
import ShareDialog from "./ShareDialog";

const NewsCard = (props) => {
  const { mode } = useContext(ThemeContext);
  const location = useLocation();
  const isSearchPage =
    location.pathname === "/search" || location.pathname === "/myfeed";

  const [showShareDialog, setShowShareDialog] = useState(false);
  const shareDialogRef = useRef(null);
  const navigate = useNavigate();



  const loginPage = () => {
    navigate("/login");
  };

  const handleClickOutside = (event) => {
    if (
      shareDialogRef.current &&
      !shareDialogRef.current.contains(event.target)
    ) {
      setShowShareDialog(false);
    }
  };

  useEffect(() => {
    if (showShareDialog) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showShareDialog]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "stretch",
        justifyContent: "center",
        width: "100%",
        margin: "10px",
        position: "relative",
        "&:hover .action-buttons": {
          opacity: 1,
          visibility: "visible",
        },
        height: "auto",
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            borderRadius: "16px",
            border: mode === "light" ? "1px solid rgba(0,0,0,0.06)" : "1px solid rgba(255,255,255,0.06)",
            boxShadow: mode === "light"
              ? "0 2px 12px rgba(0,0,0,0.06)"
              : "0 2px 12px rgba(0,0,0,0.3)",
            width: "100%",
            backgroundColor:
              mode === "light" ? "#ffffff" : "rgb(40, 40, 40)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              boxShadow: mode === "light"
                ? "0 6px 24px rgba(0,0,0,0.1)"
                : "0 6px 24px rgba(0,0,0,0.5)",
              transform: "translateY(-2px)",
              backgroundColor:
                mode === "light" ? "#ffffff" : "rgb(48, 48, 48)",
            },
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <CardContent sx={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  width: "100%",
                  height: "40px",
                  overflow: "hidden",
                }}
              >
                {isSearchPage ? (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {props.providerImg && (
                      <img
                        src={props.providerImg}
                        alt="Provider Logo"
                        onError={(e) => { e.target.style.display = 'none'; }}
                        style={{
                          maxWidth: "40px",
                          maxHeight: "40px",
                          objectFit: "contain",
                        }}
                      />
                    )}
                    {props.providerName && (
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        style={{ marginLeft: "10px" }}
                      >
                        {props.providerName}
                      </Typography>
                    )}
                  </div>
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    {props.providerImg && (
                      <img
                        src={props.providerImg}
                        alt="Provider Logo"
                        onError={(e) => { e.target.style.display = 'none'; }}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "80%",
                          objectFit: "contain",
                        }}
                      />
                    )}
                  </div>
                )}
              </div>

              <Tooltip title="Read article" placement="top" TransitionComponent={Zoom} arrow>
                <Typography
                  variant="h6"
                  component="div"
                  gutterBottom
                  onClick={loginPage}
                  sx={{
                    cursor: "pointer",
                    color: mode === "light" ? "#1a1a2e" : "rgb(120, 180, 255)",
                    fontWeight: 600,
                    lineHeight: 1.4,
                    transition: "color 0.2s ease",
                    "&:hover": { color: "rgb(30, 144, 255)" },
                  }}
                >
                  {props.title}
                </Typography>
              </Tooltip>

              {props.someText && (
                <Typography variant="body2" sx={{ color: mode === "light" ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.6)", lineHeight: 1.6, mt: 0.5 }}>
                  {props.someText}
                </Typography>
              )}
            </CardContent>

            {props.imgURL && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 2,
                  width: "100%",
                  maxWidth: "150px",
                }}
              >
                <img
                  src={props.imgURL}
                  alt="Article"
                  onError={(e) => { e.target.style.display = 'none'; }}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "150px",
                    objectFit: "cover",
                    borderRadius: "12px",
                  }}
                />
              </Box>
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "flex-start", pl: 2, mt: -1 }}>
              <Typography variant="caption" sx={{ color: mode === "light" ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.45)", fontSize: "0.8rem", fontWeight: 500 }}>
                {props.time}
              </Typography>
            </Box>
            <Box
              className="action-buttons"
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                opacity: 0,
                transition: "opacity 0.2s ease",
                visibility: "hidden",
              }}
            >
              <Tooltip title="Bookmark" arrow>
                <IconButton onClick={loginPage}>
                  <BookmarkBorderIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Like" arrow>
                <IconButton onClick={loginPage}>
                  <HeartBorderIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Comments" arrow>
                <IconButton onClick={loginPage}>
                  <CommentIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Share" arrow>
                <IconButton onClick={() => setShowShareDialog(true)}>
                  <ShareButton />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {showShareDialog && (
            <Box ref={shareDialogRef}>
              <ShareDialog
                open={showShareDialog}
                onClose={() => setShowShareDialog(false)}
                link={props.link}
              />
            </Box>
          )}
        </Card>
      </Box>
    </Box>
  );
};

export default NewsCard;