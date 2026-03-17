import { Box, Typography, Button, Skeleton } from "@mui/material";
import React, { useEffect, useState, useContext } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import HistoryNewsCard from "../components/HistoryNewsCard";
import { GET } from "../api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DeleteSweepRoundedIcon from "@mui/icons-material/DeleteSweepRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import { ThemeContext } from "../context/ThemeContext";

const History = () => {
  const navigate = useNavigate();
  const [HistoryArray, setHistoryArray] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { mode } = useContext(ThemeContext);

  useEffect(() => {
    const getHistory = async () => {
      setIsLoading(true);
      const response = await GET("/api/history/get");
      if (response.data?.success) {
        setHistoryArray(response.data?.data);
      } else if (response.data?.caught) {
        navigate("/login");
      }
      setIsLoading(false);
    };
    getHistory();
  }, [navigate]);

  const handleRemoveHistory = async () => {
    const response = await GET("/api/history/removeallhistory");
    if (response.data?.success) {
      toast.success(response.data?.message);
      setHistoryArray([]);
    } else if (response.data?.caught) {
      toast.error(response.data?.message);
      navigate("/login");
    }
  };

  return (
    <Box sx={{ overflow: "visible" }}>
      {/* Page header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          pt: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <HistoryRoundedIcon
            sx={{
              fontSize: 28,
              color: mode === "dark" ? "#90CAF9" : "#1E90FF",
            }}
          />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              fontFamily: "'Quicksand', sans-serif",
              color: mode === "dark" ? "#fff" : "#1a1a2e",
            }}
          >
            Browsing History
          </Typography>
        </Box>

        {HistoryArray.length > 0 && (
          <Button
            onClick={handleRemoveHistory}
            variant="outlined"
            startIcon={<DeleteSweepRoundedIcon />}
            sx={{
              fontWeight: 700,
              fontSize: "13px",
              borderRadius: "50px",
              px: 2.5,
              py: 0.6,
              borderWidth: "1.5px",
              borderColor:
                mode === "dark"
                  ? "rgba(255,107,107,0.3)"
                  : "rgba(211,47,47,0.3)",
              color: mode === "dark" ? "#ff6b6b" : "#d32f2f",
              textTransform: "none",
              transition: "all 0.25s ease",
              "&:hover": {
                borderWidth: "1.5px",
                borderColor: mode === "dark" ? "#ff6b6b" : "#d32f2f",
                backgroundColor:
                  mode === "dark"
                    ? "rgba(255,107,107,0.08)"
                    : "rgba(211,47,47,0.04)",
                transform: "translateY(-1px)",
                boxShadow: "0 3px 12px rgba(211,47,47,0.15)",
              },
            }}
          >
            Clear All
          </Button>
        )}
      </Box>

      {isLoading ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "16px",
            padding: "12px 0",
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((_, index) => (
            <Skeleton
              key={index}
              animation="wave"
              variant="rounded"
              height={140}
              sx={{ borderRadius: "12px" }}
            />
          ))}
        </div>
      ) : HistoryArray.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 10,
            gap: 1.5,
          }}
        >
          <HistoryRoundedIcon
            sx={{
              fontSize: 56,
              color:
                mode === "dark"
                  ? "rgba(255,255,255,0.15)"
                  : "rgba(0,0,0,0.1)",
            }}
          />
          <Typography
            sx={{
              fontSize: "1.1rem",
              fontWeight: 600,
              color:
                mode === "dark"
                  ? "rgba(255,255,255,0.4)"
                  : "rgba(0,0,0,0.35)",
              fontFamily: "'Quicksand', sans-serif",
            }}
          >
            No browsing history yet
          </Typography>
        </Box>
      ) : (
        <InfiniteScroll
          dataLength={HistoryArray.length}
          loader={
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                gap: "16px",
                padding: "12px 0",
              }}
            >
              {[1, 2].map((_, i) => (
                <Skeleton
                  key={i}
                  animation="wave"
                  variant="rounded"
                  height={140}
                  sx={{ borderRadius: "12px" }}
                />
              ))}
            </div>
          }
          style={{ overflow: "visible" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: "16px",
              padding: "8px 0",
            }}
          >
            {HistoryArray.map(
              (article, index) =>
                article && (
                  <HistoryNewsCard
                    key={index}
                    title={article.title}
                    link={article.link}
                    time={article.time}
                    setHistoryArray={setHistoryArray}
                  />
                )
            )}
          </div>
        </InfiniteScroll>
      )}
    </Box>
  );
};

export default History;
