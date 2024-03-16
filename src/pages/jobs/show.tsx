import {
    DateField,
    DeleteButton,
    MarkdownField,
    NumberField,
    Show,
    TextField,
} from "@refinedev/antd";
import { IResourceComponentsProps, useShow } from "@refinedev/core";
import { Divider, Typography } from "antd";
import { off } from "process";
import React from "react";
import JsonView from "react-json-view"
import { useParams } from "react-router-dom";

const { Title } = Typography;

export const JobShow: React.FC<IResourceComponentsProps> = () => {
    const { queryResult } = useShow({
        dataProviderName: "jobs",
    });
    const params = useParams();
    const { data, isLoading } = queryResult;

    console.log({ queryResult, params })

    const record = data?.data;

    if (!record) {
        return <Show isLoading={true} />
    }

    return (
        <Show isLoading={isLoading} title={`Job ${record.id}`}>
            {
                Object.keys(record).map(key => {
                    if (["opts", "data"].includes(key)) {
                        return <>
                            <Title level={5}>{key}</Title>
                            <JsonView src={record ? record[key] : {}} />
                        </>
                    }

                    if (key === "returnvalue") {
                        const data = record[key];


                        if (!data || typeof data === "string") {
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
                <DeleteButton onSuccess={() => {
                    navigation.goBack();
                }} recordItemId={record.id} resource="jobs" dataProviderName="jobs" meta={{fields: {name: params.name}}}/>
        </Show>
    );
};
