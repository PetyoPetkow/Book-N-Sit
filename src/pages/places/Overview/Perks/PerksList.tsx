import { FC } from 'react';
import { perksMock } from './PerksMock';

const PerksList: FC<PerksListProps> = ({ perksList }) => {
  return (
    <div className="flex flex-wrap gap-3">
      {perksList.map((perk) => {
        return (
          <div className="flex items-center p-3 bg-white border border-solid border-gray-300 rounded gap-3 ">
            <div>{perksMock.find((perkMock) => perkMock.name === perk)?.icon}</div>
            <div>{perk}</div>
          </div>
        );
      })}
    </div>
  );
};

interface PerksListProps {
  perksList: string[];
}

export default PerksList;
