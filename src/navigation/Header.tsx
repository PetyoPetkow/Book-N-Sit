import { FC, useState } from 'react'
import { Menu } from 'antd'
import { AppstoreOutlined, MailOutlined } from '@ant-design/icons'
import { MenuProps } from 'antd'
import { MenuClickEventHandler, MenuInfo } from 'rc-menu/lib/interface'
import { Link } from 'react-router-dom'

const Header: FC<HeaderProps> = () => {
  const [current, setCurrent] = useState<MenuKey>('Home')

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
  ]

  const onClick: MenuClickEventHandler = (info: MenuInfo) => {
    setCurrent(info.key as MenuKey)
  }

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={menuConfig}
    />
  )
}

interface HeaderProps {}

type MenuKey = 'Home' | 'Account'

export default Header
