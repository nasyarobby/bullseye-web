import { Create, useForm } from "@refinedev/antd";
import { IResourceComponentsProps, useGo } from "@refinedev/core";
import MDEditor from "@uiw/react-md-editor";
import { Alert, Breadcrumb, Card, Collapse, Form, Input, Radio, Space } from "antd";
import JsonView from "react-json-view"
import React, { useState } from "react";
import { InfoIcon } from "../../components/Icons";
import { useParams } from "react-router-dom";

export const JobCreate: React.FC<IResourceComponentsProps> = () => {
    const params = useParams();
    const [expandedKey, setExpandedKey] = useState("")
    const { formProps, saveButtonProps, onFinish } = useForm<{ job: { id: string } }, any, {
        data: string,
        opts: {
            timeout?: number,
            removeOnComplete?: boolean | { age?: number, count?: number }
        },
        removeOnCompleteCount?: number,
        removeOnCompleteAge?: number
    }
    >({
        dataProviderName: "jobs",
        resource: "jobs",
        meta: {
            name: params.name
        },
    });
    const go = useGo()
    const [jsonIsError, setJsonIsError] = React.useState("")
    const [removeOnCompleteSetting, setRemoveOnCompleteSetting] = React.useState<"keep-job" | "remove-job" | "keep-some">("keep-job")
    const [removeOnFailSetting, setRemoveOnFailSetting] = React.useState<"keep-job" | "remove-job" | "keep-some">("keep-job")
    return (
        <Create saveButtonProps={saveButtonProps}
            breadcrumb={<Breadcrumb items={[
                {
                    title: 'Queues',
                    href: "#",
                    onClick: (e) => {
                        e.preventDefault();
                        go({
                            to: '/queues'
                        })
                    }
                },
                {
                    title: params.name,
                    href: "#",
                    onClick: (e) => {
                        e.preventDefault();
                        go({
                            to: '/queues/' + params.name
                        })
                    }
                },
                { title: 'Create job' }
            ]} />}>
            <Form {...formProps}
                layout="vertical"
                requiredMark="optional"
                initialValues={{
                    removeOnCompleteSetting: removeOnCompleteSetting,
                    removeOnFailSetting: removeOnFailSetting
                }}
                resource="jobs"
                onFinish={(values) => {
                    console.log({ values })
                    let removeOnComplete: boolean | { age?: number, count?: number } = false;

                    if (removeOnCompleteSetting === "remove-job") {
                        removeOnComplete = true;
                    }

                    if (removeOnCompleteSetting === "keep-some") {
                        removeOnComplete = {
                            count: Number(values.removeOnCompleteCount),
                            age: Number(values.removeOnCompleteAge),
                        }
                    }

                    return onFinish({
                        data: JSON.parse(values.data),
                        opts: {
                            ...values.opts,
                            timeout: values.opts.timeout === undefined ? undefined : Number(values.opts.timeout),
                            removeOnComplete
                        }
                    }).then((resp) => {
                        if (resp)
                            go({
                                to: "/queues/" + params.name + "/job/" + resp.data.job.id
                            })
                    })
                }}
            >
                <Form.Item
                    label={"Content"}
                    name="data"
                    initialValue={"{}"}
                    required={true}
                    rules={[
                        {
                            validator: async () => !jsonIsError ? Promise.resolve() : Promise.reject(jsonIsError),
                        },
                    ]}
                >
                    <MDEditor data-color-mode="light"
                        components={{
                            preview: (source) => {
                                try {
                                    const json = JSON.parse(source);
                                    setJsonIsError("")
                                    return <JsonView src={json} />
                                }
                                catch (err) {
                                    setJsonIsError((err as Error).message)
                                    return <>
                                        {(err as Error).message}
                                    </>
                                }
                            }
                        }} />
                </Form.Item>

                <Form.Item
                    label="Job ID"
                    name={["opts", "jobId"]}
                    required={false}
                    tooltip={{
                        title: 'Override the job ID - by default, the job ID is a unique integer,' +
                            'but you can use this setting to override it. ' +
                            "If you use this option, it is up to you to ensure the " +
                            "jobId is unique. If you attempt to add a job with an id that " +
                            "already exists, it will not be added (see caveat below about repeatable jobs).",
                        icon: <InfoIcon />
                    }}
                >
                    <Input type="text" />
                </Form.Item>
                <Collapse defaultActiveKey={expandedKey} onChange={() => {
                    setExpandedKey("1")
                }}>
                    <Collapse.Panel header="More options" key="1">
                        <Form.Item
                            label="Priority"
                            name={["opts", "priority"]}
                            tooltip={{
                                title: "Optional priority value. ranges from 1 (highest priority) to MAX_INT  (lowest priority). Note that " +
                                    "using priorities has a slight impact on performance, so do not use it if not required.",
                                icon: <InfoIcon />
                            }}
                        >
                            <Input type="number" />
                        </Form.Item>

                        <Form.Item
                            label="Delay (in milliseconds)"
                            name={["opts", "delay"]}
                            tooltip={{
                                title: "An amount of milliseconds to wait until this job can be processed. Note that for accurate delays, both " +
                                    "server and clients should have their clocks synchronized. [optional].",
                                icon: <InfoIcon />
                            }}
                        >
                            <Input type="number" />
                        </Form.Item>

                        <Form.Item
                            label="Timeout (in milliseconds)"
                            name={["opts", "timeout"]}
                            tooltip={{
                                title: "The number of milliseconds after which the job should fail with a timeout error [optional]",
                                icon: <InfoIcon />
                            }}
                        >
                            <Input type="number" />
                        </Form.Item>

                        <Form.Item
                            label="Attempts"
                            name={["opts", "attempts"]}
                            tooltip={{
                                title: "The total number of attempts to try the job until it completes.",
                                icon: <InfoIcon />
                            }}
                        >
                            <Input type="number" />
                        </Form.Item>

                        <Form.Item
                            label="On complete"
                            name="removeOnCompleteSetting"
                            tooltip={{
                                title: "",
                                icon: <InfoIcon />
                            }}
                        >
                            <Radio.Group value={removeOnCompleteSetting} onChange={e => {
                                setRemoveOnCompleteSetting(e.target.value)
                            }}>
                                <Radio.Button value="keep-some">Keep some</Radio.Button>
                                <Radio.Button value="keep-job">Keep this job</Radio.Button>
                                <Radio.Button value="remove-job">Remove this job</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        {removeOnCompleteSetting === "keep-some"
                            &&
                            <Card>
                                <Space direction="vertical" size={"large"}>
                                    <Alert type="info" message={`Specify which jobs to keep after finishing. 
                                If both age and count are specified, 
                                then the jobs kept will be the ones that satisfies both properties.`}></Alert>
                                    <Form.Item name={['removeOnCompleteCount']} label="Maximum count of jobs to be kept" >
                                        <Input type="number" />
                                    </Form.Item>
                                    <Form.Item name={['removeOnCompleteAge']} label="Maximum age in seconds for job to be kept." >
                                        <Input type="number" />
                                    </Form.Item>
                                </Space>
                            </Card>
                        }

                        <Form.Item
                            label="On fail"
                            name="removeOnFailSetting"
                            tooltip={{
                                title: "",
                                icon: <InfoIcon />
                            }}
                        >
                            <Radio.Group value={removeOnFailSetting} onChange={e => {
                                setRemoveOnFailSetting(e.target.value)
                            }}>
                                <Radio.Button value="keep-some">Keep some</Radio.Button>
                                <Radio.Button value="keep-job">Keep this job</Radio.Button>
                                <Radio.Button value="remove-job">Remove this job</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        {removeOnFailSetting === "keep-some"
                            &&
                            <Card>
                                <Space direction="vertical" size={"large"}>
                                    <Alert type="info" message={`Specify which jobs to keep when it fails. 
                                If both age and count are specified, 
                                then the jobs kept will be the ones that satisfies both properties.`}></Alert>
                                    <Form.Item name={['removeOnFailCount']} label="Maximum count of jobs to be kept" >
                                        <Input type="number" />
                                    </Form.Item>
                                    <Form.Item name={['removeOnFailAge']} label="Maximum age in seconds for job to be kept." >
                                        <Input type="number" />
                                    </Form.Item>
                                </Space>
                            </Card>
                        }

                        <Form.Item
                            label="Stack trace limit"
                            tooltip={{
                                title: "Limits the amount of stack trace lines that will be recorded in the stacktrace.",
                                icon: <InfoIcon />
                            }}
                        >
                            <Input type="number" />
                        </Form.Item>
                    </Collapse.Panel>
                </Collapse>
            </Form>
        </Create >
    );
};
