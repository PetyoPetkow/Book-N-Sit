import { FC, MouseEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { doSingOut } from '../firebase/auth';
import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';

const Header: FC<HeaderProps> = () => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [user, setUser] = useState<string | null>();

  useEffect(() => {
    setUser(localStorage.getItem('email'));
  }, [localStorage.getItem('email')]);

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

  return (
    <AppBar className="bg-[#0d9488]" position="static">
      <Container>
        <Toolbar className="flex flex-col">
          <div className="w-full flex justify-between items-center mt-2">
            <div className="text-2xl font-bold font-sans">Book N' Sit</div>
            <div className="flex max-sm:hidden">
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
            </div>
          </div>
          <div className="my-4 flex self-start gap-3">
            <Button
              className="rounded-full border-white text-white"
              size="large"
              variant="outlined"
            >
              Restaurants
            </Button>
            <Button
              className="rounded-full border-white text-white"
              size="large"
              variant="outlined"
            >
              Bars
            </Button>
            <Button
              className="rounded-full border-white text-white"
              size="large"
              variant="outlined"
            >
              Events
            </Button>
            <Button
              className="rounded-full border-white text-white"
              size="large"
              variant="outlined"
            >
              Parties
            </Button>
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

interface HeaderProps {}

type MenuKey = 'home' | 'account' | 'login' | 'register';

export default Header;
