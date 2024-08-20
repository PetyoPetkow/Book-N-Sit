import { FC } from 'react';
import { perksIcons, perksMock } from './PerksMock';
import { Perk, PerksMap } from '../../../../global/models/Venue';

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
