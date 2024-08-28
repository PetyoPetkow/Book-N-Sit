import { FC, MouseEvent } from 'react';
import { Divider, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Perk, PerksMap } from '../../models/Venue';
import { perksIcons } from '../overview/PerksList';
import { useTranslation } from 'react-i18next';

const VenuePerksSelector: FC<VenuePerksSelectorProps> = ({
  disabled = false,
  selectedPerks,
  onSelectedPerksChanged,
}) => {
  const { t } = useTranslation();

  const selectedPerkNames = Object.entries(selectedPerks)
    .filter(([, value]) => value)
    .map(([perk]) => perk);

  const handlePerkChange = (event: MouseEvent<HTMLElement>, newPerkNames: Perk[]) => {
    const newPerksMap = Object.keys(selectedPerks).reduce<PerksMap>(
      (acc, perk) => ({
        ...acc,
        [perk as Perk]: newPerkNames.includes(perk as Perk),
      }),
      {} as PerksMap
    );

    onSelectedPerksChanged(event, newPerksMap);
  };

  return (
    <div>
      <div className="text-lg font-bold">{t('label_venue_perks')}</div>
      <Divider />
      <ToggleButtonGroup
        disabled={disabled}
        className="flex flex-wrap gap-3 my-5"
        value={selectedPerkNames}
        onChange={handlePerkChange}
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
              <div>{t(perk)}</div>
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
