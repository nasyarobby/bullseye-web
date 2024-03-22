import { useTable, List, DeleteButton } from "@refinedev/antd";
import { IResourceComponentsProps, useGo } from "@refinedev/core";
import { Button, Table, Tag } from "antd";

import { useState } from "react";
import useWebSocket from "react-use-websocket";
import { EditIcon, MonitorQueueIcon, NewQueueIcon, ViewIcon, WarningZoneIcon } from "../../components/Icons";
import QueuePauseButton from "../../components/QueuePauseButton";

export const QueuesList: React.FC<IResourceComponentsProps> = () => {
  const go = useGo();
  const { tableProps } = useTable({
    syncWithLocation: true,
    resource: "queues",
    pagination: {
      mode: "off"
    }
  });

  const [dataSource, setDataSource] = useState<
    { id: string, stats: object | null }[]
  >([]);

  useWebSocket('ws://localhost:3001/ws/queues-stats', {
    reconnectAttempts: 5,
    shouldReconnect: () => true,
    reconnectInterval: 10 * 1000,
    onMessage: (e) => {
      const data = JSON.parse(e.data) as {queueId: string, count: object | null};
      setDataSource(state => {
        const newArr = state.filter(row => row.id !== data.queueId);
        return [...newArr, { id: data.queueId, stats: data.count }]
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
              <Tag color="green">Completed: {val?.completed ?? "-"}</Tag>
              <Tag color="blue">Active: {val?.active ?? "-"}</Tag>
              <Tag>Waiting: {val?.waiting ?? "-"}</Tag>
              <Tag>Paused: {val?.paused ?? "-"}</Tag>
              <Tag color="red">Failed: {val?.failed ?? "-"}</Tag>
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
          dataIndex="slug"
          render={(value) => (
            <div style={{ display: "flex", gap: "4px" }}>
              <Button
                type="primary"
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
                icon={<MonitorQueueIcon />}
                title="Monitor Real-Time"
                onClick={() => {
                  go({
                    to: "/queue-stats/" + value,
                    type: "push",
                  });
                }}
              />

              <Button
                type="primary"
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
              <QueuePauseButton queueSlug={value} hideLabel={true} />
              <Button
                type="primary"
                title="Warning zone"
                icon={<WarningZoneIcon />}
                onClick={() => {
                  go({
                    to: "/warning-zone/" + value,
                    type: "push",
                  });
                }}
              />
              <DeleteButton hideText recordItemId={value} resource="queues" />
            </div>
          )}
        />
      </Table>
    </List>
  );
};
