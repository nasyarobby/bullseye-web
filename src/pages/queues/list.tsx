import { useTable, List } from "@refinedev/antd";
import { IResourceComponentsProps, useGo } from "@refinedev/core";
import { Button, Table, Tag, theme } from "antd";

import { useState } from "react";
import useWebSocket from "react-use-websocket";
import { EditIcon, MonitorQueueIcon, NewQueueIcon, ViewIcon } from "../../components/Icons";

const { useToken } = theme;

export const QueuesList: React.FC<IResourceComponentsProps> = () => {
  const { token } = useToken();
  const go = useGo();
  const { tableProps } = useTable({
    syncWithLocation: true,
    resource: "queues",
    pagination: {
      mode: "off"
    }
  });

  const [dataSource, setDataSource] = useState<
    { id: string, stats: any }[]
  >([]);

  const { lastMessage, readyState } = useWebSocket('ws://localhost:3001/ws/queues-stats', {
    reconnectAttempts: 5,
    shouldReconnect: () => true,
    reconnectInterval: 10 * 1000,
    onMessage: (e) => {
      const data = JSON.parse(e.data);
      setDataSource(state => {
        const newArr = state.filter(row => row.id !== data.queueId);
        return [...newArr, { id: data.queueId, stats: data.count || null }]
      })
    }
  });

  const modifiedDataSource = tableProps.dataSource?.map(row => {
    const statsFromWs = dataSource.find(r => r.id === row.id)
    return {
      ...row, stats: {
        ...row.stats,
        jobCounts: statsFromWs ? statsFromWs.stats : row.stats.jobCounts
      }
    }
  }
  ) || [];

  return (
    <List
      headerButtons={() => (
        <Button
          type="primary"
          icon={<NewQueueIcon />}
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
        dataSource={modifiedDataSource}
        rowKey="label"
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
              <Tag>Completed: {val?.completed ?? "-"}</Tag>
              <Tag>Active: {val?.active ?? "-"}</Tag>
              <Tag>Waiting: {val?.waiting ?? "-"}</Tag>
              <Tag>Failed: {val?.failed ?? "-"}</Tag>
            </>
          }}
        />

        <Table.Column
          dataIndex={["stats", "workers"]}
          title="Workers"
          render={(val) => {
            return <>
              {val?.length ?? "-"}
            </>
          }}
        />
        <Table.Column
          dataIndex="id"
          render={(value) => (
            <div style={{ display: "flex", gap: "4px" }}>
              <Button
                type="primary"
                style={{
                  color: token.colorTextBase,
                }}
                icon={<ViewIcon />}
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
              />

              <Button
                type="primary"
                style={{
                  color: token.colorTextBase,
                }}
                icon={<MonitorQueueIcon />}
                title="Monitor Real-Time"
                onClick={() => {
                  go({
                    to: "/queue-stats/"+value,
                    type: "push",
                  });
                }}
              />

              <Button
                type="primary"
                style={{
                  color: token.colorTextBase,
                }}
                icon={<EditIcon />}
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
              />
            </div>
          )}
        />
      </Table>
    </List>
  );
};
