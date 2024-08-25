import { Avatar, Button, Divider } from '@mui/material';
import { FC } from 'react';
import PhoneEnabledIcon from '@mui/icons-material/PhoneEnabled';
import { useAuth } from '../../contexts/authContext';
import UserDetails from '../../global/models/users/UserDetails';

const OwnerInfo: FC<OwnerInfoProps> = ({ owner, onChatOpen }) => {
  const { currentUser } = useAuth();
  const { displayName, phoneNumber, photoURL } = owner;

  return (
    <div className="flex flex-col h-full overflow-hidden  bg-white">
      <div className=" flex items-center justify-center text-xl font-bold  w-full h-14 text-[#006989]">
        Contacts
      </div>
      <Divider className="mx-4 bg-[#006989]" />

      <section className="flex flex-col flex-grow items-center justify-evenly m-4">
        <div className="flex gap-3 font-bold items-center">
          <span>{displayName}</span>
          <Avatar className="shadow-sm shadow-black" src={photoURL} />
        </div>

        {phoneNumber && (
          <div className="flex gap-3 text-lg font-bold">
            <div>{phoneNumber}</div>
            <PhoneEnabledIcon className="text-3xl" />
          </div>
        )}

        {currentUser && (
          <Button className="w-fit self-center" variant="outlined" onClick={onChatOpen}>
            Open chat
          </Button>
        )}
      </section>
    </div>
  );
};

interface OwnerInfoProps {
  owner: UserDetails;
  onChatOpen: () => void;
}

export default OwnerInfo;
