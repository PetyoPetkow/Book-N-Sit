import { Avatar, Button, Divider } from '@mui/material';
import { FC } from 'react';
import PhoneEnabledIcon from '@mui/icons-material/PhoneEnabled';

const OwnerInfo: FC<OwnerInfoProps> = () => {
  return (
    <div className="flex flex-col h-full overflow-hidden border border-solid border-[#005C78] bg-[#F3F7EC] rounded-md">
      <div className=" flex items-center justify-center text-xl font-bold bg-[#006989] w-full h-14 text-white">
        Contacts
      </div>
      <Divider />
      <div className="flex justify-between p-2">
        <div>owner:</div>
        <div className="flex gap-2 font-bold">
          John Smith
          <Avatar />
        </div>
      </div>
      <div className="flex justify-between bg-white mx-4 px-4 py-2 rounded text-lg font-bold items-center">
        <div>+359 882114269</div>
        <PhoneEnabledIcon className="text-3xl" />
      </div>
      <Button className="w-fit m-auto mt-3" variant="outlined">
        Open chat
      </Button>
    </div>
  );
};

interface OwnerInfoProps {}

export default OwnerInfo;
