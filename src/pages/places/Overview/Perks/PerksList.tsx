import { FC } from 'react';
import { perksMock } from './PerksMock';

const PerksList: FC<PerksListProps> = () => {
  return (
    <div className="flex flex-wrap gap-3">
      {perksMock.map((perk) => {
        return (
          <div className="flex items-center p-3 bg-white border border-solid border-gray-300 rounded gap-3 ">
            <div>{perk.icon}</div>
            <div>{perk.name}</div>
          </div>
        );
      })}
    </div>
  );
};

interface PerksListProps {}

export default PerksList;
