import { useTable, List, DeleteButton } from "@refinedev/antd";
import { IResourceComponentsProps, useGo } from "@refinedev/core";
import { Button, Flex, Table, theme } from "antd";
import { Connection } from "../../@types";
import { DeleteIcon, EditIcon, NewConnectionIcon, RedisDisconnectedIcon } from "../../components/Icons";

const { useToken } = theme;

export const ConnectionsList: React.FC<IResourceComponentsProps> = () => {
  const go = useGo();
  const { token } = useToken();

  const { tableProps } = useTable<Connection>({
    syncWithLocation: true,
    dataProviderName: "connections",
    resource: "connections",
    pagination: {
      mode: "off"
    },
  });


  return (
    <List
      headerButtons={() => (
        <Button
          type="primary"
          icon={<NewConnectionIcon />}
          onClick={() => {
            go({
              to: "create",
              type: "push",
            });
          }}
          style={{
            color: token.colorTextBase,
          }}
        >
          New Connection
        </Button>
      )}
    >
      <Table
        {...tableProps}
        dataSource={tableProps.dataSource?.toSorted((a, b) => {
          if (a.id.toLocaleLowerCase() > b.id.toLocaleLowerCase()) return 1;
          if (a.id.toLocaleLowerCase() < b.id.toLocaleLowerCase()) return -1;
          return 0;

        })}
        rowKey="id"
        bordered
        size="small"
      >
        <Table.Column dataIndex={"id"} title="ID" />
        <Table.Column dataIndex={"config"} title="Host" render={(v: Connection["config"]) => v.host + ":" + v.port + "/db" + v.db} />
        <Table.Column dataIndex={"status"} title="Status" render={(v: string) => {
          if (v === "connecting" || v === "reconnecting") return <><RedisDisconnectedIcon /> {v}</>
          return <>{v}</>
        }} />
        <Table.Column
          dataIndex="id"
          render={(value: Connection["id"]) => (
            <Flex gap={"10px"}><Button
              type="primary"
              icon={<EditIcon />}
              onClick={() => {
                go({
                  to: {
                    action: "edit",
                    resource: "connections",
                    id: value
                  }
                })
              }}
            ></Button>
              <DeleteButton hideText={true} recordItemId={value} resource="connections" dataProviderName="connections" icon={<DeleteIcon />}></DeleteButton>
            </Flex>
          )}
        />
      </Table>
    </List>
  );
};
