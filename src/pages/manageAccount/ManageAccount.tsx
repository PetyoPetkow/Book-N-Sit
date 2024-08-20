import { Button, Divider, styled, TextField } from '@mui/material';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import { useAuth } from '../../contexts/authContext';
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../firebase/firebase';
import { getUserById, uploadProfilePicture } from '../../firebase/services/UserService';
import { doUpdateProfile } from '../../firebase/auth';

const ManageAccount: FC<ManageAccountProps> = () => {
  const [userData, setUserData] = useState<any>();
  const { currentUser } = useAuth();

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  useEffect(() => {
    if (currentUser) {
      const fetchUserData = async () => {
        try {
          const user = await getUserById(currentUser.uid);

          setUserData(user);
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          //setLoading(false);
        }
      };

      fetchUserData();
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      const unSub = onSnapshot(doc(firestore, 'users', currentUser.uid), (doc) => {
        doc.exists() && setUserData(doc.data());
      });

      return () => {
        unSub();
      };
    }
  }, [currentUser]);

  const handleUpdate = async () => {
    if (currentUser) {
      try {
        const userDoc = doc(firestore, 'users', currentUser.uid);
        await setDoc(userDoc, userData, { merge: true });
        await doUpdateProfile({ ...userData });
        console.log('Profile updated successfully');
      } catch (error) {
        console.error('Error updating profile:', error);
        console.log('Error updating profile');
      }
    }
  };

  const updatePhotoURL = async (userRef: any, imageUrl: string) => {
    try {
      await updateDoc(userRef, {
        photoURL: imageUrl, // Update just the photoUrl field
      });

      console.log('Photo URL updated successfully');
    } catch (error) {
      console.error('Error updating photo URL:', error);
    }
  };

  return (
    <div className="flex flex-col flex-grow bg-white backdrop-blur-md bg-opacity-50 shadow-lg shadow-gray-700">
      {userData && (
        <>
          <div className="flex flex-grow">
            <div className="flex flex-grow gap-10 justify-center items-center">
              <div className="flex flex-col items-center justify-center flex-1 px-14">
                <img className="h-56" src={userData.photoURL} alt="Avatar" />
                {/* <Button role={undefined} tabIndex={-1}>
                  Change image
                  <VisuallyHiddenInput
                    type="file"
                    onChange={async (event: any) => {
                      const imageUrl = await uploadProfilePicture(
                        currentUser!.uid,
                        event.target.file
                      );
                      const userRef = doc(firestore, 'users', currentUser!.uid);
                      if (imageUrl) {
                        await updatePhotoURL(userRef, imageUrl);
                      }
                    }}
                  />
                </Button> */}
                <Button
                  component="label"
                  role={undefined}
                  tabIndex={-1}
                  //startIcon={<CloudUploadIcon />}
                >
                  Upload Images
                  <VisuallyHiddenInput
                    type="file"
                    onChange={async (event: any) => {
                      const imageUrl = await uploadProfilePicture(
                        currentUser!.uid,
                        event.target.files[0]
                      );
                      const userRef = doc(firestore, 'users', currentUser!.uid);
                      if (imageUrl) {
                        await updatePhotoURL(userRef, imageUrl);
                        await doUpdateProfile({
                          photoURL: imageUrl,
                        });
                      }
                    }}
                  />
                </Button>
              </div>
              <Divider className="h-4/6" orientation="vertical" />
              <div className="flex-1 flex flex-col gap-6 px-14">
                <TextField
                  label="Username"
                  value={userData.username}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setUserData((prevData: any) => ({
                      ...prevData,
                      username: e.target.value,
                    }))
                  }
                />
                <TextField label="Phone Number" value={userData.phoneNumber} />
                <Button size="large" variant="contained" onClick={handleUpdate}>
                  Save
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

interface ManageAccountProps {}

export default ManageAccount;
