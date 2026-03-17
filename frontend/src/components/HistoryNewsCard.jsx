// import {
//   Box,
//   Card,
//   CardContent,
//   IconButton,
//   Tooltip,
//   Typography,
// } from "@mui/material";
// import { BookmarkIcon, HeartIcon } from "lucide-react";
// import React from "react";
// import InsertCommentRoundedIcon from "@mui/icons-material/InsertCommentRounded";
// import ShareButton from "@mui/icons-material/Share";
// const HistoryNewsCard = (props) => {


//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   return (
//     <>
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           margin: "20px",
//           width: "100%",
//           height: "auto",
//           maxWidth: 800,
//           maxHeight: 800,
//           // backgroundColor: "black",
//         }}
//       >
//         <Card
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             border: "none",
//             boxShadow: "none",
//             width: "900px",
//             height: "100%",
//             backgroundColor: "gray",
//           }}
//         >
//           <Box sx={{ display: "flex", flexDirection: "row" }}>
//             <CardContent sx={{ flex: 1 }}>
//               {/* Provider Image and Name */}
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "flex-start",
//                   alignItems: "center",
//                   width: "100%",
//                   height: "40px",
//                   overflow: "hidden",
//                 }}
//               >
//                 <div style={{ display: "flex", alignItems: "center" }}>
//                   {props.providerImg && (
//                     <img
//                       src={props.providerImg}
//                       alt="Provider Logo"
//                       style={{
//                         maxWidth: "40px",
//                         maxHeight: "40px",
//                         objectFit: "contain",
//                       }}
//                     />
//                   )}
//                   {props.providerName && (
//                     <Typography
//                       variant="subtitle2"
//                       color="text.secondary"
//                       style={{ marginLeft: "10px" }}
//                     >
//                       {props.providerName}
//                     </Typography>
//                   )}
//                 </div>
//               </div>

//               {/* Title with Tooltip */}
//               <Tooltip
//                 title="click"
//                 placement="top"
//                 //   TransitionComponent={Zoom}
//                 arrow
//               >
//                 <Typography
//                   variant="h6"
//                   component="div"
//                   gutterBottom
//                   // onClick={handleClick}
//                   sx={{
//                     cursor: "pointer",
//                     color: "rgb(30, 144, 255)",
//                     //   "&:hover": { color: mode === "light" ? "blue" : "white" },
//                   }}
//                 >
//                   {props.title}
//                 </Typography>
//               </Tooltip>

//               {/* Some Text */}
//               {props.someText && (
//                 <Typography variant="body2" color="text.secondary">
//                   {props.someText}
//                 </Typography>
//               )}
//             </CardContent>

//             {/* Article Image */}
//             {props.imgURL && (
//               <Box
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   padding: 2,
//                 }}
//               >
//                 <img
//                   src={props.imgURL}
//                   alt="Article"
//                   style={{
//                     maxWidth: "150px",
//                     maxHeight: "150px",
//                     objectFit: "cover",
//                   }}
//                 />
//               </Box>
//             )}
//           </Box>

//           {/* Time Display */}
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//             }}
//           >
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "flex-start",
//                 pl: 2,
//                 mt: -1,
//               }}
//             >
//               <Typography
//                 variant="caption"
//                 color="text.secondary"
//                 fontSize="medium"
//               >
//                 {formatDate(props.time)}
//               </Typography>
//             </Box>
//             <Box
//               className="action-buttons"
//               sx={{
//                 // position: 'absolute',
//                 // right: 0,
//                 // top: '50%',
//                 // transform: 'translateY(-50%)',
//                 display: "flex",
//                 justifyContent: "flex-end",
//                 alignItems: "center",
//                 // flexDirection: 'column',
//                 opacity: 0,
//                 // visibility: 'hidden',
//                 transition: "opacity 0.2s ease-in-out",
//               }}
//             >
//               <Tooltip title="Save" placement="bottom" arrow>
//                 <IconButton
//                   sx={{
//                     height: "48px",
//                     width: "48px",
//                     alignSelf: "center",
//                     marginBottom: "8px",
//                   }}
//                   aria-label="save"
//                 // onClick={handleBookmarkClick}
//                 >
//                   <BookmarkIcon
//                     sx={{ fontSize: "28px", color: "primary.main" }}
//                   />
//                 </IconButton>
//               </Tooltip>

//               <Tooltip title="Like" placement="bottom" arrow>
//                 <Box
//                   sx={{
//                     display: "flex",
//                     flexDirection: "column",
//                     alignItems: "center",
//                   }}
//                 >
//                   <IconButton
//                     sx={{
//                       height: "48px",
//                       width: "48px",
//                       alignSelf: "center",
//                       marginBottom: "4px",
//                     }}
//                     aria-label="like"
//                   //   onClick={handleLikeClick}
//                   >
//                     <HeartIcon sx={{ fontSize: "28px", color: "red" }} />
//                   </IconButton>
//                 </Box>
//               </Tooltip>

