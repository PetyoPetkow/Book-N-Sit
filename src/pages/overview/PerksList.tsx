import { FC, ReactElement } from 'react';
import { Perk, PerksMap } from '../../models/Venue';
import WifiIcon from '@mui/icons-material/Wifi';
import LocalBarOutlinedIcon from '@mui/icons-material/LocalBarOutlined';
import WineBarOutlinedIcon from '@mui/icons-material/WineBarOutlined';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import SetMealOutlinedIcon from '@mui/icons-material/SetMealOutlined';

export const perksIcons: Record<Perk, ReactElement> = {
  free_wifi: <WifiIcon />,
  personalized_events: <CakeOutlinedIcon />,
  sushi_menu: <SetMealOutlinedIcon />,
  wine_list: <WineBarOutlinedIcon />,
  cocktails: <LocalBarOutlinedIcon />,
};

const PerksList: FC<PerksListProps> = ({ perksList }) => {
  return (
    <div className="flex flex-wrap gap-3">
      {Object.entries(perksList).map(([perk, value]) => {
        return (
          value && (
            <div className="flex items-center p-3 bg-white border border-solid border-gray-300 rounded gap-3 ">
              <div>{perksIcons[perk as Perk]}</div>
              <div>{perk}</div>
            </div>
          )
        );
      })}
    </div>
  );
};

interface PerksListProps {
  perksList: PerksMap;
}

export default PerksList;
