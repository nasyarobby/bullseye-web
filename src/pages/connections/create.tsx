import { Create, useForm, useSelect } from "@refinedev/antd";
import { IResourceComponentsProps } from "@refinedev/core";
import MDEditor from "@uiw/react-md-editor";
import { Form, Input, Select } from "antd";
import React from "react";

export const ConnectionCreate: React.FC<IResourceComponentsProps> = () => {
    const { formProps, saveButtonProps } = useForm({
    });


    const { selectProps: categorySelectProps } = useSelect({
        resource: "categories",
    });

    return (
        <Create saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
            <Form.Item
                    label={"Connection's name"}
                    name={["name"]}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={"Host"}
                    name={["host"]}
                    initialValue={"127.0.0.1"}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>


                <Form.Item
                    label={"Port"}
                    name={["port"]}
                    initialValue={"6379"}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input type="number"/>
                </Form.Item>

                <Form.Item
                    label={"Password"}
                    name={["password"]}
                >
                    <Input type="password" />
                </Form.Item>

                <Form.Item
                    label={"db"}
                    name={["db"]}
                    initialValue={0}
                >
                    <Select
                    defaultValue={0}
                    options={[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(n => ({value: n, label: n.toString()}))}
                    style={{ width: 120 }}
                />
                </Form.Item>
            </Form>
        </Create>
    );
};
