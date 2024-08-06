import { Button, Divider, InputLabel, TextField } from '@mui/material';
import { FC, useEffect, useState } from 'react';

import AddressAutocomplete from './AddressAutocomplete';
import WorkigHoursPicker from './WorkingHours/WorkingHoursPicker';
import InputFileUpload from './Images/UploadImages';
import Address from '../../../global/models/Address';
import WorkingHours from '../../../global/models/WorkingHours';
import DayOfWeek from '../../../global/models/DaysOfWeek';
import { getTime } from 'date-fns';
import { saveVenue, updateVenue } from '../../../firebase/queries/AddVenueQueries';
import { useAuth } from '../../../contexts/authContext';
import VenueTypeSelector from './VenueTypeSelector/VenueTypeSelector';
import VenuePerksSelector from './VenuePerksSelector/VenuePerksSelector';
import { useParams } from 'react-router-dom';
import { firestore } from '../../../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Venue from '../../../global/models/Venue';
import MapComponent from './MapComponent';

const AddVenue: FC<AddVenueProps> = () => {
  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<Address | null>(null);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [files, setFiles] = useState<FileList | null>(null);
  const [description, setDescription] = useState<string>('');
  const [selectedVenueTypes, setSelectedVenueTypes] = useState<string[]>([]);
  const [selectedPerks, setSelectedPerks] = useState<string[]>([]);
  const [workingHours, setWorkingHours] = useState<WorkingHours>({
    Monday: { openAt: null, closeAt: null },
    Tuesday: { openAt: null, closeAt: null },
    Wednesday: { openAt: null, closeAt: null },
    Thursday: { openAt: null, closeAt: null },
    Friday: { openAt: null, closeAt: null },
    Saturday: { openAt: null, closeAt: null },
    Sunday: { openAt: null, closeAt: null },
  });

  const { venueId } = useParams();
  const { currentUser } = useAuth();

  useEffect(() => {
    const setData = async () => {
      if (venueId !== undefined) {
        const docRef = doc(firestore, 'venues', venueId);
        const docSnap = await getDoc(docRef);
        const venue = docSnap.data() as Venue;
        const { name, address, coordinates, images, description, venueTypes, perks, workingHours } =
          venue;
        setName(name);
        setAddress(address);
        setCoordinates(coordinates);
        setDescription(description);
        setSelectedVenueTypes(venueTypes);
        setSelectedPerks(perks);
        setWorkingHours(workingHours);
      }
    };

    setData();
  }, []);

  return (
    <div className="flex align-middle justify-center items-center w-full">
      <div className="w-11/12 h-fit my-16 bg-white border-2 border-solid border-gray-200 p-10">
        <div className="flex flex-col gap-5 ">
          <div className="text-5xl">Register you venue</div>
          <div>Please fill out the form with relevant information about your venue.</div>
        </div>
        <Divider className="my-5" />
        <div className="flex flex-col gap-5">
          <div className="flex gap-10">
            <div className="flex-1 ">
              <InputLabel required>Name</InputLabel>
              <TextField
                required
                fullWidth
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div className="flex-1 ">
              <AddressAutocomplete
                address={address}
                onAddressChanged={(
                  address: Address | null,
                  coordinates: [number, number] | null
                ) => {
                  setAddress(address);
                  setCoordinates(coordinates);
                }}
              />
            </div>
          </div>
          <div>
            {coordinates && (
              <MapComponent
                lat={coordinates[0]}
                lng={coordinates[1]}
                setCoordinates={setCoordinates}
                draggable={true}
              />
            )}
          </div>
          <div>
            <InputFileUpload
              images={images}
              onImagesChanged={setImages}
              files={files}
              onAddFiles={setFiles}
            />
          </div>
          <div>
            <InputLabel>Description</InputLabel>
            <TextField
              className="w-full"
              rows={5}
              multiline
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
          <div className="my-4">
            <VenueTypeSelector
              selectedVenueTypes={selectedVenueTypes}
              onselectedVenueTypesChanged={(event, checked) => {
                setSelectedVenueTypes((prevState) => {
                  if (checked) {
                    return [...prevState, event.target.value];
                  } else {
                    return prevState.filter((type) => type !== event.target.value);
                  }
                });
              }}
            />
          </div>
          <div>
            <VenuePerksSelector
              selectedPerks={selectedPerks}
              onSelectedPerksChanged={(event, perks) => setSelectedPerks(perks)}
            />
          </div>
          <div>
            <WorkigHoursPicker
              workingHours={workingHours}
              onOpenAtChanged={(dayOfWeek: DayOfWeek, date: Date | null) => {
                setWorkingHours((prevState) => ({
                  ...prevState,
                  [dayOfWeek]: {
                    ...prevState[dayOfWeek],
                    openAt: date ? getTime(date) : null,
                  },
                }));
              }}
              onCloseAtChanged={(dayOfWeek: DayOfWeek, date: Date | null) => {
                setWorkingHours((prevState) => ({
                  ...prevState,
                  [dayOfWeek]: {
                    ...prevState[dayOfWeek],
                    closeAt: date ? getTime(date) : null,
                  },
                }));
              }}
            />
          </div>
          <div className="flex justify-end gap-5">
            <Button
              variant="contained"
              onClick={() => {
                if (address && coordinates && currentUser && currentUser.uid) {
                  if (venueId) {
                    updateVenue({
                      address: address,
                      coordinates: coordinates,
                      description: description,
                      name: name,
                      images: images,
                      userId: currentUser.uid,
                      perks: selectedPerks,
                      venueTypes: selectedVenueTypes,
                      workingHours: workingHours,
                      id: venueId,
                    });
                  } else {
                    saveVenue(
                      {
                        address: address,
                        coordinates: coordinates,
                        description: description,
                        name: name,
                        userId: currentUser.uid,
                        perks: selectedPerks,
                        venueTypes: selectedVenueTypes,
                        workingHours: workingHours,
                      },
                      files
                    );
                  }
                } else {
                  //console.log(address, coordinates, currentUser, currentUser?.uid);
                }
              }}
            >
              Publish
            </Button>
            <Button color="error" variant="contained">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface AddVenueProps {}

export default AddVenue;
