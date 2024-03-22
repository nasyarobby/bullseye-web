import {
    DateField,
    DeleteButton,
    Show,
    TextField,
} from "@refinedev/antd";
import { IResourceComponentsProps, useGo, useShow } from "@refinedev/core";
import { Divider, Typography } from "antd";
import React from "react";
import JsonView from "react-json-view"
import { useLocation, useParams } from "react-router-dom";

const { Title } = Typography;

export const JobShow: React.FC<IResourceComponentsProps> = () => {
    const { queryResult } = useShow({
        dataProviderName: "jobs",
    });
    const params = useParams();
    const { data, isLoading } = queryResult;
    const record = data?.data;
    const go = useGo();
    const { search } = useLocation();
    const searchParams = new URLSearchParams(search)

    if (!record) {
        return <Show isLoading={true} />
    }

    return (
        <Show isLoading={isLoading} title={`Job ${record.id}`} recordItemId={record.id}>
            {
                Object.keys(record).map(key => {
                    if (["opts", "data"].includes(key)) {
                        return <>
                            <Title level={5}>{key}</Title>
                            <JsonView src={record ? record[key] : {}} />
                        </>
                    }

                    if (key === "returnvalue" || key === "progress") {
                        const data = record[key];

                        if (!data || typeof data === "string" || typeof data === "number") {
                            return <>
                                <Title level={5}>{key}</Title>
                                <TextField value={data === null ? "null" : data}></TextField>
                            </>

                        }

                        return <>
                            <Title level={5}>{key}</Title>
                            <JsonView src={record ? record[key] : {}} />
                        </>
                    }

                    if (key === 'stacktrace') {
                        return <>
                            <Title level={5}>{key}</Title>
                            <pre>{record[key]}</pre>
                        </>
                    }

                    if (["timestamp", "finishedOn", "processedOn"].includes(key)) {
                        return <>
                            <Title level={5}>{key}</Title>
                            <DateField format="YYYY-MM-DD HH:mm:ss Z" value={record ? record[key] : ""} />
                        </>
                    }
                    return <>
                        <Title level={5}>{key}</Title>
                        <TextField value={record ? record[key].toString() : ""}></TextField>
                    </>
                })}
            <Divider />
            <DeleteButton
                onSuccess={() => {
                    go({
                        to: `/queues/${params.name}?status=${searchParams.get("status") || "completed"}`
                    })
                }}
                recordItemId={record.id}
                resource="jobs" dataProviderName="jobs"
                meta={{ name: params.name }} />
        </Show>
    );
};
