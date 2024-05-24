import { FC, MouseEvent, useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { doSingOut } from '../firebase/auth';
import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Avatar,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Header: FC<HeaderProps> = () => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const navigate = useNavigate();

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const pages = ['Products', 'Pricing', 'Blog'];
  const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

  return (
    <AppBar className="bg-[#0d9488]" position="static">
      <Container>
        <div className="w-full flex justify-between items-center mt-2">
          <div className="text-2xl font-bold font-sans">Book N' Sit</div>
          <div className="flex">
            <Button
              className="text-white font-bold font-sans"
              onClick={() => {
                handleCloseNavMenu();
                navigate('/Login');
              }}
            >
              Login
            </Button>
            <Button
              className="text-white font-bold font-sans"
              onClick={() => {
                handleCloseNavMenu();
                navigate('/Register');
              }}
            >
              Register
            </Button>
            <div>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
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
                onClose={handleCloseUserMenu}
              >
                <MenuItem className="flex gap-2" key={'setting'} onClick={handleCloseUserMenu}>
                  <FavoriteIcon />
                  <Typography textAlign="center">Manage account</Typography>
                </MenuItem>
                <MenuItem className="flex gap-2" key={'s'} onClick={handleCloseUserMenu}>
                  <FavoriteIcon />
                  <Typography textAlign="center">Sign out</Typography>
                </MenuItem>
              </Menu>
            </div>
          </div>
        </div>
        <Toolbar disableGutters>
          <div className="flex md:hidden">
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
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </div>
          <div className="flex gap-3 max-md:hidden">
            {menuConfig.map(({ label, path, icon }) => (
              <Button
                className="text-white my-2 px-4 rounded-full"
                sx={{
                  '&.active': {
                    border: '1px solid',
                    borderColor: 'white',
                    fontWeight: 600,
                  },
                }}
                startIcon={icon}
                key={label}
                component={NavLink}
                to={path}
              >
                {label}
              </Button>
            ))}
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

interface HeaderProps {}

const menuConfig = [
  {
    label: 'Places',
    path: '/Places',
    icon: <FavoriteIcon />,
  },
  {
    label: 'Restaurants',
    path: '/Restaurants',
    icon: <RestoreIcon />,
  },
  {
    label: 'Bars',
    path: '/Bars',
    icon: <RestoreIcon />,
  },
  {
    label: 'Night clubs',
    path: '/NightClubs',
    icon: <LocationOnIcon />,
  },
];

const userMenuConfig = [
  {
    label: 'Manage account',
    path: '/Restaurants',
    icon: <RestoreIcon />,
  },
  {
    label: 'Sign out',
    path: '/NightClubs',
    icon: <LocationOnIcon />,
  },
];

type MenuKey = 'home' | 'account' | 'login' | 'register';

export default Header;
