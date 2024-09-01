import { FC } from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import clsx from 'clsx';

const Location: FC<LocationProps> = ({ city, street, className }) => {
  return (
    <div className={clsx(className ? className : '', 'flex items-center shadow-sm shadow-black')}>
      <LocationOnIcon className="text-gray-600" />
      <span>
        {city} {street && `, ${street}`}
      </span>
    </div>
  );
};

interface LocationProps {
  className?: string;
  city: string;
  street: string | null;
}

export default Location;
