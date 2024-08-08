import SmokeFreeIcon from '@mui/icons-material/SmokeFree';
import SetMealIcon from '@mui/icons-material/SetMeal';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import WineBarIcon from '@mui/icons-material/WineBar';
import CakeIcon from '@mui/icons-material/Cake';
import { Perk } from '../../../../global/models/Venue';

export const perksMock = [
  {
    icon: <SmokeFreeIcon fontSize="large" />,
    name: 'No smoking',
  },
  {
    icon: <SetMealIcon fontSize="large" />,
    name: 'Sushi menu',
  },
  {
    icon: <LocalBarIcon fontSize="large" />,
    name: 'Cocktails',
  },
  {
    icon: <WineBarIcon fontSize="large" />,
    name: 'Wine list',
  },
  {
    icon: <CakeIcon fontSize="large" />,
    name: 'Personalized events',
  },
];

export const perksIcons: Record<Perk, JSX.Element> = {
  'No smoking': <SmokeFreeIcon fontSize="large" />,
  'Personalized events': <CakeIcon fontSize="large" />,
  'Sushi menu': <SetMealIcon fontSize="large" />,
  'Wine list': <WineBarIcon fontSize="large" />,
  Cocktail: <LocalBarIcon fontSize="large" />,
};
