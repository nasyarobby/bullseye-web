import { useTable, List } from "@refinedev/antd";
import { IResourceComponentsProps, useGo } from "@refinedev/core";
import { Button, Table, theme } from "antd";
// import { useParams } from "react-router-dom";
import { EyeFilled, ThunderboltFilled as NewIcon } from "@ant-design/icons";

const { useToken } = theme;

export const QueuesList: React.FC<IResourceComponentsProps> = () => {
  const { token } = useToken();
  const go = useGo();
  // const params = useParams<{ name: string }>()
  // const customStyle: React.CSSProperties = { color: token.colorTextBase };

  const { tableProps } = useTable({
    syncWithLocation: true,
    resource: "queues",
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
          Add Queue
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
        <Table.Column dataIndex={"friendlyName"} title="Name" />
        <Table.Column
          dataIndex={"queueName"}
          title="Bull Queue Name"
        />
        <Table.Column
          dataIndex={"connectionId"}
          title="Connection ID"
        />
        <Table.Column
          dataIndex=""
          render={(value, record: any, index) => (
            <Button
              type="primary"
              style={{
                color: token.colorTextBase,
              }}
              icon={<EyeFilled />}
              onClick={() => {
                go({
                  to: {
                    resource: "jobs",
                    action: "list",
                    id: record.config.id,
                  },
                  type: "push",
                });
              }}
            ></Button>
          )}
        />
      </Table>
    </List>
  );
};
