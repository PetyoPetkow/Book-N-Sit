import { Avatar, Button, Divider } from '@mui/material';
import { FC } from 'react';
import PhoneEnabledIcon from '@mui/icons-material/PhoneEnabled';
import { useAuth } from '../../../../contexts/authContext';

const OwnerInfo: FC<OwnerInfoProps> = ({ onChatOpen }) => {
  const { currentUser } = useAuth();

  return (
    <div className="flex flex-col h-full overflow-hidden  bg-white">
      <div className=" flex items-center justify-center text-xl font-bold  w-full h-14 text-[#006989]">
        Contacts
      </div>
      <Divider className="mx-4 bg-[#006989]" />

      <section className="flex flex-col flex-grow items-center justify-evenly m-4">
        <div className="flex gap-2 font-bold items-center">
          <span>John Smith</span>
          <Avatar />
        </div>

        <div className="flex text-lg font-bold">
          <div>+359 882114269</div>
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
  onChatOpen: () => void;
}

export default OwnerInfo;
