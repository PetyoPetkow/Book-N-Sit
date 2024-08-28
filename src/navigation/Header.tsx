import { FC, MouseEvent, useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { doSingOut } from '../firebase/auth';
import {
  AppBar,
  Avatar,
  Button,
  Container,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import { useAuth } from '../contexts/authContext';
import flagBG from '../assets/flagsImages/bulgaria.png';
import flagUK from '../assets/flagsImages/united-kingdom.png';
import logo from '../assets/logos/logo.png';
import { useTranslation } from 'react-i18next';
import Language from '../models/Language';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import clsx from 'clsx';
import BallotOutlinedIcon from '@mui/icons-material/BallotOutlined';
import AddBusinessOutlinedIcon from '@mui/icons-material/AddBusinessOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import menuConfig from './MenuConfig';
import { updateUser } from '../firebase/services/UserService';

const Header: FC<HeaderProps> = () => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElLanguage, setAnchorElLanguage] = useState<null | HTMLElement>(null);

  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const { currentUser, currentUserDetails: userDetails } = useAuth();

  const prefferedLanguageFlag = useMemo(() => {
    if (i18n.language === 'bg') {
      return flagBG;
    } else {
      return flagUK;
    }
  }, [i18n.language]);

  const changeLanguage = (lng: Language) => {
    if (currentUser) {
      updateUser(currentUser.uid, { language: lng });
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

  return (
    <AppBar className="bg-[#006989]" position="relative">
      <Container>
        <div className="w-full flex justify-between items-center mt-2">
          <img className="h-14" src={logo} />
          <div className="flex">
            {currentUser ? (
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
                      navigate('/messages');
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
                      navigate('/myVenues');
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
                      navigate('/addVenue');
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
                      navigate('/manageAccount');
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
                    navigate('/login');
                  }}
                >
                  {t('login')}
                </Button>
                <Button
                  className="text-white font-bold font-sans"
                  onClick={() => {
                    navigate('/register');
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
                  <div className="flex items-center ">{t(label)}</div>
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
