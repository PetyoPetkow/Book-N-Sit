import { Checkbox, Divider, FormControlLabel } from '@mui/material';
import { ChangeEvent, FC } from 'react';
import { venueTypes } from './VenueTypeMock';

const VenueTypeSelector: FC<VenueTypeSelectorProps> = ({
  selectedVenueTypes,
  onselectedVenueTypesChanged,
}) => {
  return (
    <div>
      <div className="text-lg font-bold">Venue Type</div>
      <Divider />
      <div className="grid grid-cols-4 max-md:grid-cols-2 my-4">
        {venueTypes.map((venueType) => {
          return (
            <FormControlLabel
              control={
                <Checkbox
                  value={venueType}
                  checked={selectedVenueTypes.includes(venueType)}
                  onChange={onselectedVenueTypesChanged}
                />
              }
              label={venueType}
            />
          );
        })}
      </div>
      <Divider />
    </div>
  );
};

interface VenueTypeSelectorProps {
  selectedVenueTypes: string[];
  onselectedVenueTypesChanged: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}

export default VenueTypeSelector;
