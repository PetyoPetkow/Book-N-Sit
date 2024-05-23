import { FC, useEffect, useState } from 'react';
import { Card } from 'antd';
import { firestore } from '../../firebase/firebase';
import { Firestore, collection, getDocs } from 'firebase/firestore';

const Places: FC<PlacesProps> = () => {
  const [places, setPlaces] = useState<Place[]>([]);

  const { Meta } = Card;

  useEffect(() => {
    const getPlaces = async (firestore: Firestore) => {
      const placesCol = collection(firestore, 'places');
      const placeSnapshot = await getDocs(placesCol);
      const placeList = placeSnapshot.docs.map((doc) => doc.data() as Place);
      console.log(placeList);
      setPlaces(placeList);
    };

    getPlaces(firestore);
  }, []);

  return (
    <>
      <div className="flex flex-wrap justify-center w-full gap-10 mt-10">
        {places.map(({ name, address, description }: Place, index: number) => {
          return (
            <Card
              key={name}
              className="w-96 h-[450px] truncate text-wrap"
              hoverable
              cover={<img className="h-60" alt="example" src={mock[index].src} />}
            >
              <Meta title={name} description={address} />
              <div>
                <span>{description}</span>
                <div className="absolute bottom-0 w-full h-12 bg-gradient-to-t from-white via-white to-transparent"></div>
              </div>
            </Card>
          );
        })}
      </div>
    </>
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
