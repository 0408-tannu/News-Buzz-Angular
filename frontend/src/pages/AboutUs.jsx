import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { Box, Typography } from '@mui/material';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import GroupsIcon from '@mui/icons-material/Groups';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';
import DevicesIcon from '@mui/icons-material/Devices';

const AboutUs = () => {
  const { mode } = useContext(ThemeContext);

  const cardStyle = {
    backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.06)' : '#fff',
    borderRadius: '20px',
    padding: '32px',
    boxShadow: mode === 'dark'
      ? '0 4px 24px rgba(0,0,0,0.3)'
      : '0 4px 24px rgba(0,0,0,0.08)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'default',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: mode === 'dark'
        ? '0 8px 32px rgba(30,144,255,0.2)'
        : '0 8px 32px rgba(30,144,255,0.15)',
    },
  };

  const featureCardStyle = {
    backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(30,144,255,0.04)',
    borderRadius: '16px',
    padding: '24px',
    textAlign: 'center',
    border: mode === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(30,144,255,0.1)',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: mode === 'dark' ? 'rgba(30,144,255,0.1)' : 'rgba(30,144,255,0.08)',
      transform: 'translateY(-2px)',
    },
  };

  const features = [
    { icon: <TrendingUpIcon sx={{ fontSize: 40, color: '#22C55E' }} />, title: 'Trending News', desc: 'Stay updated with real-time trending stories from around the globe.' },
    { icon: <SecurityIcon sx={{ fontSize: 40, color: '#EF4444' }} />, title: 'Trusted Sources', desc: 'We aggregate only from verified and reputable news providers.' },
    { icon: <DevicesIcon sx={{ fontSize: 40, color: '#F59E0B' }} />, title: 'Any Device', desc: 'Read news seamlessly on desktop, tablet, or mobile.' },
  ];

  return (
    <div style={{ padding: '0', maxWidth: '1100px', margin: '0 auto 60px' }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography
          variant="h3"
          sx={{
            fontFamily: "'Quicksand', sans-serif",
            fontWeight: 800,
            mb: 2,
            color: mode === 'dark' ? '#fff' : '#1a1a2e',
            fontSize: { xs: '2rem', md: '2.8rem' },
          }}
        >
          About <span style={{ background: 'linear-gradient(135deg, rgb(30,144,255), rgb(0,100,200))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>NewsBuzz</span>
        </Typography>

        <Typography
          sx={{
            fontFamily: "'Quicksand', sans-serif",
            fontWeight: 400,
            fontSize: '1.25rem',
            color: mode === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)',
            maxWidth: '650px',
            margin: '0 auto',
            lineHeight: 1.8,
          }}
        >
          Your one-stop destination for curated, real-time news from trusted sources around the world.
          We bring the stories that matter most — right to your fingertips.
        </Typography>
      </Box>

      {/* Main Cards */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px', mb: 6 }}>
        <Box sx={cardStyle}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: '12px', background: 'linear-gradient(135deg, rgba(30,144,255,0.15), rgba(30,144,255,0.05))' }}>
              <NewspaperIcon sx={{ fontSize: 32, color: 'rgb(30, 144, 255)' }} />
            </Box>
            <Typography variant="h5" sx={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, color: mode === 'dark' ? '#fff' : '#1a1a2e' }}>
              What We Do
            </Typography>
          </Box>
          <Typography sx={{ fontFamily: "'Quicksand', sans-serif", fontSize: '18px', lineHeight: 1.9, color: mode === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.65)' }}>
            NewsBuzz aggregates news from hundreds of trusted providers, delivering top stories, trending topics,
            and personalized feeds right to your fingertips. We use smart algorithms to bring you the news that
            matters most — whether it's world events, technology, sports, or entertainment.
          </Typography>
        </Box>

        <Box sx={cardStyle}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: '12px', background: 'linear-gradient(135deg, rgba(30,144,255,0.15), rgba(30,144,255,0.05))' }}>
              <RocketLaunchIcon sx={{ fontSize: 32, color: 'rgb(30, 144, 255)' }} />
            </Box>
            <Typography variant="h5" sx={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, color: mode === 'dark' ? '#fff' : '#1a1a2e' }}>
              Our Mission
            </Typography>
          </Box>
          <Typography sx={{ fontFamily: "'Quicksand', sans-serif", fontSize: '18px', lineHeight: 1.9, color: mode === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.65)' }}>
            We believe everyone deserves access to unbiased, high-quality news. Our mission is to cut through the
            noise and deliver clear, reliable information from diverse perspectives — all in one beautiful,
            easy-to-use platform. No clutter, no bias, just the news you need.
          </Typography>
        </Box>

        <Box sx={cardStyle}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: '12px', background: 'linear-gradient(135deg, rgba(30,144,255,0.15), rgba(30,144,255,0.05))' }}>
              <GroupsIcon sx={{ fontSize: 32, color: 'rgb(30, 144, 255)' }} />
            </Box>
            <Typography variant="h5" sx={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, color: mode === 'dark' ? '#fff' : '#1a1a2e' }}>
              Our Team
            </Typography>
          </Box>
          <Typography sx={{ fontFamily: "'Quicksand', sans-serif", fontSize: '18px', lineHeight: 1.9, color: mode === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.65)' }}>
            NewsBuzz is built by a passionate team of developers and news enthusiasts who care about keeping the
            world informed. We're constantly improving our platform with new features, better algorithms, and a
            smoother experience — because you deserve the best.
          </Typography>
        </Box>
      </Box>

      {/* Features Grid */}
      <Typography
        variant="h4"
        sx={{
          fontFamily: "'Quicksand', sans-serif",
          fontWeight: 700,
          textAlign: 'center',
          mb: 4,
          color: mode === 'dark' ? '#fff' : '#1a1a2e',
        }}
      >
        Why Choose <span style={{ color: 'rgb(30,144,255)' }}>NewsBuzz?</span>
      </Typography>

      <Box sx={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {features.map((feature, idx) => (
          <Box key={idx} sx={{ ...featureCardStyle, flex: '1 1 280px', maxWidth: '340px' }}>
            <Box sx={{ mb: 2 }}>{feature.icon}</Box>
            <Typography sx={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, fontSize: '1.25rem', mb: 1, color: mode === 'dark' ? '#fff' : '#1a1a2e' }}>
              {feature.title}
            </Typography>
            <Typography sx={{ fontFamily: "'Quicksand', sans-serif", fontSize: '16px', color: mode === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.55)', lineHeight: 1.6 }}>
              {feature.desc}
            </Typography>
          </Box>
        ))}
      </Box>
    </div>
  );
};

export default AboutUs;
