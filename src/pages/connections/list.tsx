import { useTable, List } from "@refinedev/antd";
import { GetListResponse, IResourceComponentsProps, useGo } from "@refinedev/core";
import { Button, Table, theme } from "antd";
import { EyeFilled, ThunderboltFilled as NewIcon } from "@ant-design/icons";
import { Connection } from "../../@types";

const { useToken } = theme;

export const ConnectionsList: React.FC<IResourceComponentsProps> = () => {
  const go = useGo();
  const { token } = useToken();

  const { tableProps } = useTable<GetListResponse<Connection>>({
    syncWithLocation: true,
    dataProviderName: "connections",
    resource: "connections",
    pagination: {
      pageSize: 10,
    },
  });

  return (
    <List
    headerButtons={() => (
      <Button
        type="primary"
        icon={<NewIcon />}
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
        rowKey="label"
        pagination={{ showSizeChanger: true }}
        bordered
        size="small"
      >
        <Table.Column dataIndex={"id"} title="ID" />
        <Table.Column dataIndex={"config"} title="Host" render={(v: Connection["config"]) => v.host+":"+v.port+"/db"+v.db}/>
        <Table.Column dataIndex={"status"} title="Status" />
        <Table.Column
          dataIndex="id"
          render={(value: Connection["id"]) => (
            <Button
              type="primary"
              icon={<EyeFilled />}
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
          )}
        />
      </Table>
    </List>
  );
};
