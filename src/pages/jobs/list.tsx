import { DateField, useTable } from "@refinedev/antd";
import { IResourceComponentsProps, useGo } from "@refinedev/core";
import { Button, List, Radio, Table, Tag, theme } from "antd";
import JsonView from "react-json-view";
import { useState } from "react";
import { RadioChangeEvent } from "antd/lib";
import { EyeFilled } from "@ant-design/icons";
import { useParams } from "react-router-dom";

const { useToken } = theme;

export const JobList: React.FC<IResourceComponentsProps> = () => {
  const { token } = useToken();
  const go = useGo();
  const params = useParams<{ name: string }>()

  const customStyle: React.CSSProperties = { color: token.colorTextBase };

  const [jobStatus, setJobStatus] = useState<string>("completed");
  const { tableProps } = useTable({
    syncWithLocation: true,
    dataProviderName: "jobs",
    resource: "queues",
    pagination: {
      pageSize: 10,
    },
    meta: {
      status: jobStatus,
      fields: {
        queue: params?.name
      }
    },
  });

  return (
    <List>
      <Radio.Group
        // defaultValue={jobStatus}
        style={{
          marginBottom: "10px",
        }}
        value={jobStatus}
        buttonStyle="solid"
        onChange={(e: RadioChangeEvent) => {
          setJobStatus(e.target.value);
        }}
      >
        {[
          { text: "Completed", value: "completed" },
          { text: "Active", value: "active" },
          { text: "Delayed", value: "delayed" },
          { text: "Waiting", value: "waiting" },
          { text: "Paused", value: "paused" },
          // { text: "Stuck", value: "stuck" },
          { text: "Failed", value: "failed" },
        ].map((status) => {
          return (
            <Radio.Button value={status.value} style={customStyle}>
              {status.text}
            </Radio.Button>
          );
        })}
      </Radio.Group>
      <Table
        {...tableProps}
        rowKey="label"
        pagination={{ showSizeChanger: true }}
        bordered
        size="small"
      >
        <Table.Column dataIndex={"id"} title="ID" />
        <Table.Column
          dataIndex="data"
          title="Raw Data"
          render={(value: object, record: any) => {
            return <JsonView src={value} collapsed={0} />;
          }}
        />
        <Table.Column
          dataIndex={["timestamp"]}
          title="Timestamp"
          align="center"
          render={(value: any) => (
            <DateField locales="ID" format="ll HH:mm:ss" value={value} />
          )}
        />
        <Table.Column
          dataIndex={["processedOn"]}
          title="Processed On"
          align="center"
          render={(value: any) => (
            <DateField locales="ID" format="ll HH:mm:ss" value={value} />
          )}
        />
        <Table.Column
          dataIndex={["finishedOn"]}
          title="Finished On"
          align="center"
          render={(value: any) => (
            <DateField locales="ID" format="ll HH:mm:ss" value={value} />
          )}
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
                    action: "show",
                    id: record.id,
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