//               <Tooltip title="Comments" placement="bottom" arrow>
//                 <Box
//                   sx={{
//                     display: "flex",
//                     flexDirection: "column",
//                     alignItems: "center",
//                   }}
//                 >
//                   <IconButton
//                     sx={{
//                       height: "48px",
//                       width: "48px",
//                       alignSelf: "center",
//                       marginBottom: "8px",
//                     }}
//                     aria-label="comments"
//                   //   onClick={handleCommentsClick}
//                   >
//                     <InsertCommentRoundedIcon sx={{ fontSize: "28px" }} />
//                   </IconButton>
//                 </Box>
//               </Tooltip>

//               <Tooltip title="Share" placement="bottom" arrow>
//                 <IconButton
//                   sx={{
//                     height: "48px",
//                     width: "48px",
//                     alignSelf: "center",
//                   }}
//                   aria-label="share"
//                 // onClick={() => setShowShareDialog(true)}
//                 >
//                   <ShareButton sx={{ fontSize: "28px" }} />
//                 </IconButton>
//               </Tooltip>
//             </Box>
//           </Box>
//         </Card>
//       </Box>
//     </>
//   );
// };

// export default HistoryNewsCard;

import {
  Box,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Typography,
  Zoom,
} from "@mui/material";
import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import AutoDeleteRoundedIcon from '@mui/icons-material/AutoDeleteRounded';
import { POST } from '../api'
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const HistoryNewsCard = (props) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const { mode } = useContext(ThemeContext);

  const navigate = useNavigate();
  const handleDeleteClick = async () => {

    const response = await POST("/api/history/remove", { baseURL: props.link });

    if (response.data?.success) {
      toast.success(response.data?.message);
      // window.location.reload();

      props.setHistoryArray((prev) => { return prev.filter((item) => item._id !== props._id) } );
    }
    else if (response.data?.caught) {
      // window.location.reload();
      navigate("/login");
    }
    else {
      toast.error(response.data?.message);
    }
  }


  const handleClick = () => {
    window.open(props.link, "_blank");
  };



  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "stretch",
        width: "100%",
        position: "relative",
        "&:hover .action-buttons": {
          opacity: 1,
          visibility: "visible",
        },
      }}
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRadius: "14px",
          border: mode === "light" ? "1px solid rgba(0,0,0,0.06)" : "1px solid rgba(255,255,255,0.06)",
          boxShadow: mode === "light"
            ? "0 2px 10px rgba(0,0,0,0.05)"
            : "0 2px 10px rgba(0,0,0,0.25)",
          width: "100%",
          backgroundColor: mode === "light" ? "#fff" : "rgb(40, 40, 40)",
          transition: "all 0.25s ease",
          "&:hover": {
            boxShadow: mode === "light"
              ? "0 4px 20px rgba(0,0,0,0.08)"
              : "0 4px 20px rgba(0,0,0,0.4)",
            transform: "translateY(-2px)",
          },
        }}
      >
        <CardContent sx={{ pb: '8px !important', pt: 2, px: 2 }}>
          <Tooltip
            title="Open article"
            placement="top"
            TransitionComponent={Zoom}
            arrow
          >
            <Typography
              variant="h6"
              component="div"
              onClick={handleClick}
              sx={{
                cursor: "pointer",
                color: mode === "light" ? "#1a1a2e" : "rgba(255,255,255,0.92)",
                fontWeight: 700,
                fontSize: "0.95rem",
                lineHeight: 1.45,
                mb: 0.5,
                transition: "color 0.2s ease",
                "&:hover": { color: "#1E90FF" },
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {props.title}
            </Typography>
          </Tooltip>
        </CardContent>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
            pb: 1.5,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: mode === "light" ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)",
              fontSize: "0.82rem",
              fontWeight: 500,
            }}
          >
            {formatDate(props.time)}
          </Typography>

          <Box
            className="action-buttons"
            sx={{
              display: "flex",
              alignItems: "center",
              opacity: 0,
              transition: "opacity 0.2s ease",
              visibility: "hidden",
            }}
          >
            <Tooltip title="Remove from history" placement="bottom" arrow>
              <IconButton
                size="small"
                aria-label="delete"
                onClick={handleDeleteClick}
                sx={{
                  color: mode === "dark" ? "#ff6b6b" : "#d32f2f",
                  '&:hover': {
                    backgroundColor: mode === "dark" ? "rgba(255,107,107,0.1)" : "rgba(211,47,47,0.06)",
                  },
                }}
              >
                <AutoDeleteRoundedIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default HistoryNewsCard;