import { Checkbox, Divider, FormControlLabel } from '@mui/material';
import { ChangeEvent, FC } from 'react';
import { VenueType, VenueTypeEnum } from '../../models/Venue';
import { useTranslation } from 'react-i18next';

const VenueTypeSelector: FC<VenueTypeSelectorProps> = ({
  disabled = false,
  selectedVenueTypes,
  onselectedVenueTypesChanged,
}) => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="text-lg font-bold">{t('label_venue_type')}</div>
      <Divider />
      <div className="grid grid-cols-4 max-md:grid-cols-2 my-4">
        {Object.values(VenueTypeEnum).map((venueType) => {
          return (
            <FormControlLabel
              control={
                <Checkbox
                  disabled={disabled}
                  checked={selectedVenueTypes.includes(venueType)}
                  onChange={onselectedVenueTypesChanged}
                />
              }
              label={t(venueType)}
            />
          );
        })}
      </div>
      <Divider />
    </div>
  );
};

interface VenueTypeSelectorProps {
  disabled?: boolean;
  selectedVenueTypes: VenueType[];
  onselectedVenueTypesChanged: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}

export default VenueTypeSelector;
