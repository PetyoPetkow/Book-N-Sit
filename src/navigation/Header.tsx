import { FC, MouseEvent, useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { doSingOut } from '../firebase/auth';
import {
  AppBar,
  Avatar,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useAuth } from '../contexts/authContext';
import flagBG from './flagsImages/bulgaria.png';
import flagUK from './flagsImages/united-kingdom.png';
import logo from './logos/logo.png';
import { firestore } from '../firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import Language from '../global/models/Language';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';

const Header: FC<HeaderProps> = () => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElLanguage, setAnchorElLanguage] = useState<null | HTMLElement>(null);

  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const { userLoggedIn, currentUser } = useAuth();

  const prefferedLanguageFlag = useMemo(() => {
    if (i18n.language === 'bg') {
      return flagBG;
    } else {
      return flagUK;
    }
  }, [i18n.language]);

  const changeLanguage = (lng: Language) => {
    if (currentUser) {
      setDoc(doc(firestore, 'users', currentUser.uid), { language: lng }, { merge: true });
    }
  };

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenLanguageMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElLanguage(event.currentTarget);
  };

  const handleCloseLanguageMenu = () => {
    setAnchorElLanguage(null);
  };

  const menuConfig = [
    {
      label: t('header_btn_all'),
      path: '/Places',
      icon: <FavoriteIcon />,
    },
    {
      label: t('header_btn_restaurants'),
      path: '/Restaurants',
      icon: <RestoreIcon />,
    },
    {
      label: t('header_btn_bars'),
      path: '/Bars',
      icon: <RestoreIcon />,
    },
    {
      label: t('header_btn_night_clubs'),
      path: '/NightClubs',
      icon: <LocationOnIcon />,
    },
  ];

  return (
    <AppBar className="bg-[#006989]" position="relative">
      <Container>
        <div className="w-full flex justify-between items-center mt-2">
          <img className="h-14" src={logo} />
          <div className="flex">
            {userLoggedIn && currentUser ? (
              <div>
                <Button
                  className="h-full hover:backdrop-contrast-150"
                  onClick={handleOpenLanguageMenu}
                >
                  <Avatar className="w-7 h-7" alt="Country flag" src={prefferedLanguageFlag} />
                </Button>
                <Menu
                  anchorEl={anchorElLanguage}
                  keepMounted
                  open={Boolean(anchorElLanguage)}
                  onClose={handleCloseLanguageMenu}
                >
                  <MenuItem
                    className="flex gap-3"
                    onClick={() => {
                      handleCloseLanguageMenu();
                      changeLanguage('bg');
                      i18n.changeLanguage('bg');
                    }}
                  >
                    <Avatar className="w-7 h-7" alt="Country flag" src={flagBG} />
                    <div>Bulgarian</div>
                  </MenuItem>

                  <MenuItem
                    className="flex gap-3"
                    onClick={() => {
                      handleCloseLanguageMenu();
                      changeLanguage('en');
                      i18n.changeLanguage('en');
                    }}
                  >
                    <Avatar className="w-7 h-7" alt="Country flag" src={flagUK} />
                    <div>English</div>
                  </MenuItem>
                </Menu>

                <Button
                  className="text-white font-bold hover:backdrop-contrast-150"
                  onClick={handleOpenUserMenu}
                >
                  <div className="flex gap-3 items-center">
                    <Avatar alt="User avatar" src="/static/images/avatar/2.jpg" />
                    <div className="flex flex-col text-left">
                      <div>Hello,</div>
                      <div>{currentUser.email}</div>
                    </div>
                  </div>
                </Button>
                <Menu
                  sx={{ mt: '60px' }}
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem
                    className="flex gap-2"
                    key={'setting'}
                    onClick={() => navigate('/Messages')}
                  >
                    <ChatOutlinedIcon />
                    <Typography textAlign="center">Messages</Typography>
                  </MenuItem>

                  <MenuItem className="flex gap-2" key={'setting'} onClick={handleCloseUserMenu}>
                    <FavoriteIcon />
                    <Typography textAlign="center">
                      {t('header_profile_menu_action_manage_account')}
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    className="flex gap-2"
                    key={'s'}
                    onClick={() => {
                      handleCloseUserMenu();
                      doSingOut();
                    }}
                  >
                    <FavoriteIcon />
                    <Typography textAlign="center">
                      {t('header_profile_menu_action_sign_out')}
                    </Typography>
                  </MenuItem>
                </Menu>
              </div>
            ) : (
              <>
                <Button
                  className="text-white font-bold font-sans"
                  onClick={() => {
                    navigate('/Login');
                  }}
                >
                  Login
                </Button>
                <Button
                  className="text-white font-bold font-sans"
                  onClick={() => {
                    navigate('/Register');
                  }}
                >
                  Register
                </Button>
              </>
            )}
          </div>
        </div>
        <Toolbar disableGutters>
          <div className="flex flex-wrap gap-3 my-2 whitespace-nowrap">
            {menuConfig.map(({ label, path, icon }) => (
              <Button
                className="text-white rounded-full"
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

export default Header;
