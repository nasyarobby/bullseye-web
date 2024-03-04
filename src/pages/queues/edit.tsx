import { Edit, useForm, useSelect } from "@refinedev/antd";
import { IResourceComponentsProps } from "@refinedev/core";
import { Button, Form, Input, Select, Tag } from "antd";
import React, { useEffect, useState } from "react";

export const QueueEdit: React.FC<IResourceComponentsProps> = () => {
    const { formProps, saveButtonProps, queryResult, formLoading, onFinish } = useForm({

    });

    // const blogPostsData = queryResult?.data?.data;

    const { selectProps: connRedisSelectProps } = useSelect({
        resource: "connections",
        dataProviderName: "connections",
        optionLabel: 'friendlyName'
    });

    const [fields, setFields] = useState<string[]>([])
    const [labels, setLabels] = useState<string[]>([])

    useEffect(() => {
        if (queryResult?.data?.data?.dataFields) {
            setLabels(state => {
                return queryResult.data.data.dataFields.map(row => {
                    return row.label
                })
            })

            setFields(state => {
                return queryResult.data.data.dataFields.map(row => {
                    return row.field.join(".")
                })
            })
        }
    }, [queryResult?.status === "success"])

    return (
        <Edit saveButtonProps={saveButtonProps} isLoading={formLoading}>
            <Form {...formProps} layout="vertical" 
            onFinish={(values) => {
                return onFinish({
                    ...values, 
                    dataFields: labels.map((s,index) => {
                        return {label:s, field: fields[index]}
                    })
                })
            }}>
                <Form.Item
                    label={"ID"}
                    name={["id"]}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={"Queue Name"}
                    name={["queueName"]}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={"Connection"}
                    name={["connectionId"]}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select {...connRedisSelectProps} />
                </Form.Item>

                {
                    labels.map((l, index) => {
                        return <>
                            <Form.Item
                                label={"Field #" + index}
                                initialValue={l}
                            >
                                <Input value={l} onChange={e => setLabels(state => {
                                    return [...state.slice(0, index), e.target.value, ...state.slice(index + 1)]
                                })} />
                            </Form.Item>
                            <Form.Item
                                label={"Value #" + index}
                                initialValue={fields[index]}
                            >
                                <Input value={fields[index]} onChange={e => setFields(state => {
                                    return [...state.slice(0, index), e.target.value, ...state.slice(index + 1)]
                                })} />
                            </Form.Item>
                            <Form.Item>
                                <Button onClick={e => {
                                    setLabels(state => {
                                        return state.filter((v,i) => i!==index)
                                    })
                                    setFields(state => {
                                        return state.filter((v,i) => i!==index)
                                    })
                                }
                            }>Remove</Button>
                            </Form.Item>
                        </>
                    })
                }
                
                <Button onClick={() => {
                    setLabels(state => {
                        return [...state, ""]
                    })
                }}>Add</Button>
            </Form>
        </Edit>
    );
};
