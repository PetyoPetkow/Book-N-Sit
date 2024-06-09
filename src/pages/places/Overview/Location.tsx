import { FC } from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { IconButton } from '@mui/material';

const Location: FC<LocationProps> = ({ address }) => {
  return (
    <div className="bg-[#F3F7EC] w-fit pr-3 my-2 py-0 rounded-full">
      <IconButton size="small">
        <LocationOnIcon />
      </IconButton>
      {address}
    </div>
  );
};

interface LocationProps {
  address: string;
}

export default Location;
