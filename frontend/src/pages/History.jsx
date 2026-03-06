import { Box, Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import HistoryNewsCard from "../components/HistoryNewsCard";
import { GET } from "../api";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import toast from "react-hot-toast";



const History = () => {

  const navigate = useNavigate();
  const [HistoryArray, setHistoryArray] = useState([]);


  useEffect(() => {
    const getHistory = async () => {
      const response = await GET("/api/history/get");

      if (response.data?.success) {
        setHistoryArray(response.data?.data);
      } else if (response.data?.caught) {
        navigate("/login");
      } else {
        console.log(response.data?.message);
      }
    };

    getHistory();
  }, [navigate, setHistoryArray, HistoryArray]);  // have to add HistoryArray for localhost.


  const handleRemoveHistory = async () => {

    const response = await GET("/api/history/removeallhistory");

    if (response.data?.success) {
      toast.success(response.data?.message);
      setHistoryArray([]);
    } else if (response.data?.caught) {
      toast.error(response.data?.message);
      navigate("/login");
    }
    else {
      console.log(response.message);
    }

  }



  return (
    <>

      <Box sx={{ justifyContent: "center", display: "flex", mt: "130px" }}>
        <Button onClick={handleRemoveHistory}>
          <h1>Delete History</h1>
        </Button>
      </Box >
      <div
        style={{
          overflow: "visible",
          // marginTop: "130px",
          //   backgroundColor: "black"
        }}
      >
        <InfiniteScroll
          dataLength={HistoryArray.length}
          //   next={loadMoreArticles}
          //   hasMore={hasMore}
          loader={
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "20px",
              }}
            >
              <Skeleton
                animation="wave"
                variant="rounded"
                width={800}
                height={140}
              />
            </div>
          }
          style={{ overflow: "visible" }}
        >
          <div style={{ marginTop: "50px", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px", padding: "0 20px" }}>
                  {HistoryArray.map(
                    (article, index) =>
                      article && (
                        <HistoryNewsCard
                          key={index}
                          title={article.title}
                          link={article.link}
                          time={article.time}
                          setHistoryArray={setHistoryArray}
                        // providerImg={article.providerImg}
                        // providerName={article.providerName}
                        />
                      )
                  )}
          </div>
        </InfiniteScroll>
      </div>
    </>
  );
};

export default History;
