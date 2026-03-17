import React, { useContext, useState } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { Box, Typography, TextField, Button } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import toast from 'react-hot-toast';

const ContactUs = () => {
  const { mode } = useContext(ThemeContext);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }
    toast.success('Thank you! Your message has been sent.');
    setFormData({ name: '', email: '', message: '' });
  };

  const cardStyle = {
    backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.06)' : '#fff',
    borderRadius: '20px',
    padding: '32px',
    boxShadow: mode === 'dark'
      ? '0 4px 24px rgba(0,0,0,0.3)'
      : '0 4px 24px rgba(0,0,0,0.08)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: mode === 'dark'
        ? '0 8px 32px rgba(30,144,255,0.2)'
        : '0 8px 32px rgba(30,144,255,0.15)',
    },
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      fontFamily: "'Quicksand', sans-serif",
      color: mode === 'dark' ? '#fff' : '#1a1a2e',
      '& fieldset': {
        borderColor: mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)',
      },
      '&:hover fieldset': {
        borderColor: 'rgb(30, 144, 255)',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'rgb(30, 144, 255)',
      },
    },
    '& .MuiInputLabel-root': {
      fontFamily: "'Quicksand', sans-serif",
      color: mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
    },
  };

  const iconBoxStyle = {
    p: 1.2,
    borderRadius: '12px',
    background: 'linear-gradient(135deg, rgba(30,144,255,0.15), rgba(30,144,255,0.05))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const contactItems = [
    { icon: <EmailIcon sx={{ fontSize: 24, color: 'rgb(30, 144, 255)' }} />, label: 'Email', value: 'support@newsbuzz.com' },
    { icon: <PhoneIcon sx={{ fontSize: 24, color: 'rgb(30, 144, 255)' }} />, label: 'Phone', value: '+91 98765 43210' },
    { icon: <LocationOnIcon sx={{ fontSize: 24, color: 'rgb(30, 144, 255)' }} />, label: 'Location', value: 'Gujarat, India' },
    { icon: <AccessTimeIcon sx={{ fontSize: 24, color: 'rgb(30, 144, 255)' }} />, label: 'Response Time', value: 'Within 24 hours' },
  ];

  return (
    <div style={{ marginTop: '130px', padding: '20px 40px', maxWidth: '1100px', margin: '130px auto 60px' }}>
      <Typography
        variant="h3"
        sx={{
          fontFamily: "'Quicksand', sans-serif",
          fontWeight: 800,
          textAlign: 'center',
          mb: 2,
          color: mode === 'dark' ? '#fff' : '#1a1a2e',
          fontSize: { xs: '2rem', md: '2.8rem' },
        }}
      >
        Contact <span style={{ background: 'linear-gradient(135deg, rgb(30,144,255), rgb(0,100,200))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Us</span>
      </Typography>

      <Typography
        sx={{
          fontFamily: "'Quicksand', sans-serif",
          fontWeight: 400,
          fontSize: '1.25rem',
          textAlign: 'center',
          color: mode === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)',
          maxWidth: '600px',
          margin: '0 auto 40px',
          lineHeight: 1.8,
        }}
      >
        Have questions, feedback, or suggestions? We'd love to hear from you!
      </Typography>

      <Box sx={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {/* Contact Info */}
        <Box sx={{ ...cardStyle, flex: '1 1 300px', maxWidth: '400px' }}>
          <Typography variant="h5" sx={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, mb: 3, color: mode === 'dark' ? '#fff' : '#1a1a2e' }}>
            Get in Touch
          </Typography>

          {contactItems.map((item, idx) => (
            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: idx < contactItems.length - 1 ? 3 : 0 }}>
              <Box sx={iconBoxStyle}>{item.icon}</Box>
              <Box>
                <Typography sx={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 600, color: mode === 'dark' ? '#fff' : '#1a1a2e', fontSize: '17px' }}>{item.label}</Typography>
                <Typography sx={{ fontFamily: "'Quicksand', sans-serif", color: mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.55)', fontSize: '16px' }}>{item.value}</Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Contact Form */}
        <Box sx={{ ...cardStyle, flex: '1 1 400px', maxWidth: '550px' }}>
          <Typography variant="h5" sx={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, mb: 3, color: mode === 'dark' ? '#fff' : '#1a1a2e' }}>
            Send a Message
          </Typography>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <TextField
              label="Your Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              sx={inputSx}
            />
            <TextField
              label="Your Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              fullWidth
              sx={inputSx}
            />
            <TextField
              label="Your Message"
              multiline
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              fullWidth
              sx={inputSx}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{
                fontFamily: "'Quicksand', sans-serif",
                fontWeight: 700,
                fontSize: '18px',
                borderRadius: '50px',
                padding: '12px 32px',
                background: 'linear-gradient(135deg, rgb(30, 144, 255), rgb(0, 100, 200))',
                textTransform: 'none',
                boxShadow: '0 4px 16px rgba(30, 144, 255, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, rgb(0, 100, 200), rgb(30, 144, 255))',
                  boxShadow: '0 6px 24px rgba(30, 144, 255, 0.4)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Send Message
            </Button>
          </form>
        </Box>
      </Box>
    </div>
  );
};

export default ContactUs;
