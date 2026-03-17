import React, { useEffect, useState, useContext } from 'react';
import {
  Card,
  CardContent,
  IconButton,
  Typography,
  Button,
  Menu,
  MenuItem,
  Box,
} from '@mui/material';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import VolumeOffRoundedIcon from '@mui/icons-material/VolumeOffRounded';
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded';
import { POST } from '../api';
import { toast } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';

const NewsProviderCard = ({ name, logoUrl, baseURL, provider, onUnfollow }) => {
  const { mode } = useContext(ThemeContext);
  const [isFollowing, setIsFollowing] = useState();
  const [isShrinking, setIsShrinking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const HandleSeeArticles = () => {
    let myURL = baseURL.replace(/^https?:\/\//, '');
    myURL = `${window.location.origin}/search?site=${myURL}`;
    window.open(myURL, '_blank');
    handleClose();
  };

  const HandleGoToSite = () => {
    window.open(baseURL, '_blank');
    handleClose();
  };

  const HandleMute = async () => {
    try {
      const endpoint = isMuted ? '/api/mute/remove' : '/api/mute/add';
      const payload = { baseURL: baseURL };
      const response = await POST(endpoint, payload);
      if (response.data?.success === true) {
        setIsMuted((prev) => !prev);
        toast.success(isMuted ? 'Unmuted successfully!' : 'Muted successfully!');
      } else if (response.data?.caught) {
        navigate("/login");
      } else {
        toast.error('Something went wrong, please try again later.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
    handleClose();
  };

  useEffect(() => {
    const checkFollow = async () => {
      try {
        const response = await POST('/api/userdo/isfollowed', { baseURL: baseURL });
        if (response.data?.success) {
          setIsFollowing(response.data.isFollowing);
        } else if (response.data?.caught) {
          navigate("/login");
        }
      } catch (error) {
        console.error('Failed to check follow status:', error);
      }
    };
    checkFollow();
  }, [baseURL, navigate]);

  useEffect(() => {
    const checkMuted = async () => {
      try {
        const response = await POST('/api/mute/get', { baseURL: baseURL });
        if (response.data?.success) {
          setIsMuted(response.data.isMuted);
        } else if (response.data?.caught) {
          navigate("/login");
        }
      } catch (error) {
        console.error('Failed to check mute status:', error);
      }
    };
    checkMuted();
  }, [baseURL, navigate]);

  const toggleFollow = async () => {
    try {
      const endpoint = isFollowing ? '/api/userdo/unfollow' : '/api/userdo/follow';
      const payload = { baseURL: baseURL };
      const response = await POST(endpoint, payload);
      if (response.data?.success === true) {
        setIsFollowing((prev) => !prev);
        toast.success(isFollowing ? 'Unfollowed successfully!' : 'Followed successfully!');
        if (isFollowing && provider === "following") {
          setIsShrinking(true);
          setTimeout(() => {
            onUnfollow();
          }, 400);
        }
      } else if (response.data?.caught) {
        navigate("/login");
      } else {
        toast.error('Something went wrong, please try again later.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: '18px',
        border: mode === 'light' ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.06)',
        boxShadow: mode === 'light'
          ? '0 2px 12px rgba(0,0,0,0.05)'
          : '0 2px 12px rgba(0,0,0,0.25)',
        backgroundColor: mode === 'light' ? '#fff' : 'rgb(40, 40, 40)',
        position: 'relative',
        overflow: 'visible',
        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isShrinking ? 'scale(0) translateY(20px)' : 'scale(1) translateY(0)',
        opacity: isShrinking ? 0 : 1,
        height: isShrinking ? 0 : 'auto',
        '&:hover': {
          transform: isShrinking ? 'scale(0)' : 'translateY(-4px)',
          boxShadow: mode === 'light'
            ? '0 8px 30px rgba(30,144,255,0.12)'
            : '0 8px 30px rgba(0,0,0,0.4)',
        },
      }}
    >
      {/* Menu Button */}
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{
          position: 'absolute',
          right: 10,
          top: 10,
          color: mode === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)',
          '&:hover': {
            color: '#1E90FF',
            backgroundColor: 'rgba(30,144,255,0.08)',
          },
        }}
      >
        <MoreHorizRoundedIcon sx={{ fontSize: 20 }} />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: '14px',
            bgcolor: mode === 'dark' ? '#2a2a2a' : '#fff',
            boxShadow: mode === 'dark'
              ? '0 8px 32px rgba(0,0,0,0.5)'
              : '0 8px 32px rgba(0,0,0,0.12)',
            border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}`,
            py: 0.5,
            minWidth: 180,
          },
        }}
      >
        <MenuItem
          onClick={HandleSeeArticles}
          sx={{
            fontSize: '14px',
            fontWeight: 600,
            fontFamily: "'Quicksand', sans-serif",
            borderRadius: '8px',
            mx: 0.5,
            gap: 1.5,
            py: 1,
            '&:hover': { backgroundColor: 'rgba(30,144,255,0.08)' },
          }}
        >
          <ArticleRoundedIcon sx={{ fontSize: 18, color: '#1E90FF' }} />
          See Articles
        </MenuItem>
        <MenuItem
          onClick={HandleGoToSite}
          sx={{
            fontSize: '14px',
            fontWeight: 600,
            fontFamily: "'Quicksand', sans-serif",
            borderRadius: '8px',
            mx: 0.5,
            gap: 1.5,
            py: 1,
            '&:hover': { backgroundColor: 'rgba(30,144,255,0.08)' },
          }}
        >
          <OpenInNewRoundedIcon sx={{ fontSize: 18, color: '#1E90FF' }} />
          Visit Website
        </MenuItem>
        <MenuItem
          onClick={HandleMute}
          sx={{
            fontSize: '14px',
            fontWeight: 600,
            fontFamily: "'Quicksand', sans-serif",
            borderRadius: '8px',
            mx: 0.5,
            gap: 1.5,
            py: 1,
            color: isMuted ? '#FF6B6B' : undefined,
            '&:hover': { backgroundColor: isMuted ? 'rgba(255,107,107,0.08)' : 'rgba(30,144,255,0.08)' },
          }}
        >
          {isMuted ? (
            <VolumeOffRoundedIcon sx={{ fontSize: 18 }} />
          ) : (
            <VolumeUpRoundedIcon sx={{ fontSize: 18, color: '#1E90FF' }} />
          )}
          {isMuted ? "Unmute" : "Mute"}
        </MenuItem>
      </Menu>

      <CardContent sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        pt: 3.5,
        pb: '16px !important',
        px: 2.5,
      }}>
        {/* Logo Container */}
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
            overflow: 'hidden',
            background: mode === 'dark'
              ? 'rgba(255,255,255,0.06)'
              : 'rgba(0,0,0,0.03)',
            border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`,
            p: 1.5,
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={`${name} logo`}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                height: '100%',
                width: '100%',
              }}
            />
          ) : (
            <Typography sx={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)',
            }}>
              No Logo
            </Typography>
          )}
        </Box>

        {/* Provider Name */}
        <Typography
          sx={{
            textAlign: 'center',
            mb: 2,
            fontWeight: 700,
            fontSize: '0.95rem',
            fontFamily: "'Quicksand', sans-serif",
            color: mode === 'dark' ? '#fff' : '#1a1a2e',
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {name}
        </Typography>

        {/* Follow Button */}
        <Button
          variant={isFollowing ? "outlined" : "contained"}
          size="small"
          onClick={toggleFollow}
          sx={{
            width: '100%',
            borderRadius: '50px',
            textTransform: 'none',
            fontWeight: 700,
            fontSize: '13px',
            py: 0.8,
            fontFamily: "'Quicksand', sans-serif",
            transition: 'all 0.25s ease',
            ...(isFollowing ? {
              borderColor: mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
              color: mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
              borderWidth: '1.5px',
              '&:hover': {
                borderColor: '#FF6B6B',
                color: '#FF6B6B',
                backgroundColor: 'rgba(255,107,107,0.06)',
                borderWidth: '1.5px',
              },
            } : {
              background: 'linear-gradient(135deg, #1E90FF 0%, #0055CC 100%)',
              boxShadow: '0 2px 8px rgba(30,144,255,0.25)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4DA8FF 0%, #1E90FF 100%)',
                boxShadow: '0 4px 16px rgba(30,144,255,0.35)',
                transform: 'translateY(-1px)',
              },
            }),
          }}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default NewsProviderCard;
