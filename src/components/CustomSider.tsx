import { AppstoreOutlined, ContainerOutlined, DesktopOutlined, MailOutlined, PieChartOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { ThemedLayoutV2, Sider, RefineThemedLayoutV2SiderProps } from "@refinedev/antd";
import { Menu } from "antd";
import { MenuProps } from "antd/lib";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const CustomSider: React.FC<RefineThemedLayoutV2SiderProps> = ({
  Title: TitleFromProps,
  render,
  meta,
  fixed,
  activeItemDisabled = false,
}) => {
  const isSelected = true;

  const linkStyle: React.CSSProperties =
    activeItemDisabled && isSelected
      ? { pointerEvents: "none" }
      : {};

  const [queues, setQueues] = useState<{
    [k: string]: {
      "id": string
      name: string
      "friendlyName": string
      "connectionId": string
      "status": object | null
    }
  }>({});

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isLoading && Object.keys(queues).length === 0) {
      setIsLoading(true);
      axios.get('/api/queues').then(resp => {
        setQueues(resp.data.queues)
      })
    }
  }, [isLoading, queues])


  return (
    <Sider
      render={({ items, logout }) => {
        const menuQueues = queues ? Object.keys(queues).map(key => {
          const name = queues[key].friendlyName
          const id = queues[key].id
          return <Menu.Item
            key={queues[key].id}
            icon={<UnorderedListOutlined />}
            style={linkStyle}
          >
            <Link to={"/queues/" + id}
              style={linkStyle}>
              {name}
            </Link>
          </Menu.Item>
        }) : []
        return <>
          {menuQueues}
          {items}
          {logout}
        </>
      }}
    />
  );
};

export default CustomSider