import { DateField, useTable, List } from "@refinedev/antd";
import { IResourceComponentsProps, useGo } from "@refinedev/core";
import { Button, Image, Radio, Table, theme } from "antd";
import JsonView from "react-json-view";
import { useState } from "react";
import { RadioChangeEvent } from "antd/lib";
import { useParams } from "react-router-dom";
import { Typography } from "antd";
import { CreateJobIcon, ViewIcon } from "../../components/Icons";
import QueuePauseButton from "../../components/QueuePauseButton";
import { Job } from "../../@types";

const { Paragraph } = Typography;

const { useToken } = theme;

export const JobList: React.FC<IResourceComponentsProps> = () => {
  const { token } = useToken();
  const go = useGo();
  const params = useParams<{ name: string }>()
  const customStyle: React.CSSProperties = { color: token.colorTextBase };

  const [jobStatus, setJobStatus] = useState<string>("completed");
  const { tableProps, tableQueryResult } = useTable<Job>({
    syncWithLocation: true,
    dataProviderName: "jobs",
    resource: "queues",
    pagination: {
      pageSize: 50,
    },
    meta: {
      status: jobStatus,
    },
  });

  return (
    <List
      headerButtons={() => (
        <>
          <Button
            type="primary"
            icon={<CreateJobIcon />}
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
            Create Job
          </Button>

          <QueuePauseButton queueSlug={params.name} />
        </>
      )}
    >
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
            <Radio.Button key={status.value} value={status.value} style={customStyle}>
              {status.text}
            </Radio.Button>
          );
        })}
      </Radio.Group>
      <Table
        {...tableProps}
        rowKey="label"
        bordered
        size="small"
      >
        <Table.Column dataIndex={"id"} title="ID" />

        {
          tableQueryResult.data?.dataFields.map((field: { columnName: string, jsonPath: string, type: string }) => {
            return <Table.Column
              key={field.columnName}
              dataIndex={field.jsonPath.split(".")}
              title={field.columnName}
              render={(val => {
                if (field.type === "base64jpg") {
                  return <Image height={150} width={100} src={`data:image/jpg;base64, ${val}`} />
                }
                else {
                  return val
                }
              })}
            />
          })
        }

        <Table.Column
          dataIndex="data"
          title="Raw Data"
          render={(value: object) => {
            return <JsonView src={value} collapsed={0} />;
          }}
        />

        {
          jobStatus === "failed" &&
          <Table.Column
            dataIndex={["failedReason"]}
            title="Failed Reason"
            render={(val, record: Job) => {
              return <div
                style={{ width: '200px', wordWrap: "break-word", display: "inline-block" }}
                title={record.stacktrace.join("\n")}>{val}</div>
            }}
          />
        }

        <Table.Column
          dataIndex="returnvalue"
          title="Returnvalue"
          render={(value: null | string | number | object) => {
            if (value === null) {
              return "null"
            }

            if (typeof value === "string") {
              if (value.startsWith("http"))
                return <a href={value.toString()} target="__blank">{value.toString()}</a>
              else
                return <Paragraph style={{ wordWrap: "break-word" }} ellipsis={false}>{value}</Paragraph>
            }
            else if (typeof value === 'number') {
              return value;
            }

            return <JsonView src={value} collapsed={0} />;
          }}
        />

        <Table.Column
          dataIndex={["timestamp"]}
          title="Timestamp"
          render={(value: string) => (
            <DateField locales="ID" format="ll HH:mm:ss" value={value} />
          )}
        />

        <Table.Column
          dataIndex={["processedOn"]}
          title="Processed On"
          render={(value: string | null) => (
            value === null ? '-' : <DateField locales="ID" format="ll HH:mm:ss" value={value} />
          )}
        />
        {
          ["completed"].includes(jobStatus) &&
          <Table.Column
            dataIndex={["finishedOn"]}
            title="Finished On"
            render={(value: string | null) => (
              <DateField locales="ID" format="ll HH:mm:ss" value={value} />
            )}
          />
        }

        <Table.Column
          dataIndex="id"
          render={(value: string) => (
            <Button
              type="primary"
              style={{
                color: token.colorTextBase,
              }}
              icon={<ViewIcon />}
              onClick={() => {
                go({
                  to: "/queues/" + params?.name + "/job/" + value,
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
