import { FC, useState } from 'react';
import { Drawer, Menu } from 'antd';
import { AppstoreOutlined, MailOutlined } from '@ant-design/icons';
import { MenuProps } from 'antd';
import { MenuClickEventHandler, MenuInfo } from 'rc-menu/lib/interface';
import { Link } from 'react-router-dom';
import { MenuOutlined } from '@ant-design/icons';

const Header: FC<HeaderProps> = () => {
  const [current, setCurrent] = useState<MenuKey>('Home');
  const [openMenu, setOpenMenu] = useState<boolean>(false);

  const menuConfig: MenuProps['items'] = [
    {
      label: <Link to="/">Home</Link>,
      key: 'Home',
      icon: <MailOutlined />,
    },
    {
      label: <Link to="/Account">Account</Link>,
      key: 'Account',
      icon: <AppstoreOutlined />,
    },
  ];

  const onClick: MenuClickEventHandler = (info: MenuInfo) => {
    setCurrent(info.key as MenuKey);
  };

  return (
    <>
      <Menu
        className="max-md:hidden"
        onClick={onClick}
        selectedKeys={[current]}
        mode="horizontal"
        items={menuConfig}
      />
      <div className="md:hidden">
        <div className="w-full border-b" onClick={() => setOpenMenu(true)}>
          <MenuOutlined className="text-4xl m-1" />
        </div>
        <Drawer size="large" open={openMenu} onClose={() => setOpenMenu(false)} placement="left">
          <Menu onClick={onClick} selectedKeys={[current]} mode="vertical" items={menuConfig} />
        </Drawer>
      </div>
    </>
  );
};

interface HeaderProps {}

type MenuKey = 'Home' | 'Account';

export default Header;
