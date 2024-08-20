import SmokeFreeOutlinedIcon from '@mui/icons-material/SmokeFreeOutlined';
import LocalBarOutlinedIcon from '@mui/icons-material/LocalBarOutlined';
import WineBarOutlinedIcon from '@mui/icons-material/WineBarOutlined';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import SetMealOutlinedIcon from '@mui/icons-material/SetMealOutlined';
import { Perk } from '../../../../global/models/Venue';

export const perksMock = [
  {
    icon: <SmokeFreeOutlinedIcon fontSize="large" />,
    name: 'No smoking',
  },
  {
    icon: <SetMealOutlinedIcon fontSize="large" />,
    name: 'Sushi menu',
  },
  {
    icon: <LocalBarOutlinedIcon fontSize="large" />,
    name: 'Cocktails',
  },
  {
    icon: <WineBarOutlinedIcon fontSize="large" />,
    name: 'Wine list',
  },
  {
    icon: <CakeOutlinedIcon fontSize="large" />,
    name: 'Personalized events',
  },
];

export const perksIcons: Record<Perk, JSX.Element> = {
  'No smoking': <SmokeFreeOutlinedIcon />,
  'Personalized events': <CakeOutlinedIcon />,
  'Sushi menu': <SetMealOutlinedIcon />,
  'Wine list': <WineBarOutlinedIcon />,
  Cocktails: <LocalBarOutlinedIcon />,
};
