import React, { useEffect, useState, useContext } from 'react';
import {
  Container,
  Grid,
  Typography,
  Skeleton,
  Box
} from '@mui/material';
import NewsProviderCard from '../components/NewsProviderCard.jsx';
import { GET } from '../api.js';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';

const NewsProviderPageAll = (props) => {
  const [providers, setProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { mode } = useContext(ThemeContext);
  useEffect(() => {
    const fetchProviders = async () => {

      setIsLoading(true);
      try {
        const result = await GET('/api/provider/get_all_providers');
        if (result.data?.success) {
          setProviders(result.data.providers);
        }
        else if (result.data?.caught) {
          // toast.error(result.data?.message);
          navigate('/login'); return;
        }
        else {

          console.log('error');
        }
      } catch (error) {
        console.error('Failed to fetch providers:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProviders();
  }, [props.provider, navigate]);

  if (isLoading) {
    return (
      <Box sx={{ overflow: 'visible' }}>
        <Container maxWidth="lg" disableGutters>
          <Box sx={{ mb: 3, pt: 1 }}>
            <Skeleton variant="text" width={220} height={36} sx={{ borderRadius: '8px' }} />
            <Skeleton variant="text" width={320} height={22} sx={{ borderRadius: '6px', mt: 0.5 }} />
          </Box>
          <Grid container spacing={2.5}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((_, i) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                <Skeleton variant="rounded" height={240} sx={{ borderRadius: '16px' }} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '60vh',
      overflow: 'visible',
    }}>
      <Container maxWidth="lg" disableGutters>
        {/* Header */}
        <Box sx={{ mb: 3, pt: 1 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              fontFamily: "'Quicksand', sans-serif",
              color: mode === 'dark' ? '#fff' : '#1a1a2e',
              mb: 0.5,
            }}
          >
            All News Providers
          </Typography>
          <Typography
            sx={{
              fontSize: '0.95rem',
              fontWeight: 500,
              color: mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)',
              fontFamily: "'Quicksand', sans-serif",
            }}
          >
            Follow your favorite news sources to stay updated
          </Typography>
        </Box>

        {/* Grid Layout */}
        <Grid container spacing={2.5}>
          {providers.map((provider) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={provider.baseURL}>
              <NewsProviderCard
                name={provider.name}
                logoUrl={provider.logo}
                baseURL={provider.baseURL}
                provider={props.provider}
                onUnfollow={() => {
                  if (props.provider === "following") {
                    setProviders((prevProviders) =>
                      prevProviders.filter((p) => p.baseURL !== provider.baseURL)
                    );
                  }
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default NewsProviderPageAll;