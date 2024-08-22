import { cloneElement, FC, useEffect, useMemo, useState } from 'react';
import { firestore } from '../../firebase/firebase';
import {
  Firestore,
  collection,
  endAt,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  startAt,
  where,
} from 'firebase/firestore';
import {
  Autocomplete,
  Card,
  CardActionArea,
  CardMedia,
  Chip,
  Divider,
  TextField,
} from '@mui/material';
import Venue, { VenueType } from '../../global/models/Venue';
import { useNavigate, useParams } from 'react-router-dom';
import CityAutocomplete from './CityAutocomplete';
import { perksMock } from './Overview/Perks/PerksMock';
import Location from './Overview/Location';
import { useAuth } from '../../contexts/authContext';
import DayOfWeek from '../../global/models/DaysOfWeek';
import clsx from 'clsx';
import _ from 'lodash';

const Places: FC<PlacesProps> = () => {
  const [places, setPlaces] = useState<Venue[]>([]);
  const [city, setCity] = useState<string | null>(null);
  const [perks, setPerks] = useState<{ icon: JSX.Element; name: string }[]>([]);

  const daysOfWeek: DayOfWeek[] = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];

  const navigate = useNavigate();
  const { category } = useParams();
  const { currentUser } = useAuth();

  const today = useMemo(() => new Date(), []);
  const dayOfWeek = useMemo(() => daysOfWeek[today.getDay()], [today]);

  useEffect(() => {
    if (currentUser === null) return;

    const getPlaces = async (firestore: Firestore) => {
      const conditions = [];

      if (city !== '' && city !== null) {
        const cityToCapitalized = _.startCase(_.toLower(city));

        conditions.push(
          orderBy('city'),
          startAt(cityToCapitalized),
          endAt(`${cityToCapitalized}\uf8ff`)
        );
      }
      if (perks.length !== 0) {
        perks.map((p) => {
          conditions.push(where(`perks.${p.name}`, '==', true));
        });
      }

      if (location.pathname === '/MyVenues') {
        conditions.push(where('userId', '==', currentUser.uid));
      }

      const placesCol = collection(firestore, 'venues');

      const placesQuery = query(placesCol, ...conditions);
      const placeSnapshot = await getDocs(placesQuery);
      const placeList = placeSnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Venue
      );

      let venues: Venue[] = [];

      if (category !== undefined && category !== 'All') {
        const routeToCategoryMapper: Record<string, VenueType> = {
          Restaurants: 'restaurant',
          Cafes: 'cafe',
          Bars: 'bar',
          Pubs: 'pub',
          Bakeries: 'bakery',
          Wineries: 'winery',
          Breweries: 'brewery',
          NightClubs: 'night_club',
        };

        venues = placeList.filter((venue) =>
          venue.venueTypes.includes(routeToCategoryMapper[category])
        );
      } else {
        venues = placeList;
      }

      setPlaces(venues);
    };

    getPlaces(firestore);
  }, [city, perks, category]);

  return (
    <div className="flex-grow flex flex-col gap-10 bg-white backdrop-blur-md bg-opacity-50 shadow-lg shadow-gray-700 ">
      <div>
        <div className="flex w-full min-h-20 h-fit gap-4 items-center">
          <div className="flex-1 px-20">
            <TextField
              fullWidth
              size="small"
              label="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="flex-1 px-20">
            <Autocomplete
              className="flex-nowrap text-nowrap"
              limitTags={2}
              multiple
              size="small"
              options={perksMock}
              disableCloseOnSelect
              getOptionLabel={(option) => option.name}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  {cloneElement(option.icon, { style: { fontSize: 18, marginRight: 8 } })}
                  {option.name}
                </li>
              )}
              value={perks}
              onChange={(event, value) => {
                setPerks(value);
              }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    size="small"
                    label={option.name}
                    icon={option.icon}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => <TextField {...params} variant="outlined" label="Filters" />}
            />
          </div>
        </div>
        <Divider />
      </div>

      <div className="grid grid-cols-2 max-sm:grid-cols-1 justify-center  gap-10 px-4 pb-4">
        {places.map(
          ({ name, city, street, description, images, id, workingHours }: Venue, index: number) => {
            const openAt = workingHours[dayOfWeek].openAt;
            const closeAt = workingHours[dayOfWeek].closeAt;

            let isOpen = false;

            if (openAt && closeAt) {
              const openAtDate = new Date(openAt);
              const closeAtDate = new Date(closeAt);

              const openAtInMinutes = openAtDate.getHours() * 60 + openAtDate.getMinutes();
              const closeAtInMinutes = closeAtDate.getHours() * 60 + closeAtDate.getMinutes();
              const todayTimeInMinutes = today.getHours() * 60 + today.getMinutes();

              if (openAtInMinutes <= todayTimeInMinutes && closeAtInMinutes >= todayTimeInMinutes) {
                isOpen = true;
              }
            }

            return (
              <Card
                key={name}
                className="col-span-1 max-sm:grid-col-span-2 max-md:max-w-full truncate text-wrap"
              >
                <CardActionArea
                  className="flex flex-col justify-start items-start"
                  onClick={(event) => {
                    navigate(`${encodeURI(id!)}`);
                  }}
                >
                  <div className="w-full">
                    <CardMedia className="aspect-video w-full" image={images[0] as string} />
                  </div>

                  <section className="w-full">
                    <div className="p-2">
                      <div className="text-xl font-bold indent-3">{name}</div>

                      <div className="flex justify-between flex-grow">
                        <Location
                          className="bg-[#F3F7EC] w-fit pr-3 py-0 -ml-2 rounded-full scale-90"
                          iconSize="small"
                          city={city}
                          street={street}
                        />
                        <div>
                          <span className={clsx(isOpen ? 'text-green-800' : 'text-red-800')}>
                            {isOpen ? 'Open ⋅ ' : 'Closed ⋅ '}
                          </span>
                          <span>
                            {workingHours[dayOfWeek] &&
                              `${new Date(workingHours[dayOfWeek].openAt || 0).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(workingHours[dayOfWeek].closeAt || 0).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                          </span>
                        </div>
                      </div>

                      <div className="mt-1">
                        <span>{description}</span>
                        <div className="absolute bottom-0 w-full h-5 bg-gradient-to-t from-white via-white to-transparent" />
                      </div>
                    </div>
                  </section>
                </CardActionArea>
              </Card>
            );
          }
        )}
      </div>
    </div>
  );
};

interface PlacesProps {}

interface Place {
  name: string;
  address: string;
  description: string;
}

export default Places;
