import { FC, MouseEvent } from 'react';
import { perksMock } from '../../Overview/Perks/PerksMock';
import { Divider, ToggleButton, ToggleButtonGroup } from '@mui/material';

const VenuePerksSelector: FC<VenuePerksSelectorProps> = ({
  disabled = false,
  selectedPerks,
  onSelectedPerksChanged,
}) => {
  return (
    <div>
      <div className="text-lg font-bold">Venue Perks</div>
      <Divider />
      <ToggleButtonGroup
        disabled={disabled}
        className="flex flex-wrap gap-3 my-5"
        value={selectedPerks}
        onChange={onSelectedPerksChanged}
      >
        {perksMock.map((perk) => (
          <ToggleButton
            key={perk.name}
            value={perk.name}
            color="success"
            className="flex items-center p-3 border border-solid border-gray-300 rounded gap-3"
            sx={{
              '&.Mui-selected': {
                backgroundColor: '#F3F7EC',
              },
            }}
          >
            <div>{perk.icon}</div>
            <div>{perk.name}</div>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <Divider />
    </div>
  );
};

interface VenuePerksSelectorProps {
  disabled?: boolean;
  selectedPerks: string[];
  onSelectedPerksChanged: (event: MouseEvent<HTMLElement>, perks: string[]) => void;
}

export default VenuePerksSelector;
