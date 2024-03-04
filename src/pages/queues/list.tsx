import { useTable, List } from "@refinedev/antd";
import { IResourceComponentsProps, useGo } from "@refinedev/core";
import { Button, Table, Tag, theme } from "antd";
import { EyeFilled, ThunderboltFilled as NewIcon } from "@ant-design/icons";

const { useToken } = theme;

export const QueuesList: React.FC<IResourceComponentsProps> = () => {
  const { token } = useToken();
  const go = useGo();
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
          dataIndex={["stats", "jobCounts"]}
          title="Stats"
          render={(val) => {
            return <>
              <Tag>Completed: {val.completed}</Tag>
              <Tag>Active: {val.active}</Tag>
              <Tag>Failed: {val.failed}</Tag>
            </>
          }}
        />

        <Table.Column
          dataIndex={["stats", "workers"]}
          title="Workers"
          render={(val) => {
            return <>
              {val.length}
            </>
          }}
        />
        <Table.Column
          dataIndex="id"
          render={(value) => (
            <>
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
                    id: value,
                  },
                  type: "push",
                });
              }}
            ></Button>

<Button
              type="primary"
              style={{
                color: token.colorTextBase,
              }}
              icon={<EyeFilled />}
              onClick={() => {
                go({
                  to: {
                    resource: "queues",
                    action: "edit",
                    id: value,
                  },
                  type: "push",
                });
              }}
            ></Button>
            </>
          )}
        />
      </Table>
    </List>
  );
};
