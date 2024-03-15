import { Edit, useForm } from "@refinedev/antd";
import { IResourceComponentsProps } from "@refinedev/core";
import { Form, Input, Select } from "antd";
import React from "react";
import { Connection } from "../../@types";

export const ConnectionEdit: React.FC<IResourceComponentsProps> = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { formProps, saveButtonProps } = useForm<any, any, Connection>({
        dataProviderName: "connections"
    });

    const connection= (formProps.initialValues as {connection?:Connection});
    const initialValues = connection?.connection?.config
    return (
        <Edit saveButtonProps={saveButtonProps} >
            <Form
                {...formProps}
                layout="vertical"
                initialValues={initialValues}>
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
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input type="number" />
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
                >
                    <Select
                        defaultValue={0}
                        options={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(n => ({ value: n, label: n.toString() }))}
                        style={{ width: 120 }}
                    />
                </Form.Item>
            </Form>
        </Edit>
    );
};
