import { FC } from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { IconButton } from '@mui/material';
import clsx from 'clsx';

const Location: FC<LocationProps> = ({ city, street, className, iconSize }) => {
  return (
    <div className={clsx(className ? className : '')}>
      <IconButton size="small">
        <LocationOnIcon fontSize={iconSize} />
      </IconButton>
      {[city, street].join(', ')}
    </div>
  );
};

interface LocationProps {
  iconSize?: 'small' | 'medium' | 'large' | 'inherit';
  className?: string;
  city: string;
  street: string | null;
}

export default Location;
