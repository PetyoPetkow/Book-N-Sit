import { Button, CircularProgress, Divider, InputLabel, TextField } from '@mui/material';
import { FC, useEffect, useState } from 'react';

import AddressAutocomplete from '../venue/AddressAutocomplete';
import WorkigHoursPicker from '../venue/WorkingHours/WorkingHoursPicker';
import InputFileUpload from './UploadImages';
import WorkingHours from '../../models/WorkingHours';
import { DayOfWeek } from '../../models/DaysOfWeek';
import { useAuth } from '../../contexts/authContext';
import VenueTypeSelector from './VenueTypeSelector';
import VenuePerksSelector from './VenuePerksSelector';
import { useNavigate, useParams } from 'react-router-dom';
import Venue, { PerksMap, VenueCreate, VenueType } from '../../models/Venue';
import MapComponent from './MapComponent';
import { createVenue, getVenueById, updateVenue } from '../../firebase/services/VenuesService';

// TODO protect editing of venues that are not property of the current user
const defaultOpeningTime = () => new Date().setHours(8, 0, 0, 0);
const defaultClosingTime = () => new Date().setHours(22, 0, 0, 0);

const AddVenue: FC<AddVenueProps> = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [street, setStreet] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [files, setFiles] = useState<FileList | null>(null);
  const [description, setDescription] = useState<string>('');
  const [selectedVenueTypes, setSelectedVenueTypes] = useState<VenueType[]>([]);
  const [selectedPerks, setSelectedPerks] = useState<PerksMap>({
    free_wifi: false,
    personalized_events: false,
    sushi_menu: false,
    wine_list: false,
    cocktails: false,
  });
  const [isWorkingHoursValid, setIsWorkingHoursValid] = useState<boolean>(true);

  const [workingHours, setWorkingHours] = useState<WorkingHours>({
    monday: { openAt: defaultOpeningTime(), closeAt: defaultClosingTime() },
    tuesday: { openAt: defaultOpeningTime(), closeAt: defaultClosingTime() },
    wednesday: { openAt: defaultOpeningTime(), closeAt: defaultClosingTime() },
    thursday: { openAt: defaultOpeningTime(), closeAt: defaultClosingTime() },
    friday: { openAt: defaultOpeningTime(), closeAt: defaultClosingTime() },
    saturday: { openAt: null, closeAt: null },
    sunday: { openAt: null, closeAt: null },
  });

  const { venueId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const setData = async () => {
      if (venueId !== undefined) {
        const venue = await getVenueById(venueId);

        if (venue !== null) {
          const {
            name,
            city,
            street,
            images,
            coordinates,
            description,
            venueTypes,
            perks,
            workingHours,
          } = venue;
          setName(name);
          setCity(city);
          setStreet(street);
          setImages(images);
          setCoordinates(coordinates);
          setDescription(description);
          setSelectedVenueTypes(venueTypes);
          setSelectedPerks(perks);
          setWorkingHours(workingHours);
        }
      }
    };

    setData();
  }, []);

  const onSubmitCreate = async (venue: VenueCreate) => {
    const createdVenueId = await createVenue(venue, files!);

    navigate(`/all/${createdVenueId}`);
  };

  const onSubmitUpdate = async (venue: Venue) => {
    await updateVenue(venueId!, venue);

    navigate(`/all/${venueId}`);
  };

  return (
    <div className="flex align-middle justify-center items-center w-full">
      <div className="w-11/12 h-fit my-16 bg-white border-2 border-solid border-gray-200 p-10">
        {venueId === undefined && (
          <>
            <div className="flex flex-col gap-5 ">
              <div className="text-5xl">Register you venue</div>
              <div>Please fill out the form with relevant information about your venue.</div>
            </div>
            <Divider className="my-5" />
          </>
        )}
        <div className="flex flex-col gap-5">
          <div className="flex gap-10">
            <div className="flex-1 ">
              <InputLabel required>Name</InputLabel>
              <TextField
                required
                fullWidth
                value={name}
                onChange={(event) => setName(event.target.value ? event.target.value : null)}
              />
            </div>
            <div className="flex-1 ">
              <AddressAutocomplete
                disabled={isLoading}
                city={city}
                onCityChanged={(city: string | null, coordinates: [number, number] | null) => {
                  setCity(city);
                  setCoordinates(coordinates);
                }}
              />
            </div>
            <div className="flex-1">
              <InputLabel>Street</InputLabel>
              <TextField
                value={street}
                onChange={(event) => setStreet(event.target.value || null)}
                fullWidth
              />
            </div>
          </div>
          <div>
            {coordinates && (
              <MapComponent
                lat={coordinates[0]}
                lng={coordinates[1]}
                setCoordinates={setCoordinates}
                draggable={isLoading === false}
              />
            )}
          </div>
          {!venueId && (
            <div>
              <InputFileUpload
                disabled={isLoading}
                images={images}
                onImagesChanged={setImages}
                files={files}
                onAddFiles={setFiles}
              />
              {files === null && <span className="text-red-800">*Images are required</span>}
            </div>
          )}
          <div>
            <InputLabel className="text-lg font-bold text-black">Description</InputLabel>
            <TextField
              className="w-full"
              disabled={isLoading}
              rows={5}
              multiline
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
          <div className="my-4">
            <VenueTypeSelector
              disabled={isLoading}
              selectedVenueTypes={selectedVenueTypes}
              onselectedVenueTypesChanged={(event, checked) => {
                setSelectedVenueTypes((prevState) => {
                  if (checked) {
                    return [...prevState, event.target.value as VenueType];
                  } else {
                    return prevState.filter((type) => type !== event.target.value);
                  }
                });
              }}
            />
          </div>
          <div>
            <VenuePerksSelector
              disabled={isLoading}
              selectedPerks={selectedPerks}
              onSelectedPerksChanged={(event, perks) => {
                setSelectedPerks(perks);
              }}
            />
          </div>
          <div>
            <WorkigHoursPicker
              disabled={isLoading}
              onValidityChange={setIsWorkingHoursValid}
              workingHours={workingHours}
              onOpenAtChanged={(dayOfWeek: DayOfWeek, date: Date | null) => {
                setWorkingHours((prevState) => ({
                  ...prevState,
                  [dayOfWeek]: {
                    ...prevState[dayOfWeek],
                    openAt: date && !isNaN(date.getTime()) ? date.getTime() : null,
                  },
                }));
              }}
              onCloseAtChanged={(dayOfWeek: DayOfWeek, date: Date | null) => {
                console.log(date);
                setWorkingHours((prevState) => ({
                  ...prevState,
                  [dayOfWeek]: {
                    ...prevState[dayOfWeek],
                    closeAt: date && !isNaN(date.getTime()) ? date.getTime() : null,
                  },
                }));
              }}
            />
          </div>
          <div className="flex justify-end gap-5">
            <Button
              disabled={!currentUser || !city || !coordinates || !name || !isWorkingHoursValid}
              variant="contained"
              onClick={async () => {
                setIsLoading(true);
                if (currentUser && city && coordinates && name && isWorkingHoursValid) {
                  if (venueId) {
                    onSubmitUpdate({
                      id: venueId,
                      perks: selectedPerks,
                      userId: currentUser.uid,
                      venueTypes: selectedVenueTypes,
                      city,
                      coordinates,
                      description,
                      images,
                      name,
                      street,
                      workingHours,
                    });
                  } else {
                    onSubmitCreate({
                      perks: selectedPerks,
                      userId: currentUser.uid,
                      venueTypes: selectedVenueTypes,
                      city,
                      coordinates,
                      description,
                      name,
                      street,
                      workingHours,
                    });
                  }
                }
                setIsLoading(false);
              }}
            >
              {
                <div className="flex gap-3 items-center">
                  {isLoading && <CircularProgress size={20} color="info" />}
                  Publish
                </div>
              }
            </Button>
            <Button
              color="error"
              variant="contained"
              onClick={() => {
                navigate(-1);
              }}
            >
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
