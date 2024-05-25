import { FC } from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { IconButton } from '@mui/material';

const Location: FC<LocationProps> = () => {
  return (
    <div>
      <IconButton>
        <LocationOnIcon />
      </IconButton>
      Some location,asdasd
    </div>
  );
};

interface LocationProps {}

export default Location;
