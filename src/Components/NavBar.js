import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, InputBase, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';
import FeedbackIcon from '@mui/icons-material/Feedback';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    // Navigate to the corresponding bank's feedback form
    if (searchTerm) {
      navigate(`/${searchTerm}`); // Adjust this path according to your routing structure
    }
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        {/* Logo */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Bank Feedback
        </Typography>

        {/* Search bar */}
        <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'background.paper', borderRadius: 1, paddingX: 1, marginRight: 2 }}>
          <InputBase
            placeholder="Search…"
            sx={{ ml: 1, flex: 1 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch(); // Trigger search on Enter key
              }
            }}
          />
          <IconButton onClick={handleSearch} color="inherit">
            <SearchIcon />
          </IconButton>
        </Box>

        {/* Navigation Icons */}
        <IconButton color="inherit" aria-label="home" onClick={()=>{navigate("/");}}>
          <HomeIcon />
        </IconButton>
        <IconButton color="inherit" aria-label="banks">
          <BusinessIcon />
        </IconButton>
        <IconButton color="inherit" aria-label="feedback">
          <FeedbackIcon />
        </IconButton>
        <IconButton color="inherit" aria-label="account" onClick={()=>{navigate("/login")}}>
          <AccountCircleIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
