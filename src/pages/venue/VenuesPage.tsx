import { FC, useEffect, useMemo, useState } from 'react';
import { firestore } from '../../firebase/firebase';
import { collection, endAt, getDocs, orderBy, query, startAt, where } from 'firebase/firestore';
import {
  Autocomplete,
  Card,
  CardActionArea,
  CardMedia,
  Chip,
  Divider,
  TextField,
} from '@mui/material';
import Venue, { VenueType } from '../../models/Venue';
import { useNavigate, useParams } from 'react-router-dom';
import Location from '../overview/Location';
import { useAuth } from '../../contexts/authContext';
import { DayOfWeek } from '../../models/DaysOfWeek';
import clsx from 'clsx';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { perksIcons } from '../overview/PerksList';

const VenuesPage: FC<VenuesPageProps> = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [city, setCity] = useState<string | null>(null);
  const [perks, setPerks] = useState<{ icon: JSX.Element; name: string }[]>([]);

  const perksOptions = useMemo(() => {
    return Object.entries(perksIcons).map(([perk, icon]) => ({
      name: perk,
      icon: icon,
    }));
  }, [perksIcons]);

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
  const { t } = useTranslation();
  const { category } = useParams();
  const { currentUser } = useAuth();

  const today = useMemo(() => new Date(), []);
  const dayOfWeek = useMemo(() => daysOfWeek[today.getDay()], [today]);

  useEffect(() => {
    const getPlaces = async () => {
      const conditions = [];

      if (city !== '' && city !== null) {
        const cityToStartCase = _.startCase(_.toLower(city));

        conditions.push(
          orderBy('city'),
          startAt(cityToStartCase),
          endAt(`${cityToStartCase}\uf8ff`)
        );
      }
      if (perks.length !== 0) {
        perks.map((perk) => {
          conditions.push(where(`perks.${perk.name}`, '==', true));
        });
      }

      if (location.pathname === '/myVenues') {
        currentUser !== null && conditions.push(where('userId', '==', currentUser.uid));
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

      if (category !== undefined && category !== 'all') {
        const routeToCategoryMapper: Record<string, VenueType> = {
          restaurants: 'restaurant',
          cafes: 'cafe',
          bars: 'bar',
          pubs: 'pub',
          bakeries: 'bakery',
          wineries: 'winery',
          breweries: 'brewery',
          nightClubs: 'night_club',
        };

        venues = placeList.filter((venue) =>
          venue.venueTypes.includes(routeToCategoryMapper[category])
        );
      } else {
        venues = placeList;
      }

      setVenues(venues);
    };

    getPlaces();
  }, [city, perks, category]);

  return (
    <div className="flex-grow flex flex-col gap-10 bg-white backdrop-blur-md bg-opacity-50 shadow-lg shadow-gray-700 ">
      <div>
        <div className="flex max-lg:flex-col min-h-20 h-fit items-center gap-10 p-4">
          <TextField
            fullWidth
            size="small"
            label={t('label_venue_city')}
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <Autocomplete
            className="flex-nowrap text-nowrap"
            fullWidth
            multiple
            size="small"
            options={perksOptions}
            disableCloseOnSelect
            getOptionLabel={(option) => option.name}
            renderOption={(props, option, state) => (
              <li {...props}>
                <div className="flex gap-2">
                  <div className="mr-2">{option.icon}</div>
                  <div>{t(option.name)}</div>
                </div>
              </li>
            )}
            value={perks}
            onChange={(event, value) => {
              const uniqueValue = value.filter(
                (v, index, self) => index === self.findIndex((t) => t.name === v.name)
              );
              setPerks(uniqueValue);
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  size="small"
                  label={t(option.name)}
                  icon={option.icon}
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label={t('filters')} />
            )}
          />
        </div>
        <Divider />
      </div>

      <div className="grid grid-cols-2 max-sm:grid-cols-1 justify-center  gap-10 px-4 pb-4">
        {venues.map(
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
                  onClick={() => {
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
                          city={city}
                          street={street}
                        />
                        <div>
                          <span className={clsx(isOpen ? 'text-green-800' : 'text-red-800')}>
                            {isOpen ? t('open') : t('closed')}
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

interface VenuesPageProps {}

export default VenuesPage;
