import React, { useState } from 'react';
import { 
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  MenuItem,
  Tooltip,
  Divider
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const pages = [
  { title: 'Home', path: '/' },
  { title: 'About', path: '/about' },
  { title: 'Menu', path: '/menu' },
  { title: 'Contact', path: '/contact' }
];

const authPages = [
  { title: 'Login', path: '/login', icon: <LoginIcon fontSize="small" /> },
  { title: 'Sign up', path: '/signup', icon: <PersonAddIcon fontSize="small" /> }
];

function Navbar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (path) => {
    setAnchorElNav(null);
    if (path) navigate(path);
  };

  const handleCloseUserMenu = (path) => {
    setAnchorElUser(null);
    if (path) navigate(path);
  };

  const isLoggedIn = false; // Change to use your authentication context/state

  return (
    <AppBar 
      position="static" 
      color="default" 
      elevation={2}
      sx={{ 
        backgroundColor: 'white',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo - Desktop */}
          <RestaurantMenuIcon 
            sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              mr: 1,
              color: 'primary.main'
            }} 
          />
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'primary.main',
              textDecoration: 'none',
            }}
          >
            Khana Khajana
          </Typography>

          {/* Mobile menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={() => handleCloseNavMenu()}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.title} onClick={() => handleCloseNavMenu(page.path)}>
                  <Typography textAlign="center">{page.title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Logo - Mobile */}
          <RestaurantMenuIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, color: 'primary.main' }} />
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 700,
              color: 'primary.main',
              textDecoration: 'none',
            }}
          >
            Khana Khajana
          </Typography>

          {/* Desktop menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.title}
                onClick={() => handleCloseNavMenu(page.path)}
                sx={{ 
                  my: 2, 
                  color: 'text.primary', 
                  display: 'block',
                  mx: 1,
                  '&:hover': {
                    color: 'primary.main',
                    backgroundColor: 'transparent',
                  }
                }}
              >
                {page.title}
              </Button>
            ))}
          </Box>

          {/* Authentication buttons or user menu */}
          <Box sx={{ flexGrow: 0 }}>
            {isLoggedIn ? (
              <>
                <Tooltip title="Account settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <AccountCircleIcon />
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={() => handleCloseUserMenu()}
                >
                  <MenuItem onClick={() => handleCloseUserMenu('/profile')}>
                    <Typography textAlign="center">Profile</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => handleCloseUserMenu('/dashboard')}>
                    <Typography textAlign="center">Dashboard</Typography>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={() => handleCloseUserMenu()}>
                    <Typography textAlign="center" color="error">Logout</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex' }}>
                {authPages.map((page) => (
                  <Button
                    key={page.title}
                    component={RouterLink}
                    to={page.path}
                    startIcon={page.icon}
                    variant={page.title === 'Login' ? 'contained' : 'outlined'}
                    color="primary"
                    size="medium"
                    sx={{ 
                      ml: 1,
                      textTransform: 'none',
                      borderRadius: '4px',
                      px: 2
                    }}
                  >
                    {page.title}
                  </Button>
                ))}
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;