import { FC, MouseEvent, useEffect, useMemo, useState } from 'react';
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
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import Language from '../global/models/Language';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import LocalCafeOutlinedIcon from '@mui/icons-material/LocalCafeOutlined';
import LocalBarOutlinedIcon from '@mui/icons-material/LocalBarOutlined';
import SportsBarOutlinedIcon from '@mui/icons-material/SportsBarOutlined';
import RestaurantMenuOutlinedIcon from '@mui/icons-material/RestaurantMenuOutlined';
import TableRestaurantOutlinedIcon from '@mui/icons-material/TableRestaurantOutlined';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import WineBarOutlinedIcon from '@mui/icons-material/WineBarOutlined';
import LocalDrinkOutlinedIcon from '@mui/icons-material/LocalDrinkOutlined';
import FastfoodOutlinedIcon from '@mui/icons-material/FastfoodOutlined';
import NightlifeOutlinedIcon from '@mui/icons-material/NightlifeOutlined';
import { getUserById } from '../firebase/services/UserService';
import { User } from 'firebase/auth';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import clsx from 'clsx';
import BallotOutlinedIcon from '@mui/icons-material/BallotOutlined';
import AddBusinessOutlinedIcon from '@mui/icons-material/AddBusinessOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const Header: FC<HeaderProps> = () => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElLanguage, setAnchorElLanguage] = useState<null | HTMLElement>(null);

  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const { userLoggedIn, currentUser, currentUserDetails: userDetails } = useAuth();

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
      path: '/All',
    },
    {
      label: t('header_btn_restaurants'),
      path: '/Restaurants',
      icon: RestaurantMenuOutlinedIcon,
    },
    {
      label: t('header_btn_cafes'),
      path: '/Cafes',
      icon: LocalCafeOutlinedIcon,
    },
    {
      label: t('header_btn_bars'),
      path: '/Bars',
      icon: LocalBarOutlinedIcon,
    },
    {
      label: t('header_btn_pubs'),
      path: '/Pubs',
      icon: SportsBarOutlinedIcon,
    },
    {
      label: t('header_btn_bakeries'),
      path: '/Bakeries',
      icon: CakeOutlinedIcon,
    },
    {
      label: t('header_btn_wineries'),
      path: '/Wineries',
      icon: WineBarOutlinedIcon,
    },
    {
      label: t('header_btn_breweries'),
      path: '/Breweries',
      icon: LocalDrinkOutlinedIcon,
    },
    {
      label: t('header_btn_night_clubs'),
      path: '/NightClubs',
      icon: NightlifeOutlinedIcon,
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
                  <Avatar
                    className="w-7 h-7 shadow-sm shadow-black"
                    alt="Country flag"
                    src={prefferedLanguageFlag}
                  />
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
                    <Avatar
                      className="w-7 h-7 shadow-sm shadow-black"
                      alt="Country flag"
                      src={flagBG}
                    />
                    <div>{t('header_bg_lng')}</div>
                  </MenuItem>

                  <MenuItem
                    className="flex gap-3"
                    onClick={() => {
                      handleCloseLanguageMenu();
                      changeLanguage('en');
                      i18n.changeLanguage('en');
                    }}
                  >
                    <Avatar
                      className="w-7 h-7 shadow-sm shadow-black"
                      alt="Country flag"
                      src={flagUK}
                    />
                    <div>{t('header_en_lng')}</div>
                  </MenuItem>
                </Menu>

                <Button
                  className="text-white font-bold hover:backdrop-contrast-150"
                  onClick={handleOpenUserMenu}
                >
                  <div className="flex gap-3 items-center">
                    <Avatar
                      className="shadow-sm shadow-black"
                      alt="User avatar"
                      src={userDetails?.photoURL || ''}
                    />
                    <div className="flex flex-col text-right">
                      <div>{userDetails?.displayName}</div>
                      <div>
                        {Boolean(anchorElUser) ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </div>
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
                    onClick={() => {
                      navigate('/Messages');
                      handleCloseUserMenu();
                    }}
                  >
                    <ChatOutlinedIcon />
                    <Typography textAlign="center">{t('header_account_messages')}</Typography>
                  </MenuItem>

                  <MenuItem
                    className="flex gap-2"
                    key={'setting'}
                    onClick={() => {
                      navigate('/MyVenues');
                      handleCloseUserMenu();
                    }}
                  >
                    <BallotOutlinedIcon />
                    <Typography textAlign="center">{t('header_account_my_venues')}</Typography>
                  </MenuItem>

                  <MenuItem
                    className="flex gap-2"
                    key={'setting'}
                    onClick={() => {
                      navigate('/AddVenue');
                      handleCloseUserMenu();
                    }}
                  >
                    <AddBusinessOutlinedIcon />
                    <Typography textAlign="center">{t('header_account_register_venue')}</Typography>
                  </MenuItem>

                  <MenuItem
                    className="flex gap-2"
                    key={'setting'}
                    onClick={() => {
                      navigate('/ManageAccount');
                      handleCloseUserMenu();
                    }}
                  >
                    <SettingsIcon />
                    <Typography textAlign="center">{t('header_account_manage_account')}</Typography>
                  </MenuItem>
                  <MenuItem
                    className="flex gap-2"
                    key={'s'}
                    onClick={() => {
                      handleCloseUserMenu();
                      doSingOut();
                    }}
                  >
                    <LogoutIcon />
                    <Typography textAlign="center">{t('header_account_sign_out')}</Typography>
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
                  {t('login')}
                </Button>
                <Button
                  className="text-white font-bold font-sans"
                  onClick={() => {
                    navigate('/Register');
                  }}
                >
                  {t('register')}
                </Button>
              </>
            )}
          </div>
        </div>
        <Toolbar disableGutters>
          <div className="flex flex-wrap gap-3 my-2 whitespace-nowrap">
            {menuConfig.map(({ label, path, icon: Icon }) => (
              <NavLink
                to={path}
                className={({ isActive, isPending }) =>
                  clsx(
                    isActive && 'border border-solid border-white font-bold',
                    'decoration-transparent text-white p-2 px-4 rounded-full hover:bg-white hover:bg-opacity-10'
                  )
                }
              >
                <div className="flex items-center justify-center gap-2">
                  {Icon && <Icon className="flex items-center" fontSize="small" />}
                  <div className="flex items-center ">{label}</div>
                </div>
              </NavLink>
            ))}
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

interface HeaderProps {}

export default Header;
