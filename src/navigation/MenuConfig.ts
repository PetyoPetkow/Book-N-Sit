import LocalCafeOutlinedIcon from '@mui/icons-material/LocalCafeOutlined';
import LocalBarOutlinedIcon from '@mui/icons-material/LocalBarOutlined';
import SportsBarOutlinedIcon from '@mui/icons-material/SportsBarOutlined';
import RestaurantMenuOutlinedIcon from '@mui/icons-material/RestaurantMenuOutlined';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import WineBarOutlinedIcon from '@mui/icons-material/WineBarOutlined';
import LocalDrinkOutlinedIcon from '@mui/icons-material/LocalDrinkOutlined';
import NightlifeOutlinedIcon from '@mui/icons-material/NightlifeOutlined';

const menuConfig = [
  {
    label: 'header_btn_all',
    path: '/all',
  },
  {
    label: 'header_btn_restaurants',
    path: '/restaurants',
    icon: RestaurantMenuOutlinedIcon,
  },
  {
    label: 'header_btn_cafes',
    path: '/cafes',
    icon: LocalCafeOutlinedIcon,
  },
  {
    label: 'header_btn_bars',
    path: '/bars',
    icon: LocalBarOutlinedIcon,
  },
  {
    label: 'header_btn_pubs',
    path: '/pubs',
    icon: LocalDrinkOutlinedIcon,
  },
  {
    label: 'header_btn_bakeries',
    path: '/bakeries',
    icon: CakeOutlinedIcon,
  },
  {
    label: 'header_btn_wineries',
    path: '/wineries',
    icon: WineBarOutlinedIcon,
  },
  {
    label: 'header_btn_breweries',
    path: '/breweries',
    icon: SportsBarOutlinedIcon,
  },
  {
    label: 'header_btn_night_clubs',
    path: '/nightClubs',
    icon: NightlifeOutlinedIcon,
  },
];

export default menuConfig;
