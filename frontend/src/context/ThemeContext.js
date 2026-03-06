import React, { createContext, useState, useMemo, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

export const ThemeContext = createContext();

export const ThemeContextProvider = ({ children }) => {
  const [mode, setMode] = useState(() => localStorage.getItem('mode') || 'light');

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    localStorage.setItem('mode', mode);
  }, [mode]);


  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#1E90FF',
            light: '#4DA8FF',
            dark: '#0055CC',
          },
          secondary: {
            main: '#FF6B6B',
            light: '#FF8E8E',
            dark: '#CC4444',
          },
        },
        typography: {
          fontFamily: 'Quicksand, Arial, sans-serif',
          fontSize: 15,
          h1: { fontSize: '2.8rem', fontWeight: 700 },
          h2: { fontSize: '2.2rem', fontWeight: 700 },
          h3: { fontSize: '1.8rem', fontWeight: 600 },
          h4: { fontSize: '1.5rem', fontWeight: 600 },
          h5: { fontSize: '1.25rem', fontWeight: 600 },
          h6: { fontSize: '1.1rem', fontWeight: 600 },
          subtitle1: { fontSize: '1.05rem' },
          subtitle2: { fontSize: '0.95rem' },
          body1: { fontSize: '1rem' },
          body2: { fontSize: '0.9rem' },
          caption: { fontSize: '0.8rem' },
          button: {
            fontFamily: 'Quicksand, Arial, sans-serif',
            fontWeight: 600,
            fontSize: '0.95rem',
            textTransform: 'none',
          },
        },
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiButton: {
            defaultProps: {
              disableElevation: true,
            },
            styleOverrides: {
              root: {
                borderRadius: '50px',
                padding: '8px 24px',
                fontSize: '14px',
                fontWeight: 600,
                fontFamily: 'Quicksand, Arial, sans-serif',
                textTransform: 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                  transition: 'left 0.5s ease',
                },
                '&:hover::before': {
                  left: '100%',
                },
                '&:active': {
                  transform: 'scale(0.97)',
                },
              },
              contained: {
                background: 'linear-gradient(135deg, #1E90FF 0%, #0055CC 100%)',
                color: '#fff',
                boxShadow: '0 2px 8px rgba(30, 144, 255, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4DA8FF 0%, #1E90FF 100%)',
                  boxShadow: '0 4px 16px rgba(30, 144, 255, 0.4)',
                  transform: 'translateY(-1px)',
                },
              },
              containedSecondary: {
                background: 'linear-gradient(135deg, #FF6B6B 0%, #CC4444 100%)',
                boxShadow: '0 2px 8px rgba(255, 107, 107, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #FF8E8E 0%, #FF6B6B 100%)',
                  boxShadow: '0 4px 16px rgba(255, 107, 107, 0.4)',
                  transform: 'translateY(-1px)',
                },
              },
              outlined: ({ theme }) => ({
                borderWidth: '1.5px',
                borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(30,144,255,0.4)',
                color: theme.palette.mode === 'dark' ? '#4DA8FF' : '#1E90FF',
                backdropFilter: 'blur(4px)',
                background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(30,144,255,0.03)',
                '&:hover': {
                  borderWidth: '1.5px',
                  borderColor: '#1E90FF',
                  background: theme.palette.mode === 'dark' ? 'rgba(30,144,255,0.1)' : 'rgba(30,144,255,0.06)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 2px 12px rgba(30,144,255,0.15)',
                },
              }),
              text: ({ theme }) => ({
                color: theme.palette.mode === 'dark' ? '#90CAF9' : '#1E90FF',
                '&:hover': {
                  background: theme.palette.mode === 'dark' ? 'rgba(30,144,255,0.08)' : 'rgba(30,144,255,0.05)',
                },
              }),
              sizeSmall: {
                padding: '4px 16px',
                fontSize: '12px',
              },
              sizeLarge: {
                padding: '12px 32px',
                fontSize: '16px',
              },
            },
          },
          MuiIconButton: {
            styleOverrides: {
              root: {
                transition: 'all 0.25s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
                '&:active': {
                  transform: 'scale(0.95)',
                },
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};