import { useTable, List } from "@refinedev/antd";
import { IResourceComponentsProps, useGo } from "@refinedev/core";
import { Button, Radio, Table, Tag, theme } from "antd";
import { EyeFilled, ThunderboltFilled as NewIcon } from "@ant-design/icons";

const { useToken } = theme;

export const ConnectionsList: React.FC<IResourceComponentsProps> = () => {
  const go = useGo();
  const { token } = useToken();

  const { tableProps } = useTable({
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
        <Table.Column dataIndex={"config"} title="Host" render={(v) => v.host+":"+v.port}/>
        <Table.Column dataIndex={"status"} title="Status" />
        <Table.Column
          dataIndex=""
          render={(value, record: any, index) => (
            <Button
              type="primary"
              icon={<EyeFilled />}
              onClick={() => {
                return true;
              }}
            ></Button>
          )}
        />
      </Table>
    </List>
  );
};