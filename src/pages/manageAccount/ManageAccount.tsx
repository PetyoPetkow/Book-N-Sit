import { Button, Divider, LinearProgress, TextField } from '@mui/material';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import { useAuth } from '../../contexts/authContext';
import {
  updateProfilePicture,
  updateUser,
  uploadProfilePictureToStorage,
} from '../../firebase/services/UserService';
import UserDetails from '../../models/UserDetails';
import { useTranslation } from 'react-i18next';

const ManageAccount: FC<ManageAccountProps> = () => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  const { t } = useTranslation();
  const { currentUserDetails } = useAuth();

  useEffect(() => {
    setUserDetails(currentUserDetails);
  }, [currentUserDetails]);

  const handleUpdate = async () => {
    if (currentUserDetails && userDetails) {
      try {
        updateUser(currentUserDetails.id, userDetails);
        console.log('Profile updated successfully');
      } catch (error) {
        console.error('Error updating profile:', error);
        console.log('Error updating profile');
      }
    }
  };

  if (currentUserDetails === null || userDetails === null) return <LinearProgress />;

  return (
    <div className="flex flex-grow bg-white backdrop-blur-md bg-opacity-50 shadow-lg shadow-gray-700">
      {userDetails && (
        <div className="flex flex-grow max-md:flex-col gap-10 items-center">
          <div className="flex flex-col flex-grow items-center justify-center flex-1 px-14">
            <img className="h-56" src={userDetails.photoURL} alt="Avatar" />

            <Button component="label" role={undefined} tabIndex={-1}>
              {t('upload_image')}
              <input
                className="hidden"
                type="file"
                onChange={async (event: any) => {
                  const imageURL = await uploadProfilePictureToStorage(
                    currentUserDetails.id,
                    event.target.files[0]
                  );
                  await updateProfilePicture(currentUserDetails.id, imageURL);
                }}
              />
            </Button>
          </div>
          <Divider className="h-4/6 max-md:hidden" orientation="vertical" />
          <div className="flex-1 flex flex-col gap-6 px-14">
            <TextField
              label={t('username')}
              value={userDetails.displayName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const userDetailsCopy = structuredClone(userDetails);
                userDetailsCopy.displayName = e.target.value;
                setUserDetails(userDetailsCopy);
              }}
            />
            <TextField
              label={t('phone_number')}
              value={userDetails.phoneNumber}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const userDetailsCopy = structuredClone(userDetails);
                userDetailsCopy.phoneNumber = e.target.value;
                setUserDetails(userDetailsCopy);
              }}
            />
            <Button size="large" variant="contained" onClick={handleUpdate}>
              {t('btn_save')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

interface ManageAccountProps {}

export default ManageAccount;
