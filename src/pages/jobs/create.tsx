import { Create, useForm, useSelect } from "@refinedev/antd";
import { IResourceComponentsProps } from "@refinedev/core";
import MDEditor from "@uiw/react-md-editor";
import { Form, Select } from "antd";
import React from "react";

export const BlogPostCreate: React.FC<IResourceComponentsProps> = () => {
    const { formProps, saveButtonProps } = useForm({
    });


    const { selectProps: categorySelectProps } = useSelect({
        resource: "categories",
    });

    return (
        <Create saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
                <Form.Item
                    label={"JobData"}
                    name={["title"]}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Textarea />
                </Form.Item>
                <Form.Item
                    label={"Content"}
                    name="content"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <MDEditor data-color-mode="light" />
                </Form.Item>
                <Form.Item
                    label={"Category"}
                    name={["category", "id"]}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select {...categorySelectProps} />
                </Form.Item>
                <Form.Item
                    label={"Status"}
                    name={["status"]}
                    initialValue={"draft"}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select
                        defaultValue={"draft"}
                        options={[{ "value": "draft", "label": "Draft" }, { "value": "published", "label": "Published" }, { "value": "rejected", "label": "Rejected" }]}
                        style={{ width: 120 }}
                    />
                </Form.Item>
            </Form>
        </Create>
    );
};
