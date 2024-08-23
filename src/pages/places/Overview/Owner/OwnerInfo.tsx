import { Avatar, Button, Divider } from '@mui/material';
import { FC } from 'react';
import PhoneEnabledIcon from '@mui/icons-material/PhoneEnabled';
import { useAuth } from '../../../../contexts/authContext';

const OwnerInfo: FC<OwnerInfoProps> = ({ owner, onChatOpen }) => {
  const { currentUser } = useAuth();

  return (
    <div className="flex flex-col h-full overflow-hidden  bg-white">
      <div className=" flex items-center justify-center text-xl font-bold  w-full h-14 text-[#006989]">
        Contacts
      </div>
      <Divider className="mx-4 bg-[#006989]" />

      <section className="flex flex-col flex-grow items-center justify-evenly m-4">
        <div className="flex gap-2 font-bold items-center">
          <span>{owner && owner.displayName}</span>
          <Avatar className="shadow-sm shadow-black" src={owner.photoURL || ''} />
        </div>

        <div className="flex text-lg font-bold">
          <div>{owner && owner.phoneNumber}</div>
          <PhoneEnabledIcon className="text-3xl" />
        </div>

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
  owner: any;
  onChatOpen: () => void;
}

export default OwnerInfo;
