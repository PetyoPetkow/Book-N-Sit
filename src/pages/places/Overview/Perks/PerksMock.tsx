import WifiIcon from '@mui/icons-material/Wifi';
import LocalBarOutlinedIcon from '@mui/icons-material/LocalBarOutlined';
import WineBarOutlinedIcon from '@mui/icons-material/WineBarOutlined';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import SetMealOutlinedIcon from '@mui/icons-material/SetMealOutlined';
import { Perk } from '../../../../global/models/Venue';
import { ReactElement } from 'react';

export const perksIcons: Record<Perk, ReactElement> = {
  free_wifi: <WifiIcon />,
  personalized_events: <CakeOutlinedIcon />,
  sushi_menu: <SetMealOutlinedIcon />,
  wine_list: <WineBarOutlinedIcon />,
  cocktails: <LocalBarOutlinedIcon />,
};
