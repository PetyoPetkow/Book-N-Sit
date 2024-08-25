import { FC, MouseEvent } from 'react';
import { Divider, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Perk, PerksMap } from '../../../../global/models/Venue';
import { perksIcons } from '../../Overview/PerksList';

const VenuePerksSelector: FC<VenuePerksSelectorProps> = ({
  disabled = false,
  selectedPerks,
  onSelectedPerksChanged,
}) => {
  // Convert the selectedPerks map into an array of selected perk names
  const selectedPerkNames = Object.entries(selectedPerks)
    .filter(([, value]) => value)
    .map(([perk]) => perk);

  // Event handler for toggling perks
  const handlePerkChange = (event: MouseEvent<HTMLElement>, newPerkNames: Perk[]) => {
    // Build a new PerksMap based on toggled perks
    const newPerksMap = Object.keys(selectedPerks).reduce<PerksMap>(
      (acc, perk) => ({
        ...acc,
        [perk as Perk]: newPerkNames.includes(perk as Perk),
      }),
      {} as PerksMap
    );

    // Call the parent onSelectedPerksChanged handler with the updated map
    onSelectedPerksChanged(event, newPerksMap);
  };

  return (
    <div>
      <div className="text-lg font-bold">Venue Perks</div>
      <Divider />
      <ToggleButtonGroup
        disabled={disabled}
        className="flex flex-wrap gap-3 my-5"
        value={selectedPerkNames}
        onChange={handlePerkChange} // Updated handler
      >
        {Object.entries(selectedPerks).map(([perk, value]) => {
          return (
            <ToggleButton
              key={perk}
              value={perk}
              selected={value}
              color="success"
              className="flex items-center p-3 border border-solid border-gray-300 rounded gap-3"
              sx={{
                '&.Mui-selected': {
                  backgroundColor: '#F3F7EC',
                },
              }}
            >
              <div>{perksIcons[perk as Perk]}</div>
              <div>{perk}</div>
            </ToggleButton>
          );
        })}
      </ToggleButtonGroup>
      <Divider />
    </div>
  );
};

interface VenuePerksSelectorProps {
  disabled?: boolean;
  selectedPerks: PerksMap;
  onSelectedPerksChanged: (event: MouseEvent<HTMLElement>, perks: PerksMap) => void;
}

export default VenuePerksSelector;
