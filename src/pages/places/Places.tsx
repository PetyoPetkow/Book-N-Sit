import { cloneElement, FC, useEffect, useState } from 'react';
import { firestore } from '../../firebase/firebase';
import { Firestore, collection, getDocs, query, where } from 'firebase/firestore';
import { Autocomplete, Card, CardActionArea, CardMedia, Chip, TextField } from '@mui/material';
import Venue, { VenueType } from '../../global/models/Venue';
import { useNavigate, useParams } from 'react-router-dom';
import CityAutocomplete from './CityAutocomplete';
import { perksMock } from './Overview/Perks/PerksMock';
import Location from './Overview/Location';
import OpenClosed from './Overview/OpenClosed';

const Places: FC<PlacesProps> = () => {
  const [places, setPlaces] = useState<Venue[]>([]);
  const [city, setCity] = useState<string | null>(null);
  const [perks, setPerks] = useState<{ icon: JSX.Element; name: string }[]>([]);

  const navigate = useNavigate();
  const { category } = useParams();
  console.log(category);

  useEffect(() => {
    const getPlaces = async (firestore: Firestore) => {
      const conditions = [];

      if (city !== null) {
        conditions.push(where('city', '==', city));
      }
      if (perks.length !== 0) {
        perks.map((p) => {
          conditions.push(where(`perks.${p.name}`, '==', true));
        });
      }
      if (category !== undefined) {
        const routeToCategoryMapper: Record<string, VenueType> = {
          Restaurants: 'restaurant',
          Bars: 'bar',
        };

        const filter: string | undefined = routeToCategoryMapper[category];

        filter && conditions.push(where('venueTypes', 'array-contains', filter));
      }

      console.log(conditions);

      const placesCol = collection(firestore, 'venues');
      const placesQuery = query(placesCol, ...conditions);
      const placeSnapshot = await getDocs(placesQuery);
      const placeList = placeSnapshot.docs.map((doc) => {
        return { id: doc.id, ...(doc.data() as Venue) };
      });
      console.log(placeList);
      setPlaces(placeList);
    };

    getPlaces(firestore);
  }, [city, perks, category]);

  return (
    <div className="flex-grow bg-white backdrop-blur-md bg-opacity-50 shadow-lg shadow-gray-700 p-4">
      <div className=" flex w-4/5 m-auto gap-4 mt-8">
        <div className="flex-1 bg-white p-2 ">
          <CityAutocomplete city={city} onCityChanged={setCity} />
        </div>
        <div className="flex-1 bg-white p-2 ">
          <Autocomplete
            className="flex-nowrap text-nowrap"
            limitTags={2}
            multiple
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
      <div className="grid grid-cols-2 max-sm:grid-cols-1 justify-center w-full gap-10 mt-10">
        {places.map(
          ({ name, city, street, description, images, id, workingHours }: Venue, index: number) => {
            return (
              <Card key={name} className="col-span-1 max-md:max-w-full truncate text-wrap">
                <CardActionArea
                  className="h-full w-full flex flex-col justify-start items-start"
                  onClick={(event) => {
                    navigate(`${encodeURI(id!)}`);
                  }}
                >
                  <div className="w-full">
                    <CardMedia className="aspect-video w-full" image={images[0] as string} />
                  </div>

                  <section className="p-2 flex-grow">
                    <div className="text-xl font-bold indent-3">{name}</div>
                    <div className="flex justify-between flex-grow">
                      <Location
                        className="bg-[#F3F7EC] w-fit pr-3 py-0 -ml-2 rounded-full scale-90"
                        iconSize="small"
                        city={city}
                        street={street}
                      />
                      <OpenClosed workingHours={workingHours} />
                    </div>
                    <div className="mt-1">
                      <span>{description}</span>
                      <div className="absolute bottom-0 w-full h-5 bg-gradient-to-t from-white via-white to-transparent" />
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

const mock = [
  {
    title: 'Bianco',
    address: 'Велико Търново Център, пл. „Майка България“ 1, 5000 Велико Търново',
    workingTime: '08:00 - 00:00',
    src: 'https://t3.ftcdn.net/jpg/03/24/73/92/360_F_324739203_keeq8udvv0P2h1MLYJ0GLSlTBagoXS48.jpg',
  },
  {
    title: 'Lino Bar',
    address: 'Veliko Tarnovo, Nezavisimost St 3',
    workingTime: '08:00 - 00:00',
    src: 'https://c.ndtvimg.com/2023-11/c4bp49g_restaurant-generic_625x300_21_November_23.jpg?im=FeatureCrop,algorithm=dnn,width=1200,height=738',
  },
  {
    title: 'Стратилат',
    address: 'ж.к. Варуша-север, ул. „Георги С. Раковски“ 11, 5000 Велико Търново',
    workingTime: '08:00 - 20:00',
    src: 'https://assets.vogue.com/photos/618e7c4badd0a25be01d750e/master/w_2560%2Cc_limit/GettyImages-1222654885.jpg',
  },
  {
    title: 'Bianco',
    address: 'Велико Търново Център, пл. „Майка България“ 1, 5000 Велико Търново',
    workingTime: '08:00 - 00:00',
    src: 'https://www.viajoteca.com/wp-content/uploads/2015/03/Cafe-de-Flore-Capa.jpg',
  },
  {
    title: 'Lino Bar',
    address: 'Veliko Tarnovo, Nezavisimost St 3',
    workingTime: '08:00 - 00:00',
    src: 'https://www.foodandwine.com/thmb/8rtGtUmtC0KiJCDxAUXP_cfwgM8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GTM-Best-US-Bars-Katana-Kitten-FT-BLOG0423-fa9f2ba9925c47abb4afb0abd25d915a.jpg',
  },
  {
    title: 'Стратилат',
    address: 'ж.к. Варуша-север, ул. „Георги С. Раковски“ 11, 5000 Велико Търново',
    workingTime: '08:00 - 20:00',
    src: 'https://t3.ftcdn.net/jpg/03/24/73/92/360_F_324739203_keeq8udvv0P2h1MLYJ0GLSlTBagoXS48.jpg',
  },
  {
    title: 'Bianco',
    address: 'Велико Търново Център, пл. „Майка България“ 1, 5000 Велико Търново',
    workingTime: '08:00 - 00:00',
    src: 'https://i.pinimg.com/736x/b4/01/dc/b401dc64405c4d9de4f1cf8afc412136.jpg',
  },
  {
    title: 'Lino Bar',
    address: 'Veliko Tarnovo, Nezavisimost St 3',
    workingTime: '08:00 - 00:00',
    src: 'https://t3.ftcdn.net/jpg/03/24/73/92/360_F_324739203_keeq8udvv0P2h1MLYJ0GLSlTBagoXS48.jpg',
  },
  {
    title: 'Стратилат',
    address: 'ж.к. Варуша-север, ул. „Георги С. Раковски“ 11, 5000 Велико Търново',
    workingTime: '08:00 - 20:00',
    src: 'https://t3.ftcdn.net/jpg/03/24/73/92/360_F_324739203_keeq8udvv0P2h1MLYJ0GLSlTBagoXS48.jpg',
  },
];

export default Places;
